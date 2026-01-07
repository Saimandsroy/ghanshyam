import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Globe, DollarSign, FileText, Link2, ExternalLink, Info } from 'lucide-react';
import { managerAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Layout } from '../../components/layout/Layout';

/**
 * WriterSubmissionDetails - Manager views Writer's submitted content
 * Matches production layout at /pending-approval-for-writers/:id
 * Shows different layouts for Niche Edit vs Guest Post orders
 * 
 * AUTO-ROUTING: When pushing to bloggers, each site is automatically
 * assigned to its owner (the vendor who uploaded the site)
 */
export function WriterSubmissionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const fetchTask = useCallback(async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getTask(id);
            console.log('Writer Submission Task:', response.task);
            setTask(response.task);
        } catch (err) {
            console.error('Error fetching task:', err);
            showError('Failed to load submission details');
        } finally {
            setLoading(false);
        }
    }, [id, showError]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    // Check if order is Niche Edit
    const isNicheEdit = task?.order_type?.toLowerCase().includes('niche');

    // Push to Bloggers - Auto-routes each site to its owner
    const handlePushToBloggers = async () => {
        try {
            setProcessing(true);
            // Call the new auto-routing endpoint
            await managerAPI.pushToBloggers(id);
            showSuccess('Tasks pushed to bloggers! Each site was assigned to its owner.');
            navigate('/manager/pending/writers');
        } catch (err) {
            showError('Failed to push to bloggers: ' + (err?.response?.data?.message || err.message));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="h-8 w-8 border-2 border-[var(--primary-cyan)] border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    if (!task) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    <p className="text-[var(--text-muted)] mb-4">Submission not found</p>
                    <button
                        onClick={() => navigate('/manager/pending/writers')}
                        className="premium-btn premium-btn-primary"
                    >
                        Back to List
                    </button>
                </div>
            </Layout>
        );
    }

    const websites = task.selected_websites || [];

    // Render a single data row
    const DataRow = ({ label, value, isLink = false }) => (
        <div className="flex py-3 border-b border-[var(--border)] last:border-0 border-dashed">
            <div className="w-1/3 text-sm font-medium text-[var(--text-secondary)] flex-shrink-0 uppercase tracking-wider">
                {label}
            </div>
            <div className="flex-1 text-[var(--text-primary)] break-all">
                {isLink && value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[var(--primary-cyan)] transition-colors text-[var(--accent)]"
                    >
                        {value}
                        <ExternalLink className="h-3 w-3" />
                    </a>
                ) : (
                    value || <span className="text-[var(--text-muted)]">-</span>
                )}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/manager/pending/writers')}
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Pending Writers
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Push To Blogger
                            </h1>
                            <p className="text-[var(--text-muted)] text-sm mt-1">Review approved content before sending to vendors</p>
                        </div>
                    </div>

                    {/* Per-Website Sections */}
                    {websites.length === 0 ? (
                        <div className="premium-card p-8 text-center text-[var(--text-muted)]">
                            No website submissions found
                        </div>
                    ) : (
                        websites.map((site, index) => (
                            <div key={site.id} className="premium-card overflow-hidden">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-[var(--border)] bg-gradient-to-r from-[var(--card-background)] to-white/[0.02] flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-[var(--primary-cyan)]" />
                                        {site.domain_url}
                                    </h2>
                                    <span className={`premium-badge ${isNicheEdit ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                        {isNicheEdit ? 'Niche Order' : 'GP Order'}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {isNicheEdit ? (
                                        /* ========== NICHE EDIT LAYOUT ========== */
                                        <div className="space-y-1">
                                            <DataRow label="Root domain" value={site.domain_url} />
                                            <DataRow label="Anchor" value={site.anchor_text} />
                                            <DataRow label="Target Url" value={site.target_url} isLink />
                                            <DataRow label="Post url" value={site.copy_url || site.post_url} isLink />
                                            <DataRow label="Price" value={site.niche_price || site.gp_price || '0'} />
                                            <DataRow label="Insert After" value={site.insert_after} />
                                            <DataRow label="Insert Statement" value={site.statement} />
                                            <DataRow label="Note" value={site.notes || site.writer_note} />
                                        </div>
                                    ) : (
                                        /* ========== GUEST POST LAYOUT ========== */
                                        <div className="space-y-1">
                                            <DataRow label="Root domain" value={site.domain_url} />
                                            <DataRow label="Price" value={site.gp_price || site.niche_price || '0'} />
                                            <DataRow label="Anchor" value={site.anchor_text} />
                                            <DataRow label="Title" value={site.article_title} />
                                            <DataRow label="Doc urls" value={site.doc_urls || site.content_link} isLink />
                                            <DataRow label="External Doc Files Url" value={site.content_file} isLink />
                                            <DataRow label="Note" value={site.notes || site.writer_note} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Action Buttons */}
                    <div className="premium-card p-6 sticky bottom-6 z-10 border-t border-[var(--border)] shadow-2xl shadow-black/50">
                        {/* Info Box */}
                        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-6 flex items-start gap-3">
                            <Info className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-cyan-100/80">
                                <strong>Auto-Routing System:</strong> Each website will be automatically assigned to its owner (the vendor who uploaded the site). Please verify all details before pushing.
                            </p>
                        </div>

                        {/* Action Button - Only Push to Blogger */}
                        <div className="flex justify-center">
                            <button
                                onClick={handlePushToBloggers}
                                disabled={processing || websites.length === 0}
                                className="premium-btn premium-btn-primary px-8 py-4 h-auto text-lg w-full md:w-auto min-w-[300px] justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                            >
                                {processing ? (
                                    <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="h-5 w-5 mr-2" />
                                        Push to Blogger
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default WriterSubmissionDetails;
