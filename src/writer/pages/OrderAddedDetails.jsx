import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload } from 'lucide-react';
import { writerAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function OrderAddedDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [websiteSubmissions, setWebsiteSubmissions] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [globalNote, setGlobalNote] = useState('');
    const fileInputRefs = useRef({});

    // Check if order is Niche Edit
    const isNicheEdit = task?.order_type?.toLowerCase().includes('niche');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await writerAPI.getTask(id);
                const taskData = response.task;
                setTask(taskData);

                if (taskData.selected_websites) {
                    setWebsiteSubmissions(
                        taskData.selected_websites.map(sw => ({
                            id: sw.id,
                            domain_url: sw.domain_url,
                            target_url: sw.target_url,
                            anchor_text: sw.anchor_text,
                            article_title: sw.article_title,
                            post_url: sw.copy_url || sw.post_url || '',
                            content_link: sw.content_link || '',
                            writer_note: sw.writer_note || '',
                            notes: sw.notes,
                            // Niche Edit specific fields
                            option_type: 'replace', // 'replace' or 'insert'
                            replace_with: '',
                            replace_statement: '',
                            insert_after: '',
                            insert_statement: ''
                        }))
                    );
                }
            } catch (err) {
                console.error('Failed to load task:', err);
                showError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, showError]);

    const handleContentChange = (index, field, value) => {
        setWebsiteSubmissions(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleFileClick = (siteId) => {
        if (fileInputRefs.current[siteId]) {
            fileInputRefs.current[siteId].click();
        }
    };

    const handleFileChange = (siteId, event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFiles(prev => ({
                ...prev,
                [siteId]: file
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (siteId, e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            setUploadedFiles(prev => ({
                ...prev,
                [siteId]: file
            }));
        }
    };

    const handleSubmit = async () => {
        if (isNicheEdit) {
            // Global note is mandatory for Niche Edit only
            if (!globalNote || globalNote.trim() === '') {
                showError('Please fill in the Global Notes field');
                return;
            }

            // Validate Niche Edit fields
            const missingFields = websiteSubmissions.find(sub => {
                if (sub.option_type === 'replace') {
                    return !sub.replace_with?.trim() || !sub.replace_statement?.trim();
                } else {
                    return !sub.insert_after?.trim() || !sub.insert_statement?.trim();
                }
            });

            if (missingFields) {
                showError('Please fill in all required fields for each website');
                return;
            }
        } else {
            // GP flow validation - Note is mandatory per website
            const missingNote = websiteSubmissions.find((sub) => !sub.writer_note || sub.writer_note.trim() === '');
            if (missingNote) {
                showError(`Website "${missingNote.domain_url || 'Unknown'}": Please fill in the Note field`);
                return;
            }
        }

        try {
            setSubmitting(true);

            const payload = websiteSubmissions.map(sub => ({
                id: sub.id,
                content_link: sub.content_link || '',
                writer_note: sub.writer_note || '',
                // Niche Edit fields
                option_type: sub.option_type,
                replace_with: sub.replace_with || '',
                replace_statement: sub.replace_statement || '',
                insert_after: sub.insert_after || '',
                insert_statement: sub.insert_statement || '',
                global_note: globalNote
            }));

            await writerAPI.submitContent(id, payload);

            showSuccess('Content submitted successfully!');
            navigate('/writer/notifications');
        } catch (err) {
            let errorMessage = 'Failed to submit content';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message && typeof err.message === 'string') {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            console.error('Submit error:', err);
            showError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
        </div>
    );

    if (!task) return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--background-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-muted)] font-medium">Order details not found.</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/writer/notifications')}
                    className="p-2 rounded-xl bg-[var(--card-background)] border border-[var(--border)] hover:border-[var(--primary-cyan)] transition-colors group shadow-sm"
                >
                    <ArrowLeft className="h-5 w-5 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)]" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        {isNicheEdit ? 'Processing Niche Edit' : 'Processing Guest Post'}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="premium-badge bg-[var(--primary-glow)] text-[var(--primary-cyan)]">
                            Order #{task.id}
                        </span>
                        <span className="text-[var(--text-muted)] text-sm">•</span>
                        <span className="text-[var(--text-secondary)] text-sm">{task.client_name || 'Client'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Column - Website Details */}
                <div className="lg:col-span-3 space-y-6">
                    {websiteSubmissions.length === 0 ? (
                        <div className="premium-card p-12 text-center">
                            <p className="text-[var(--text-muted)]">No website details available for this order.</p>
                        </div>
                    ) : (
                        websiteSubmissions.map((site, index) => (
                            <div key={site.id} className="premium-card p-6">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                                    <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-[var(--primary-cyan)] text-white flex items-center justify-center text-xs">
                                            {index + 1}
                                        </div>
                                        Website Details
                                    </h2>
                                    <div className="text-sm text-[var(--text-muted)] font-mono">
                                        ID: {site.id}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Read-only field: Root domain */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        <label className="text-sm font-medium text-[var(--text-secondary)]">Root Domain</label>
                                        <div className="md:col-span-3">
                                            <input
                                                type="text"
                                                readOnly
                                                value={site.domain_url || ''}
                                                className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Read-only field: Anchor */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        <label className="text-sm font-medium text-[var(--text-secondary)]">Anchor Text</label>
                                        <div className="md:col-span-3">
                                            <input
                                                type="text"
                                                readOnly
                                                value={site.anchor_text || ''}
                                                className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Read-only field: Post URL - Niche Edit only */}
                                    {isNicheEdit && (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Target Post URL</label>
                                            <div className="md:col-span-3">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={site.post_url || ''}
                                                    className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Read-only field: Title - GP only */}
                                    {!isNicheEdit && (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Article Title</label>
                                            <div className="md:col-span-3">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={site.article_title || ''}
                                                    className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Read-only field: URL */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        <label className="text-sm font-medium text-[var(--text-secondary)]">Target URL</label>
                                        <div className="md:col-span-3">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={site.target_url || ''}
                                                    className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed pl-10"
                                                />
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                                    <Upload className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[var(--border)] my-6" />

                                    {/* ===== NICHE EDIT SPECIFIC FIELDS ===== */}
                                    {isNicheEdit && (
                                        <>
                                            {/* Options Dropdown */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">
                                                    Action Type<span className="text-[var(--error)]">*</span>
                                                </label>
                                                <div className="md:col-span-3">
                                                    <select
                                                        value={site.option_type}
                                                        onChange={(e) => handleContentChange(index, 'option_type', e.target.value)}
                                                        className="premium-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-4 bg-[length:12px_12px]"
                                                    >
                                                        <option value="replace">Replace Existing Text</option>
                                                        <option value="insert">Insert New Text</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Replace Fields */}
                                            {site.option_type === 'replace' && (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                        <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">
                                                            Replace Text<span className="text-[var(--error)]">*</span>
                                                        </label>
                                                        <div className="md:col-span-3">
                                                            <textarea
                                                                value={site.replace_with}
                                                                onChange={(e) => handleContentChange(index, 'replace_with', e.target.value)}
                                                                placeholder="Exact text to find and replace..."
                                                                rows={3}
                                                                className="premium-input font-mono text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                        <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">
                                                            New Content<span className="text-[var(--error)]">*</span>
                                                        </label>
                                                        <div className="md:col-span-3">
                                                            <textarea
                                                                value={site.replace_statement}
                                                                onChange={(e) => handleContentChange(index, 'replace_statement', e.target.value)}
                                                                placeholder="New text with anchor..."
                                                                rows={4}
                                                                className="premium-input font-mono text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* Insert Fields */}
                                            {site.option_type === 'insert' && (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                        <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">
                                                            Insert After<span className="text-[var(--error)]">*</span>
                                                        </label>
                                                        <div className="md:col-span-3">
                                                            <textarea
                                                                value={site.insert_after}
                                                                onChange={(e) => handleContentChange(index, 'insert_after', e.target.value)}
                                                                placeholder="Text segment to insert after..."
                                                                rows={3}
                                                                className="premium-input font-mono text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                        <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">
                                                            New Statement<span className="text-[var(--error)]">*</span>
                                                        </label>
                                                        <div className="md:col-span-3">
                                                            <textarea
                                                                value={site.insert_statement}
                                                                onChange={(e) => handleContentChange(index, 'insert_statement', e.target.value)}
                                                                placeholder="The new sentence/paragraph to insert..."
                                                                rows={4}
                                                                className="premium-input font-mono text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    {/* ===== GUEST POST SPECIFIC FIELDS ===== */}
                                    {!isNicheEdit && (
                                        <>
                                            {/* Upload Document */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">Content File</label>
                                                <div className="md:col-span-3">
                                                    <input
                                                        type="file"
                                                        ref={(el) => fileInputRefs.current[site.id] = el}
                                                        onChange={(e) => handleFileChange(site.id, e)}
                                                        className="hidden"
                                                        accept=".doc,.docx,.pdf,.txt,.rtf,image/*,.png,.jpg,.jpeg,.gif,.webp"
                                                    />
                                                    <div
                                                        onClick={() => handleFileClick(site.id)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(site.id, e)}
                                                        className="rounded-xl p-8 text-center cursor-pointer transition-all border-2 border-dashed border-[var(--border)] hover:border-[var(--primary-cyan)] hover:bg-[var(--primary-glow)] group"
                                                    >
                                                        {uploadedFiles[site.id] ? (
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-12 h-12 rounded-full bg-[var(--primary-glow)] flex items-center justify-center mb-3">
                                                                    <CheckCircle className="h-6 w-6 text-[var(--primary-cyan)]" />
                                                                </div>
                                                                <p className="font-medium text-[var(--text-primary)]">{uploadedFiles[site.id].name}</p>
                                                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                                                    ({(uploadedFiles[site.id].size / 1024).toFixed(1)} KB)
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-12 h-12 rounded-full bg-[var(--input-background)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                    <Upload className="h-6 w-6 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)]" />
                                                                </div>
                                                                <p className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                                                                    Click to upload or drag and drop
                                                                </p>
                                                                <p className="text-xs text-[var(--text-muted)] mt-2">DOC, DOCX, PDF, Images</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Doc URLs */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                <label className="text-sm font-medium text-[var(--text-secondary)]">Google Doc URL</label>
                                                <div className="md:col-span-3">
                                                    <input
                                                        type="url"
                                                        value={site.content_link}
                                                        onChange={(e) => handleContentChange(index, 'content_link', e.target.value)}
                                                        placeholder="https://docs.google.com/..."
                                                        className="premium-input"
                                                    />
                                                </div>
                                            </div>

                                            {/* Note - Mandatory for GP */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">
                                                    Writer Note<span className="text-[var(--error)]">*</span>
                                                </label>
                                                <div className="md:col-span-3">
                                                    <textarea
                                                        value={site.writer_note}
                                                        onChange={(e) => handleContentChange(index, 'writer_note', e.target.value)}
                                                        placeholder="Important notes for the manager..."
                                                        rows={3}
                                                        className="premium-input"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Global Notes - Only for Niche Edit */}
                    {isNicheEdit && (
                        <div className="premium-card p-6 border-l-4 border-[var(--primary-cyan)]">
                            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                                Global Notes<span className="text-[var(--error)]">*</span>
                            </h2>
                            <textarea
                                value={globalNote}
                                onChange={(e) => setGlobalNote(e.target.value)}
                                placeholder="Any general instructions or comments for this entire order..."
                                rows={4}
                                className="premium-input"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="premium-btn premium-btn-primary px-8 py-3 text-base shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            {submitting ? (
                                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Send className="h-5 w-5 mr-2" />
                            )}
                            {submitting ? 'Submitting...' : 'Submit to Manager'}
                        </button>
                    </div>
                </div>

                {/* Right Column - Order Info Sidebar */}
                <div className="space-y-6">
                    <div className="premium-card p-6 sticky top-6">
                        <h3 className="text-lg font-bold mb-6 pb-4 border-b border-[var(--border)] text-[var(--text-primary)]">
                            Order Overview
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Status</label>
                                <span className="premium-badge bg-blue-500/10 text-blue-500">Processing</span>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Order Type</label>
                                <p className="font-medium text-[var(--text-primary)]">{task.order_type || 'Guest Post'}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Date Assigned</label>
                                <p className="font-medium text-[var(--text-primary)]">
                                    {new Date(task.updated_at || task.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">Assigned By</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[var(--primary-cyan)] text-white flex items-center justify-center text-xs font-bold">
                                        {(task.manager_name || 'M')[0]}
                                    </div>
                                    <p className="font-medium text-[var(--text-primary)]">{task.manager_name || 'Manager'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderAddedDetails;
