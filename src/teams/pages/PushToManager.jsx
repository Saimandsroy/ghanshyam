import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamAPI } from '../../lib/api';
import { ArrowLeft, Search, Trash2, Send, AlertCircle, ChevronLeft, ChevronRight, Filter, X, Globe, BarChart2, Tag, DollarSign, CheckCircle } from 'lucide-react';

/**
 * PushToManager - WORKFLOW STEP 2
 * Team selects websites from inventory and submits to Manager for approval
 */
export const PushToManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [selectedWebsites, setSelectedWebsites] = useState([]); // Array of {website, note, copyUrl}
    const [loading, setLoading] = useState(true);
    const [websitesLoading, setWebsitesLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [globalNote, setGlobalNote] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 15;

    // Filter state
    const [filters, setFilters] = useState({
        domain: '',
        traffic: '',
        category: ''
    });
    const [activeFilters, setActiveFilters] = useState({
        domain: '',
        traffic: '',
        category: ''
    });

    // Fetch task details
    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                const taskData = await teamAPI.getTaskForPush(id);
                setTask(taskData.task);
            } catch (err) {
                setError(err.message || 'Failed to load task');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    // Fetch websites with pagination and filters
    const fetchWebsites = useCallback(async () => {
        try {
            setWebsitesLoading(true);
            const websitesData = await teamAPI.getWebsites({
                page,
                limit: pageSize,
                domain: activeFilters.domain || undefined,
                traffic: activeFilters.traffic || undefined,
                category: activeFilters.category || undefined
            });
            setWebsites(websitesData.sites || websitesData.websites || []);
            setTotalPages(websitesData.pagination?.totalPages || 1);
            setTotal(websitesData.pagination?.total || 0);
        } catch (err) {
            console.error('Error fetching websites:', err);
        } finally {
            setWebsitesLoading(false);
        }
    }, [page, activeFilters]);

    useEffect(() => {
        fetchWebsites();
    }, [fetchWebsites]);

    // Apply filters and reset to page 1
    const handleApplyFilters = () => {
        setActiveFilters({ ...filters });
        setPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({ domain: '', traffic: '', category: '' });
        setActiveFilters({ domain: '', traffic: '', category: '' });
        setPage(1);
    };

    // Check if any filters are active
    const hasActiveFilters = activeFilters.domain || activeFilters.traffic || activeFilters.category;

    // Get required links count
    const requiredLinks = task?.no_of_links || 1;

    // Check if submit is allowed
    const canSubmit = selectedWebsites.length >= requiredLinks;

    // Filter websites based on search
    const filteredWebsites = useMemo(() => {
        if (!searchTerm) return websites;
        const term = searchTerm.toLowerCase();
        return websites.filter(w =>
            (w.root_domain || w.domain_url || '').toLowerCase().includes(term) ||
            (w.category || '').toLowerCase().includes(term)
        );
    }, [websites, searchTerm]);

    // Check if website is selected
    const isSelected = (websiteId) => {
        return selectedWebsites.some(sw => sw.website.id === websiteId);
    };

    // Toggle website selection
    const handleToggleWebsite = (website) => {
        if (isSelected(website.id)) {
            setSelectedWebsites(selectedWebsites.filter(sw => sw.website.id !== website.id));
        } else {
            setSelectedWebsites([...selectedWebsites, { website, note: '', copyUrl: '' }]);
        }
    };

    // Update note for selected website
    const handleUpdateNote = (websiteId, note) => {
        setSelectedWebsites(selectedWebsites.map(sw =>
            sw.website.id === websiteId ? { ...sw, note } : sw
        ));
    };

    // Update copyUrl for selected website
    const handleUpdateCopyUrl = (websiteId, copyUrl) => {
        setSelectedWebsites(selectedWebsites.map(sw =>
            sw.website.id === websiteId ? { ...sw, copyUrl } : sw
        ));
    };

    // Remove website from selected list
    const handleRemoveWebsite = (websiteId) => {
        setSelectedWebsites(selectedWebsites.filter(sw => sw.website.id !== websiteId));
    };

    // Submit selected websites to Manager
    const handleSubmit = async () => {
        if (!canSubmit) {
            setError(`Please select at least ${requiredLinks} website(s)`);
            return;
        }

        // Check if notes are filled for each website
        const isNicheEdit = task?.order_type?.toLowerCase().includes('niche');
        const missingNotes = selectedWebsites.some(sw => !sw.note || sw.note.trim() === '');
        const missingCopyUrls = isNicheEdit && selectedWebsites.some(sw => !sw.copyUrl || sw.copyUrl.trim() === '');

        if (missingNotes) {
            setError('Please fill in notes for all selected websites');
            return;
        }

        if (missingCopyUrls) {
            setError('Please fill in Post URL for all selected websites (required for Niche Edit orders)');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            const websiteIds = selectedWebsites.map(sw => sw.website.id);
            const websiteData = selectedWebsites.map(sw => ({
                id: sw.website.id,
                website_id: sw.website.id,
                note: sw.note || '',
                copyUrl: sw.copyUrl || ''
            }));
            const notes = globalNote || selectedWebsites.map(sw => `${sw.website.root_domain || sw.website.domain_url}: ${sw.note || 'No note'}`).join('\n');

            await teamAPI.submitWebsitesToManager(id, websiteIds, notes, websiteData);

            setSuccess('Websites submitted to Manager successfully!');
            setTimeout(() => {
                navigate('/teams/order-notifications');
            }, 1500);
        } catch (err) {
            console.error('Submit ERROR:', err);
            setError(err.message || 'Failed to submit websites');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary-cyan)]"></div>
                    <div className="text-[var(--text-secondary)]">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="premium-card p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <p className="text-red-400 text-lg mb-4">Order not found or you don't have access.</p>
                <button
                    onClick={() => navigate('/teams/order-notifications')}
                    className="premium-btn bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/teams/order-notifications')}
                    className="p-2 rounded-xl hover:bg-[var(--background-dark)] border border-transparent hover:border-[var(--border)] transition-all"
                >
                    <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Push to Manager</h1>
                    <p className="text-[var(--text-muted)]">Order #{task.id} • Select <span className="text-[var(--primary-cyan)] font-bold">{requiredLinks}</span> website(s)</p>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="premium-card p-4 border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="premium-card p-4 border-green-500/20 bg-green-500/10 text-green-400 flex items-center gap-3 animate-in slide-in-from-top-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* Order Details Card */}
            <div className="premium-card p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                    <Globe className="h-4 w-4 text-[var(--primary-cyan)]" />
                    Order Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Order ID</span>
                        <div className="font-mono text-[var(--primary-cyan)]">#{task.id}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Client</span>
                        <div className="text-[var(--text-primary)]">{task.client_name || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Type</span>
                        <div className="premium-badge inline-flex">{task.order_type || 'Guest Post'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Required Links</span>
                        <div className="text-[var(--primary-cyan)] font-bold text-lg">{requiredLinks}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Category</span>
                        <div className="text-[var(--text-primary)]">{task.category || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Package</span>
                        <div className="text-[var(--text-primary)]">{task.order_package || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">Manager</span>
                        <div className="text-[var(--text-primary)]">{task.manager_name || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">FC</span>
                        <div className={task.fc ? 'text-green-400' : 'text-[var(--text-muted)]'}>{task.fc ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>

            {/* Website Selection */}
            <div className="premium-card p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
                    <Search className="h-4 w-4 text-[var(--primary-cyan)]" />
                    Select Websites
                </h2>

                {/* Filter Section */}
                <div className="bg-[var(--background-dark)] rounded-xl p-5 mb-6 border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-[var(--primary-cyan)]" />
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                            Filters {hasActiveFilters && <span className="font-normal text-[var(--primary-cyan)]">({total} results)</span>}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Domain Filter */}
                        <div>
                            <label className="text-xs text-[var(--text-muted)] block mb-1.5 ml-1">Root Domain</label>
                            <input
                                type="text"
                                placeholder="e.g. example.com"
                                className="premium-input w-full"
                                value={filters.domain}
                                onChange={(e) => setFilters(f => ({ ...f, domain: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            />
                        </div>

                        {/* Traffic Filter */}
                        <div>
                            <label className="text-xs text-[var(--text-muted)] block mb-1.5 ml-1">Min Traffic</label>
                            <input
                                type="number"
                                placeholder="e.g. 1000"
                                className="premium-input w-full"
                                value={filters.traffic}
                                onChange={(e) => setFilters(f => ({ ...f, traffic: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="text-xs text-[var(--text-muted)] block mb-1.5 ml-1">Category</label>
                            <input
                                type="text"
                                placeholder="e.g. Technology"
                                className="premium-input w-full"
                                value={filters.category}
                                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleApplyFilters}
                                disabled={websitesLoading}
                                className="premium-btn bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90 h-[42px] px-4"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    disabled={websitesLoading}
                                    className="premium-btn bg-transparent border border-[var(--border)] hover:bg-[var(--background-dark)] text-[var(--text-secondary)] h-[42px] px-4"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {activeFilters.domain && (
                                <span className="premium-badge bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] border-[var(--primary-cyan)]/20 pl-2 pr-3 py-1 flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> {activeFilters.domain}
                                </span>
                            )}
                            {activeFilters.traffic && (
                                <span className="premium-badge bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] border-[var(--primary-cyan)]/20 pl-2 pr-3 py-1 flex items-center gap-1">
                                    <BarChart2 className="h-3 w-3" /> ≥{activeFilters.traffic}
                                </span>
                            )}
                            {activeFilters.category && (
                                <span className="premium-badge bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] border-[var(--primary-cyan)]/20 pl-2 pr-3 py-1 flex items-center gap-1">
                                    <Tag className="h-3 w-3" /> {activeFilters.category}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Search Bar (for current page local filter) */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Quick filter in current page..."
                        className="premium-input w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Available Websites Table with Checkboxes */}
                <div className="premium-table-container max-h-[400px]">
                    <table className="premium-table">
                        <thead className="sticky top-0 z-10 bg-[var(--background-dark)] shadow-sm">
                            <tr>
                                <th className="w-10 text-center">
                                    <span className="sr-only">Select</span>
                                </th>
                                <th>Domain</th>
                                <th>Added on</th>
                                <th>LO Created</th>
                                <th>DR</th>
                                <th>DA</th>
                                <th>Traffic</th>
                                <th>Category</th>
                                <th>GP Price</th>
                                <th>Niche Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWebsites.map((website) => (
                                <tr
                                    key={website.id}
                                    className={`cursor-pointer transition-colors ${isSelected(website.id) ? 'bg-[var(--primary-cyan)]/5' : 'hover:bg-white/5'}`}
                                    onClick={() => handleToggleWebsite(website)}
                                >
                                    <td className="text-center px-2">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected(website.id) ? 'bg-[var(--primary-cyan)] border-[var(--primary-cyan)]' : 'border-[var(--text-muted)] hover:border-[var(--text-secondary)]'}`}>
                                            {isSelected(website.id) && <CheckCircle className="h-3.5 w-3.5 text-black" />}
                                        </div>
                                    </td>
                                    <td className={`font-medium ${isSelected(website.id) ? 'text-[var(--primary-cyan)]' : 'text-[var(--text-primary)]'}`}>
                                        {website.root_domain || website.domain_url}
                                    </td>
                                    <td className="text-xs text-[var(--text-muted)]">
                                        {website.created_at ? new Date(website.created_at).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                    <td className="text-xs text-[var(--text-muted)]">
                                        {website.lo_created_at ? new Date(website.lo_created_at).toLocaleDateString('en-GB') : '-'}
                                    </td>
                                    <td>{website.dr || '-'}</td>
                                    <td>{website.da || '-'}</td>
                                    <td>{website.traffic?.toLocaleString() || '-'}</td>
                                    <td className="max-w-[150px] truncate" title={website.category}>{website.category || '-'}</td>
                                    <td className="font-mono text-[var(--success)]">${website.gp_price || 0}</td>
                                    <td className="font-mono text-[var(--success)]">${website.niche_price || 0}</td>
                                </tr>
                            ))}
                            {filteredWebsites.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="px-6 py-12 text-center text-[var(--text-muted)]">
                                        No websites found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-sm text-[var(--text-muted)]">
                        Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total} websites
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || websitesLoading}
                            className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-1 px-2">
                            {[1, 2, 3, 4, 5].filter(p => p <= totalPages).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p
                                        ? 'bg-[var(--primary-cyan)] text-black'
                                        : 'hover:bg-[var(--background-dark)] text-[var(--text-secondary)]'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            {totalPages > 5 && <span className="text-[var(--text-muted)] px-1">...</span>}
                        </div>

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || websitesLoading}
                            className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Selected Websites Section */}
            <div className="premium-card p-6 border-[var(--primary-cyan)]/30 shadow-[0_0_20px_rgba(107,240,255,0.05)]">
                <h2 className="text-lg font-semibold mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[var(--primary-cyan)]" />
                        Selected Sites ({selectedWebsites.length})
                    </div>
                    {!canSubmit && (
                        <span className="text-sm bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">
                            Select at least {requiredLinks}
                        </span>
                    )}
                </h2>

                {selectedWebsites.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--background-dark)]/50">
                        <Globe className="h-8 w-8 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
                        <p className="text-[var(--text-muted)]">No websites selected yet.</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Browse the table above and click rows to select.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedWebsites.map((item, index) => (
                            <div key={item.website.id} className="rounded-xl p-5 bg-[var(--background-dark)] border border-[var(--border)] relative group">
                                <button
                                    onClick={() => handleRemoveWebsite(item.website.id)}
                                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                                    title="Remove"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Site Info */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-[var(--primary-cyan)]/10 flex items-center justify-center text-[var(--primary-cyan)] font-bold text-xs border border-[var(--primary-cyan)]/30">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-[var(--text-primary)] font-bold text-lg">{item.website.root_domain || item.website.domain_url}</div>
                                                <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                                                    <DollarSign className="h-3 w-3" />
                                                    {task?.order_type?.toLowerCase().includes('niche') ? 'Niche Price: ' : 'GP Price: '}
                                                    <span className="text-[var(--success)] font-mono">${task?.order_type?.toLowerCase().includes('niche') ? (item.website.niche_edit_price || item.website.niche_price || 0) : (item.website.gp_price || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Fields */}
                                    <div className="space-y-3">
                                        {/* Copy URL - Only for Niche Edit orders */}
                                        {task?.order_type?.toLowerCase().includes('niche') && (
                                            <div>
                                                <label className="text-xs text-[var(--text-muted)] block mb-1 font-semibold">Post URL <span className="text-red-400">*</span></label>
                                                <input
                                                    className="premium-input w-full py-2 text-sm"
                                                    placeholder="Enter existing post URL..."
                                                    value={item.copyUrl || ''}
                                                    onChange={(e) => handleUpdateCopyUrl(item.website.id, e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs text-[var(--text-muted)] block mb-1 font-semibold">Note <span className="text-red-400">*</span></label>
                                            <textarea
                                                className="premium-input w-full py-2 text-sm min-h-[60px]"
                                                placeholder="Specific instructions for this site..."
                                                rows={2}
                                                value={item.note}
                                                onChange={(e) => handleUpdateNote(item.website.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Global Note */}
                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                    <label className="text-sm font-semibold text-[var(--text-primary)] block mb-2">Global Note (Optional)</label>
                    <textarea
                        className="premium-input w-full min-h-[80px]"
                        placeholder="Add a summary note for the manager..."
                        rows={3}
                        value={globalNote}
                        onChange={(e) => setGlobalNote(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !canSubmit}
                        className={`premium-btn px-8 py-3 text-base flex items-center gap-2 ${canSubmit
                            ? 'bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90 shadow-[0_0_20px_rgba(107,240,255,0.3)] hover:shadow-[0_0_30px_rgba(107,240,255,0.4)]'
                            : 'bg-[#2A2A2A] text-gray-500 border border-gray-700 cursor-not-allowed'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Submit to Manager ({selectedWebsites.length}/{requiredLinks})
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PushToManager;
