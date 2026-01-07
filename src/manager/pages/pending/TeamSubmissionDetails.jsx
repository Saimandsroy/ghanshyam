import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Globe, FileText, Send, CheckCircle, AlertCircle, Trash2, DollarSign } from 'lucide-react';
import { managerAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { Layout } from '../../components/layout/Layout';

export function TeamSubmissionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [task, setTask] = useState(null);
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedWriter, setSelectedWriter] = useState('');
    const [instructions, setInstructions] = useState('');
    const [websiteDetails, setWebsiteDetails] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [taskResponse, writersResponse] = await Promise.all([
                    managerAPI.getTask(id),
                    managerAPI.getWriters()
                ]);

                setTask(taskResponse.task);
                if (writersResponse.users) {
                    setWriters(writersResponse.users);
                }

                // Initialize website details state from selected websites
                if (taskResponse.task && taskResponse.task.selected_websites) {
                    setWebsiteDetails(
                        taskResponse.task.selected_websites.map(sw => ({
                            id: sw.id,
                            website_id: sw.website_id,
                            domain_url: sw.domain_url,
                            gp_price: sw.gp_price,
                            niche_price: sw.niche_price,
                            dr: sw.dr,
                            da: sw.da,
                            traffic: sw.traffic,
                            notes: sw.notes,
                            copy_url: sw.copy_url || '',
                            target_url: sw.target_url || '',
                            anchor_text: sw.anchor_text || '',
                            article_title: sw.article_title || '',
                            upfront_payment: sw.upfront_payment || false,
                            paypal_id: sw.paypal_id || ''
                        }))
                    );
                }
            } catch (err) {
                console.error('Failed to load data:', err);
                showError('Failed to load details');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, showError]);

    const handleWebsiteDetailChange = (index, field, value) => {
        setWebsiteDetails(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = async () => {
        if (!selectedWriter) {
            showError('Please select a writer');
            return;
        }

        // Validate all website details based on order type
        const isGuestPost = task?.order_type?.toLowerCase().includes('guest') || task?.order_type?.toLowerCase() === 'gp';

        const missingFields = websiteDetails.some(detail => {
            // URL and Anchor are always required
            if (!detail.target_url || !detail.anchor_text) return true;
            // Title is only required for Guest Post
            if (isGuestPost && !detail.article_title) return true;
            // PayPal ID is required if upfront payment is enabled
            if (detail.upfront_payment && !detail.paypal_id) return true;
            return false;
        });

        if (missingFields) {
            if (isGuestPost) {
                showError('Please fill in URL, Anchor, and Title for all websites. PayPal ID is required for upfront payments.');
            } else {
                showError('Please fill in URL and Anchor for all websites. PayPal ID is required for upfront payments.');
            }
            return;
        }

        try {
            setSubmitting(true);
            await managerAPI.assignToWriter(id, selectedWriter, instructions, websiteDetails);
            showSuccess('Task successfully assigned to writer');
            navigate('/manager/pending/teams');
        } catch (err) {
            showError(err.message || 'Failed to assign task');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-8 w-8 border-2 border-[var(--primary-cyan)] border-t-transparent rounded-full animate-spin" />
            </div>
        </Layout>
    );

    if (!task) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <p className="text-[var(--text-muted)] mb-4">Task with ID {id} not found</p>
                <button
                    onClick={() => navigate('/manager/pending/teams')}
                    className="premium-btn premium-btn-primary"
                >
                    Back to List
                </button>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/manager/pending/teams')}
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Pending Approval - Team Submission
                        </h1>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Order #{task.id} • {task.client_name}</p>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Order Info & Websites */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Details Card */}
                        <div className="premium-card p-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                <FileText className="h-5 w-5 text-[var(--primary-cyan)]" />
                                Order Requirements
                            </h2>

                            <div className="grid grid-cols-2 gap-6 text-sm">
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Client Name</label>
                                    <div className="text-[var(--text-primary)] font-medium">{task.client_name}</div>
                                </div>
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Order Type</label>
                                    <div className="text-[var(--text-primary)] font-medium">{task.order_type}</div>
                                </div>
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Target Links</label>
                                    <div className="text-[var(--text-primary)] font-medium">{task.no_of_links}</div>
                                </div>
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Team Member</label>
                                    <div className="text-[var(--text-primary)] font-medium">{task.team_name}</div>
                                </div>
                            </div>
                        </div>

                        {/* Selected Websites - Multiple */}
                        <div className="premium-card p-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                <Globe className="h-5 w-5 text-green-400" />
                                Team Selected Websites ({websiteDetails.length})
                            </h2>

                            {websiteDetails.length > 0 ? (
                                <div className="space-y-6">
                                    {websiteDetails.map((detail, index) => {
                                        const isGuestPost = task?.order_type?.toLowerCase().includes('guest') || task?.order_type?.toLowerCase() === 'gp';
                                        const isNicheEdit = task?.order_type?.toLowerCase().includes('niche');

                                        return (
                                            <div key={detail.id} className="bg-[var(--background-dark)] rounded-xl p-5 border border-[var(--border)]">
                                                {/* Website Header */}
                                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--border)]">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-blue-400 mb-2">
                                                            {detail.domain_url}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                                                            <span>DR: <span className="text-[var(--text-primary)]">{detail.dr || '-'}</span></span>
                                                            <span>DA: <span className="text-[var(--text-primary)]">{detail.da || '-'}</span></span>
                                                            <span>Traffic: <span className="text-[var(--text-primary)]">{detail.traffic || '-'}</span></span>
                                                        </div>

                                                        {/* Post URL - Only for Niche Edit orders */}
                                                        {isNicheEdit && detail.copy_url && (
                                                            <div className="mt-2 text-xs">
                                                                <span className="text-purple-400 font-medium">Post URL: </span>
                                                                <span className="text-[var(--text-primary)] break-all">{detail.copy_url}</span>
                                                            </div>
                                                        )}

                                                        {/* Notes from Team */}
                                                        {detail.notes && (
                                                            <div className="mt-2 text-xs">
                                                                <span className="text-[var(--primary-cyan)] font-medium">Notes: </span>
                                                                <span className="text-[var(--text-primary)]">{detail.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-[var(--text-muted)]">{isNicheEdit ? 'Niche Price' : 'GP Price'}</div>
                                                        <div className="text-lg font-bold text-emerald-400">${isNicheEdit ? (detail.niche_price || '0.00') : (detail.gp_price || '0.00')}</div>
                                                    </div>
                                                </div>

                                                {/* Editable Fields */}
                                                <div className="space-y-4">
                                                    {/* URL - For both order types */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                                                            Target URL <span className="text-red-400">*</span>
                                                        </label>
                                                        <input
                                                            value={detail.target_url}
                                                            onChange={(e) => handleWebsiteDetailChange(index, 'target_url', e.target.value)}
                                                            placeholder="https://example.com/target-page"
                                                            className="premium-input w-full"
                                                        />
                                                    </div>

                                                    {/* Anchor - For both order types */}
                                                    <div>
                                                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                                                            Anchor Text <span className="text-red-400">*</span>
                                                        </label>
                                                        <input
                                                            value={detail.anchor_text}
                                                            onChange={(e) => handleWebsiteDetailChange(index, 'anchor_text', e.target.value)}
                                                            placeholder="Anchor text for backlink"
                                                            className="premium-input w-full"
                                                        />
                                                    </div>

                                                    {/* Title - Only for Guest Post orders */}
                                                    {isGuestPost && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                                                                Article Title <span className="text-red-400">*</span>
                                                            </label>
                                                            <input
                                                                value={detail.article_title}
                                                                onChange={(e) => handleWebsiteDetailChange(index, 'article_title', e.target.value)}
                                                                placeholder="Article title"
                                                                className="premium-input w-full"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Upfront Toggle */}
                                                    <div className="flex items-center gap-4 py-2 border-t border-[var(--border)] mt-4 pt-4">
                                                        <label className="text-sm font-medium text-[var(--text-primary)]">Upfront Payment</label>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleWebsiteDetailChange(index, 'upfront_payment', true)}
                                                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${detail.upfront_payment
                                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                                    : 'bg-[var(--card-background)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                                                    }`}
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleWebsiteDetailChange(index, 'upfront_payment', false)}
                                                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!detail.upfront_payment
                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                                    : 'bg-[var(--card-background)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                                                    }`}
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* PayPal ID - Only when upfront is Yes */}
                                                    {detail.upfront_payment && (
                                                        <div className="animate-fade-in">
                                                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                                                                PayPal ID <span className="text-red-400">*</span>
                                                            </label>
                                                            <input
                                                                value={detail.paypal_id || ''}
                                                                onChange={(e) => handleWebsiteDetailChange(index, 'paypal_id', e.target.value)}
                                                                placeholder="Enter PayPal ID for upfront payment"
                                                                className="premium-input w-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200">
                                    No websites selected. This shouldn't happen in this workflow stage.
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column - Action Box */}
                    <div className="space-y-6">
                        <div className="premium-card p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                                <CheckCircle className="h-5 w-5 text-[var(--primary-cyan)]" />
                                Approve & Assign
                            </h2>

                            <div className="space-y-6">
                                {/* Select Writer */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        Select Writer <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                                        <select
                                            value={selectedWriter}
                                            onChange={(e) => setSelectedWriter(e.target.value)}
                                            className="premium-input w-full pl-10"
                                        >
                                            <option value="">Choose a writer...</option>
                                            {writers.map(writer => (
                                                <option key={writer.id} value={writer.id}>
                                                    {writer.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        Content Instructions <span className="text-xs text-[var(--text-muted)] normal-case">(Optional)</span>
                                    </label>
                                    <textarea
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Instructions for the writer..."
                                        rows={4}
                                        className="premium-input w-full min-h-[120px]"
                                    />
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || !selectedWriter}
                                    className="premium-btn premium-btn-primary w-full py-3 h-auto text-base justify-center"
                                >
                                    {submitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Assign to Writer
                                        </>
                                    )}
                                </button>

                                <div className="text-xs text-center text-[var(--text-muted)] mt-2">
                                    Submitting will move status to <strong className="text-[var(--text-primary)]">ASSIGNED_TO_WRITER</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default TeamSubmissionDetails;
