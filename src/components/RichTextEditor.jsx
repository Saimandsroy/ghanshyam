import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * RichTextEditor - A reusable rich text editor component using Quill.js
 * 
 * Features:
 * - Bold, Italic, Underline, Strikethrough
 * - Link insertion
 * - H2 and H3 headings
 * - Blockquote
 * - Inline code
 * - Ordered and bullet lists
 * - Image upload with remove capability
 * - Undo/Redo (history module)
 * 
 * Usage:
 *   <RichTextEditor
 *     value={content}
 *     onChange={setContent}
 *     placeholder="Enter your message..."
 *     label="Message"
 *     required={true}
 *   />
 */

// Custom icons for Undo and Redo (SVG)
const icons = Quill.import('ui/icons');
icons['undo'] = `<svg viewBox="0 0 18 18"><path fill="currentColor" d="M12.5 8c-2.5 0-4.5 1.3-5.7 3.3l-1.3-1.3V14h4l-1.5-1.5c.9-1.4 2.4-2.3 4.5-2.3 2.8 0 5 2.2 5 5h1.5c0-3.6-2.9-6.5-6.5-6.5z" transform="translate(-3, -4)"/></svg>`;
icons['redo'] = `<svg viewBox="0 0 18 18"><path fill="currentColor" d="M5.5 8c2.5 0 4.5 1.3 5.7 3.3l1.3-1.3V14h-4l1.5-1.5c-.9-1.4-2.4-2.3-4.5-2.3-2.8 0-5 2.2-5 5H-.5c0-3.6 2.9-6.5 6-6.5z" transform="translate(3, -4)"/></svg>`;

// Custom styles for the editor (SaaS/admin-panel look)
const editorStyles = `
  .rich-editor-container .ql-toolbar {
    background: var(--background-dark, #1a1a2e);
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-radius: 12px 12px 0 0;
    padding: 8px 12px;
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .rich-editor-container .ql-container {
    background: var(--input-background, rgba(255,255,255,0.03));
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-top: none;
    border-radius: 0 0 12px 12px;
    min-height: 220px;
    max-height: 350px;
    overflow-y: auto;
    font-family: inherit;
  }
  
  .rich-editor-container .ql-editor {
    min-height: 200px;
    color: var(--text-primary, #fff);
    font-size: 14px;
    line-height: 1.6;
  }
  
  .rich-editor-container .ql-editor.ql-blank::before {
    color: var(--text-muted, rgba(255,255,255,0.4));
    font-style: normal;
  }
  
  /* Toolbar button styling */
  .rich-editor-container .ql-toolbar button {
    color: var(--text-secondary, rgba(255,255,255,0.7));
    width: 28px;
    height: 28px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .rich-editor-container .ql-toolbar button:hover {
    color: var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-toolbar button.ql-active {
    color: var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-toolbar .ql-stroke {
    stroke: var(--text-secondary, rgba(255,255,255,0.7));
  }
  
  .rich-editor-container .ql-toolbar button:hover .ql-stroke,
  .rich-editor-container .ql-toolbar button.ql-active .ql-stroke {
    stroke: var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-toolbar .ql-fill {
    fill: var(--text-secondary, rgba(255,255,255,0.7));
  }
  
  .rich-editor-container .ql-toolbar button:hover .ql-fill,
  .rich-editor-container .ql-toolbar button.ql-active .ql-fill {
    fill: var(--primary-cyan, #00d4ff);
  }
  
  /* Picker styling (for headings) */
  .rich-editor-container .ql-toolbar .ql-picker {
    color: var(--text-secondary, rgba(255,255,255,0.7));
  }
  
  .rich-editor-container .ql-toolbar .ql-picker-label {
    color: var(--text-secondary, rgba(255,255,255,0.7));
    border: none;
  }
  
  .rich-editor-container .ql-toolbar .ql-picker-label:hover,
  .rich-editor-container .ql-toolbar .ql-picker-label.ql-active {
    color: var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-toolbar .ql-picker-options {
    background: var(--card-background, #1e1e2f);
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-radius: 8px;
    padding: 8px;
  }
  
  .rich-editor-container .ql-toolbar .ql-picker-item {
    color: var(--text-secondary, rgba(255,255,255,0.7));
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .rich-editor-container .ql-toolbar .ql-picker-item:hover {
    color: var(--primary-cyan, #00d4ff);
    background: rgba(0, 212, 255, 0.1);
  }
  
  /* Header buttons styling */
  .rich-editor-container .ql-toolbar button.ql-header {
    width: auto;
    padding: 4px 8px;
    font-weight: 600;
  }
  
  /* Content styling */
  .rich-editor-container .ql-editor a {
    color: var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-editor blockquote {
    border-left: 4px solid var(--primary-cyan, #00d4ff);
    padding-left: 16px;
    margin: 12px 0;
    color: var(--text-secondary, rgba(255,255,255,0.7));
  }
  
  .rich-editor-container .ql-editor pre {
    background: var(--background-dark, #1a1a2e);
    border-radius: 6px;
    padding: 12px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
  }
  
  .rich-editor-container .ql-editor code {
    background: var(--background-dark, #1a1a2e);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 13px;
  }
  
  /* Image styling with delete button */
  .rich-editor-container .ql-editor img {
    max-width: 100%;
    border-radius: 8px;
    cursor: pointer;
    transition: outline 0.2s;
  }
  
  .rich-editor-container .ql-editor img:hover {
    outline: 2px solid var(--primary-cyan, #00d4ff);
  }
  
  .rich-editor-container .ql-editor img.selected {
    outline: 3px solid var(--primary-cyan, #00d4ff);
  }
  
  /* Tooltip styling (for link input) */
  .rich-editor-container .ql-snow .ql-tooltip {
    background: var(--card-background, #1e1e2f);
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-radius: 8px;
    color: var(--text-primary, #fff);
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    padding: 8px 12px;
    z-index: 100;
  }
  
  .rich-editor-container .ql-snow .ql-tooltip::before {
    color: var(--text-secondary, rgba(255,255,255,0.7));
  }
  
  .rich-editor-container .ql-snow .ql-tooltip input[type=text] {
    background: var(--input-background, rgba(255,255,255,0.05));
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-radius: 6px;
    color: var(--text-primary, #fff);
    padding: 8px 12px;
    width: 200px;
  }
  
  .rich-editor-container .ql-snow .ql-tooltip a.ql-action::after,
  .rich-editor-container .ql-snow .ql-tooltip a.ql-remove::after {
    border-right: none;
    margin-left: 8px;
  }
  
  .rich-editor-container .ql-snow .ql-tooltip a {
    color: var(--primary-cyan, #00d4ff);
    cursor: pointer;
  }
  
  .rich-editor-container .ql-snow .ql-tooltip a:hover {
    text-decoration: underline;
  }

  /* Format group separators */
  .rich-editor-container .ql-toolbar .ql-formats {
    margin-right: 8px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .rich-editor-container .ql-toolbar {
      padding: 6px 8px;
    }
    
    .rich-editor-container .ql-container {
      min-height: 180px;
    }
  }
`;

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  label,
  required = false,
  className = '',
  disabled = false
}) {
  const quillRef = useRef(null);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.history.undo();
    }
  }, []);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.history.redo();
    }
  }, []);

  // Toolbar configuration matching user's image:
  // B, I, U, S, Link, H2, H3, Blockquote, Code, Bullet, Ordered, Image, Undo, Redo
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],    // B, I, U, S
        ['link'],                                      // Link icon
        [{ 'header': 2 }, { 'header': 3 }],           // H2, H3
        ['blockquote', 'code-block'],                 // Blockquote, Code
        [{ 'list': 'bullet' }, { 'list': 'ordered' }], // Lists
        ['image'],                                     // Image
        ['undo', 'redo']                              // Undo, Redo
      ],
      handlers: {
        undo: function () {
          this.quill.history.undo();
        },
        redo: function () {
          this.quill.history.redo();
        }
      }
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true
    }
  }), []);

  // Allowed formats in the editor
  const formats = useMemo(() => [
    'bold', 'italic', 'underline', 'strike',
    'link',
    'header',
    'blockquote', 'code-block',
    'list', 'bullet',
    'image'
  ], []);

  // Handle content change
  const handleChange = useCallback((content, delta, source, editor) => {
    onChange(content);
  }, [onChange]);

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      // Add click handler for images to show delete option
      editor.root.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
          // Remove previous selection
          const prevSelected = editor.root.querySelector('img.selected');
          if (prevSelected) prevSelected.classList.remove('selected');

          // Add selection to clicked image
          e.target.classList.add('selected');

          // Create delete button if not exists
          let deleteBtn = document.getElementById('quill-img-delete');
          if (!deleteBtn) {
            deleteBtn = document.createElement('button');
            deleteBtn.id = 'quill-img-delete';
            deleteBtn.innerHTML = '🗑️ Remove Image';
            deleteBtn.style.cssText = `
              position: absolute;
              background: #ef4444;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
              z-index: 100;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(deleteBtn);
          }

          // Position delete button
          const rect = e.target.getBoundingClientRect();
          deleteBtn.style.top = `${rect.top + window.scrollY + 8}px`;
          deleteBtn.style.left = `${rect.right + window.scrollX - 120}px`;
          deleteBtn.style.display = 'block';

          // Delete handler
          deleteBtn.onclick = () => {
            const blot = Quill.find(e.target);
            if (blot) {
              blot.remove();
            }
            deleteBtn.style.display = 'none';
          };
        } else {
          // Click outside image - hide delete button and remove selection
          const deleteBtn = document.getElementById('quill-img-delete');
          if (deleteBtn) deleteBtn.style.display = 'none';

          const prevSelected = editor.root.querySelector('img.selected');
          if (prevSelected) prevSelected.classList.remove('selected');
        }
      });
    }

    // Cleanup
    return () => {
      const deleteBtn = document.getElementById('quill-img-delete');
      if (deleteBtn) deleteBtn.remove();
    };
  }, []);

  return (
    <div className={`rich-editor-wrapper ${className}`}>
      {/* Inject custom styles */}
      <style>{editorStyles}</style>

      {/* Label */}
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          {label}
          {required && <span style={{ color: 'var(--error, #ef4444)' }}>*</span>}
        </label>
      )}

      {/* Editor container */}
      <div className="rich-editor-container">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
        />
      </div>
    </div>
  );
}

// Utility function to strip HTML tags for plain text preview
export function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Utility function to check if content is empty (just whitespace or empty tags)
export function isContentEmpty(html) {
  if (!html) return true;
  const stripped = stripHtml(html).trim();
  return stripped.length === 0;
}

export default RichTextEditor;
