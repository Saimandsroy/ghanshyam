import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, ToggleLeft, ToggleRight, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { bloggerAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

/**
 * OrderDetails Page - Full page view for blogger order details
 * Route: /blogger/orders/:id
 */
export function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitUrl, setSubmitUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch order details
    const fetchOrder = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await bloggerAPI.getTasks();
            const task = response.tasks?.find(t => String(t.id) === String(id));

            if (task) {
                setOrder(task);
                setSubmitUrl(task.submitted_url || '');
            } else {
                setError('Order not found');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(err.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    // Calculate remaining time
    const getRemainingTime = () => {
        if (!order?.assigned_at) return 'N/A';

        const assigned = new Date(order.assigned_at);
        const deadline = new Date(assigned.getTime() + 6 * 60 * 60 * 1000); // 6 hours
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) return 'Overdue';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} Hours : ${minutes} Minutes`;
    };

    // Helper functions
    const isNicheEdit = () => {
        const orderType = (order?.order_type || '').toLowerCase();
        return orderType.includes('niche') || orderType.includes('edit');
    };

    const isGuestPost = () => {
        const orderType = (order?.order_type || '').toLowerCase();
        return orderType.includes('guest') || orderType.includes('gp') || orderType === 'guest post';
    };

    const isReplaceOption = () => {
        const option = (order?.option || '').toLowerCase();
        return option === 'replace' || option === 'replacement';
    };

    // Handle submit
    const handleSubmit = async () => {
        if (!submitUrl.trim()) {
            showError('Please enter the submit URL');
            return;
        }

        try {
            setSubmitting(true);
            await bloggerAPI.submitLink(id, submitUrl);
            showSuccess('Link submitted successfully!');
            navigate('/blogger/orders');
        } catch (err) {
            console.error('Error submitting link:', err);
            showError('Failed to submit link: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Detail Row Component
    const DetailRow = ({ label, value, isLink = false, linkText, highlight = false }) => (
        <div className="flex flex-col sm:flex-row sm:items-baseline py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-dark)]/50 transition-colors px-4 -mx-4">
            <div className="w-full sm:w-48 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1 sm:mb-0">
                {label}
            </div>
            <div className={`flex-1 font-medium ${highlight ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
                {isLink && value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--primary-cyan)] hover:underline break-all"
                    >
                        {linkText || value}
                        <ExternalLink className="h-3 w-3" />
                    </a>
                ) : (
                    value || <span className="text-[var(--text-muted)] italic">Not specified</span>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-cyan)] border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="premium-card bg-[var(--error)]/5 border-[var(--error)]/20 p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-[var(--error)] mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Error Loading Order</h2>
                    <p className="text-[var(--text-secondary)] mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/blogger/orders')}
                        className="premium-btn premium-btn-accent"
                    >
                        <ArrowLeft className="h-4 w-4" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const canSubmit = order?.current_status === 'pending' || order?.current_status === 'rejected';
    const orderType = order?.order_type || 'Unknown';
    const hasUpfront = order?.upfront_payment || false;

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto pb-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/blogger/orders')}
                    className="p-2 rounded-xl hover:bg-[var(--card-background)] border border-transparent hover:border-[var(--border)] transition-all shadow-sm hover:shadow"
                >
                    <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        {canSubmit ? 'Pending Order' : 'Order Details'}
                        <span className="text-sm px-3 py-1 rounded-full bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] font-mono border border-[var(--primary-cyan)]/20">
                            #{order?.order_id || order?.id}
                        </span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        Remaining Time: <span className="font-semibold text-[var(--text-primary)]">{getRemainingTime()}</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="premium-card p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Task Specification</h2>
                            <div className="flex gap-2">
                                <span className={`premium-badge ${isNicheEdit() ? 'bg-purple-500/10 text-purple-600 border-purple-200' : 'bg-emerald-500/10 text-emerald-600 border-emerald-200'}`}>
                                    {orderType}
                                </span>
                                {isNicheEdit() && order?.option && (
                                    <span className={`premium-badge ${isReplaceOption() ? 'bg-red-500/10 text-red-600 border-red-200' : 'bg-blue-500/10 text-blue-600 border-blue-200'}`}>
                                        {order.option}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <DetailRow label="Website" value={order?.root_domain || order?.website_domain} highlight />
                            <DetailRow label="Client Name" value={order?.client_name} />

                            {/* Dynamic Fields based on Type */}
                            {isNicheEdit() && (
                                <>
                                    <DetailRow label="Post URL" value={order?.post_url} isLink />
                                    {isReplaceOption() ? (
                                        <>
                                            <DetailRow label="Replace Text" value={order?.insert_after} />
                                            <DetailRow label="With Statement" value={order?.statement} />
                                        </>
                                    ) : (
                                        <>
                                            <DetailRow label="Insert After" value={order?.insert_after} />
                                            <DetailRow label="Insert Statement" value={order?.statement} />
                                        </>
                                    )}
                                </>
                            )}

                            {isGuestPost() && (
                                <>
                                    <DetailRow label="Document" value={order?.doc_url} isLink linkText="View Document" />
                                    <DetailRow label="Title" value={order?.title} />
                                </>
                            )}

                            <DetailRow label="Anchor Text" value={order?.anchor_text} highlight />
                            <DetailRow label="Target URL" value={order?.target_url} isLink />
                            <DetailRow label="Special Notes" value={order?.notes} />
                        </div>
                    </div>

                    {/* Submission Section */}
                    {canSubmit && (
                        <div className="premium-card p-6 border-l-4 border-l-[var(--primary-cyan)]">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <Link2 className="h-5 w-5 text-[var(--primary-cyan)]" />
                                Submit Work
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                                        Live Published URL <span className="text-[var(--error)]">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={submitUrl}
                                        onChange={(e) => setSubmitUrl(e.target.value)}
                                        placeholder="https://example.com/blog/your-post"
                                        className="premium-input w-full"
                                        autoFocus
                                    />
                                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                                        Please ensure the link is publicly accessible and contains the correct anchor text.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !submitUrl.trim()}
                                        className="premium-btn premium-btn-accent flex-1"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Link'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Current Status</h3>
                        <div className="flex flex-col gap-3">
                            {/* Status Logic Visualized */}
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${order?.current_status === 'completed'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                    : order?.current_status === 'rejected'
                                        ? 'bg-red-500/10 border-red-500/20 text-red-600'
                                        : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                                }`}>
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-bold capitalize">{order?.current_status || 'Pending'}</span>
                            </div>

                            {order?.submitted_url && (
                                <div className="p-3 bg-[var(--background-dark)] rounded-lg border border-[var(--border)] mt-2">
                                    <span className="text-xs text-[var(--text-secondary)] block mb-1">Last Submitted Link:</span>
                                    <a href={order.submitted_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary-cyan)] truncate block hover:underline">
                                        {order.submitted_url}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Financials Card */}
                    <div className="premium-card p-6">
                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Order Value</h3>
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-[var(--text-muted)]">Payout</span>
                            <span className="text-2xl font-bold text-emerald-500">${parseFloat(order?.price || 0).toFixed(2)}</span>
                        </div>
                        <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">Upfront Payment</span>
                            <div className="flex items-center gap-2">
                                {hasUpfront ? (
                                    <span className="text-xs font-bold text-[var(--primary-cyan)] px-2 py-1 rounded bg-[var(--primary-cyan)]/10">INCLUDED</span>
                                ) : (
                                    <span className="text-xs font-bold text-[var(--text-muted)] px-2 py-1 rounded bg-[var(--background-dark)]">NO</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
