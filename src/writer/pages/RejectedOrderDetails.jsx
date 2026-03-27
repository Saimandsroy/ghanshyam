import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, XCircle, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { writerAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

/**
 * RejectedOrderDetails - Writer fixes rejected order
 * Same layout as OrderAddedDetails but with:
 * - Red border on rejected website cards
 * - Shows rejection reason banner
 * - All websites are editable
 */
export function RejectedOrderDetails() {
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

    // Rejected website IDs
    const [rejectedWebsiteIds, setRejectedWebsiteIds] = useState([]);
    const [rejectionReason, setRejectionReason] = useState('');

    // Check if order is Niche Edit
    const isNicheEdit = task?.order_type?.toLowerCase().includes('niche');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await writerAPI.getTask(id);
                const taskData = response.task;
                setTask(taskData);

                // Parse rejection data from message, notes, or content_body field
                // Format: [WRITER_REJECTED] reason|||JSON_DATA
                let rejectedIds = [];
                const rejectionContent = taskData.message || taskData.notes || taskData.content_body || '';

                console.log('Checking rejection content:', rejectionContent);

                if (rejectionContent && rejectionContent.includes('[WRITER_REJECTED]')) {
                    const messageContent = rejectionContent.replace('[WRITER_REJECTED]', '').trim();

                    if (messageContent.includes('|||')) {
                        // New format with JSON data
                        const [reason, jsonData] = messageContent.split('|||');
                        setRejectionReason(reason.trim());

                        try {
                            const parsed = JSON.parse(jsonData);
                            rejectedIds = parsed.filter(w => w.rejected).map(w => w.website_id);
                            console.log('Parsed rejected website IDs:', rejectedIds);
                        } catch (e) {
                            console.warn('Failed to parse rejected_websites JSON:', e);
                        }
                    } else {
                        // Old format - just reason
                        setRejectionReason(messageContent);
                    }
                }
                setRejectedWebsiteIds(rejectedIds);

                // Initialize website submissions (same as OrderAddedDetails)
                if (taskData.selected_websites) {
                    console.log('Selected websites:', taskData.selected_websites);
                    console.log('Rejected IDs to match:', rejectedIds);

                    setWebsiteSubmissions(
                        taskData.selected_websites.map(sw => {
                            // Check all possible ID fields against rejected IDs (handle both string and number types)
                            const isRejected = rejectedIds.some(rid =>
                                String(rid) === String(sw.id) ||
                                String(rid) === String(sw.website_id) ||
                                String(rid) === String(sw.new_site_id)
                            );

                            console.log(`Website ${sw.id} (website_id: ${sw.website_id}): isRejected=${isRejected}`);

                            return {
                                id: sw.id,
                                website_id: sw.website_id, // Keep track of website_id too
                                domain_url: sw.domain_url,
                                target_url: sw.target_url,
                                anchor_text: sw.anchor_text,
                                article_title: sw.article_title,
                                post_url: sw.copy_url || sw.post_url || '',
                                content_link: sw.content_link || '',
                                writer_note: sw.writer_note || '',
                                notes: sw.notes,
                                // Niche Edit specific fields
                                option_type: sw.option_type || 'replace',
                                replace_with: sw.replace_with || '',
                                replace_statement: sw.replace_statement || sw.statement || '',
                                insert_after: sw.insert_after || '',
                                insert_statement: sw.insert_statement || '',
                                // Check if this website is rejected
                                is_rejected: isRejected
                            };
                        })
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

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // Same submission format as OrderAddedDetails - pass array directly
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

            showSuccess('Content resubmitted to manager for review');
            navigate('/writer/completed-orders');
        } catch (err) {
            let errorMessage = 'Failed to submit content';
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
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

    const rejectedCount = websiteSubmissions.filter(s => s.is_rejected).length;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/writer/rejected')}
                    className="p-2 rounded-xl bg-[var(--card-background)] border border-[var(--border)] hover:border-[var(--primary-cyan)] transition-colors group shadow-sm"
                >
                    <ArrowLeft className="h-5 w-5 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)]" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-red-400 flex items-center gap-3">
                        <XCircle className="h-7 w-7" />
                        Fix Rejected Content
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="premium-badge bg-red-500/10 text-red-400 border-red-500/20">
                            Order #{task.manual_order_id || task.id}
                        </span>
                        <span className="text-[var(--text-muted)] text-sm">•</span>
                        <span className="text-[var(--text-secondary)] text-sm">{task.client_name || 'Client'}</span>
                        <span className="text-[var(--text-muted)] text-sm">•</span>
                        <span className="text-red-400 text-sm font-medium">{rejectedCount} website(s) rejected</span>
                    </div>
                </div>
            </div>

            {/* Rejection Reason Banner */}
            {rejectionReason && (
                <div className="premium-card p-5 border-2 border-red-500/30 bg-red-500/10">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-400 mb-1">Manager's Rejection Reason</h3>
                            <p className="text-[var(--text-primary)]">{rejectionReason}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Website Details */}
                <div className="lg:col-span-3 space-y-6">
                    {websiteSubmissions.length === 0 ? (
                        <div className="premium-card p-12 text-center">
                            <p className="text-[var(--text-muted)]">No website details available for this order.</p>
                        </div>
                    ) : (
                        websiteSubmissions.map((site, index) => {
                            const isRejected = site.is_rejected || rejectedWebsiteIds.includes(site.id);

                            return (
                                <div
                                    key={site.id}
                                    className={`premium-card p-6 transition-all ${isRejected
                                        ? 'border-2 border-red-500 bg-red-500/5 shadow-lg shadow-red-500/10'
                                        : ''
                                        }`}
                                >
                                    {/* Website Header */}
                                    <div className={`flex items-center justify-between mb-6 pb-4 border-b ${isRejected ? 'border-red-500/30' : 'border-[var(--border)]'
                                        }`}>
                                        <h2 className={`text-lg font-bold flex items-center gap-2 ${isRejected ? 'text-red-400' : 'text-[var(--text-primary)]'
                                            }`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isRejected ? 'bg-red-500 text-white' : 'bg-[var(--primary-cyan)] text-white'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            Website Details
                                            {isRejected && (
                                                <span className="ml-2 px-3 py-1 text-xs font-bold rounded-full bg-red-500 text-white uppercase tracking-wide animate-pulse">
                                                    ⚠ REJECTED - FIX REQUIRED
                                                </span>
                                            )}
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

                                        {/* Read-only field: Target URL */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                            <label className="text-sm font-medium text-[var(--text-secondary)]">Target URL</label>
                                            <div className="md:col-span-3">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={site.target_url || ''}
                                                    className="premium-input bg-[var(--background-dark)] opacity-70 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="h-px bg-[var(--border)] my-6" />

                                        {/* ===== NICHE EDIT SPECIFIC FIELDS ===== */}
                                        {isNicheEdit && (
                                            <>
                                                {/* Options Dropdown */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                    <label className={`text-sm font-medium ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                        {isRejected && '⚠ '}Action Type<span className="text-[var(--error)]">*</span>
                                                    </label>
                                                    <div className="md:col-span-3">
                                                        <select
                                                            value={site.option_type}
                                                            onChange={(e) => handleContentChange(index, 'option_type', e.target.value)}
                                                            className={`premium-input ${isRejected ? 'border-red-500/50' : ''}`}
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
                                                            <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                                {isRejected && '⚠ '}Replace Text<span className="text-[var(--error)]">*</span>
                                                            </label>
                                                            <div className="md:col-span-3">
                                                                <textarea
                                                                    value={site.replace_with}
                                                                    onChange={(e) => handleContentChange(index, 'replace_with', e.target.value)}
                                                                    placeholder="Exact text to find and replace..."
                                                                    rows={4}
                                                                    className={`premium-input font-mono text-sm ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                            <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                                {isRejected && '⚠ '}New Content<span className="text-[var(--error)]">*</span>
                                                            </label>
                                                            <div className="md:col-span-3">
                                                                <textarea
                                                                    value={site.replace_statement}
                                                                    onChange={(e) => handleContentChange(index, 'replace_statement', e.target.value)}
                                                                    placeholder="New text with anchor..."
                                                                    rows={4}
                                                                    className={`premium-input font-mono text-sm ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Insert Fields */}
                                                {site.option_type === 'insert' && (
                                                    <>
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                            <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                                {isRejected && '⚠ '}Insert After<span className="text-[var(--error)]">*</span>
                                                            </label>
                                                            <div className="md:col-span-3">
                                                                <textarea
                                                                    value={site.insert_after}
                                                                    onChange={(e) => handleContentChange(index, 'insert_after', e.target.value)}
                                                                    placeholder="Text segment to insert after..."
                                                                    rows={4}
                                                                    className={`premium-input font-mono text-sm ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                            <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                                {isRejected && '⚠ '}New Statement<span className="text-[var(--error)]">*</span>
                                                            </label>
                                                            <div className="md:col-span-3">
                                                                <textarea
                                                                    value={site.insert_statement}
                                                                    onChange={(e) => handleContentChange(index, 'insert_statement', e.target.value)}
                                                                    placeholder="The new sentence/paragraph to insert..."
                                                                    rows={4}
                                                                    className={`premium-input font-mono text-sm ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
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
                                                {/* Content Link */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                    <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                        {isRejected && '⚠ '}Content/Doc Link
                                                    </label>
                                                    <div className="md:col-span-3">
                                                        <input
                                                            type="text"
                                                            value={site.content_link}
                                                            onChange={(e) => handleContentChange(index, 'content_link', e.target.value)}
                                                            placeholder="Google Docs URL or content link..."
                                                            className={`premium-input ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* File Upload */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                    <label className="text-sm font-medium text-[var(--text-secondary)] pt-3">Content File</label>
                                                    <div className="md:col-span-3">
                                                        <input
                                                            type="file"
                                                            ref={(el) => fileInputRefs.current[site.id] = el}
                                                            onChange={(e) => handleFileChange(site.id, e)}
                                                            className="hidden"
                                                            accept=".doc,.docx,.pdf,.txt,.rtf,image/*"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFileClick(site.id)}
                                                            className="premium-btn w-full justify-center"
                                                        >
                                                            <Upload className="h-4 w-4" />
                                                            {uploadedFiles[site.id] ? uploadedFiles[site.id].name : 'Upload File'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Writer Note */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                                    <label className={`text-sm font-medium pt-3 ${isRejected ? 'text-red-400' : 'text-[var(--text-secondary)]'}`}>
                                                        {isRejected && '⚠ '}Writer Note
                                                    </label>
                                                    <div className="md:col-span-3">
                                                        <textarea
                                                            value={site.writer_note}
                                                            onChange={(e) => handleContentChange(index, 'writer_note', e.target.value)}
                                                            placeholder="Add notes about your content..."
                                                            rows={3}
                                                            className={`premium-input ${isRejected ? 'border-red-500/50 focus:border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right Column - Summary & Submit */}
                <div className="lg:col-span-1">
                    <div className="premium-card p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-muted)]">Total Websites</span>
                                <span className="text-[var(--text-primary)] font-medium">{websiteSubmissions.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-muted)]">Rejected</span>
                                <span className="text-red-400 font-bold">{rejectedCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-muted)]">Order Type</span>
                                <span className="text-[var(--text-primary)] font-medium">{isNicheEdit ? 'Niche Edit' : 'Guest Post'}</span>
                            </div>
                        </div>

                        {/* Global Note */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-2">
                                Revision Notes
                            </label>
                            <textarea
                                value={globalNote}
                                onChange={(e) => setGlobalNote(e.target.value)}
                                placeholder="Explain what changes you made..."
                                rows={4}
                                className="premium-input w-full"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="premium-btn premium-btn-primary w-full py-3 justify-center"
                        >
                            {submitting ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-5 w-5" />
                                    <span>Resubmit to Manager</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RejectedOrderDetails;
