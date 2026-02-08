import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminAPI } from '../../../lib/api';
import { CheckCircle, XCircle, Clock, RefreshCw, ExternalLink, Filter, ChevronDown, Link2, AlertTriangle, Play, Square } from 'lucide-react';

/**
 * LinkCompleted Page - Grouped by Client
 * Route: /admin/sites/link-completed
 */
export function LinkCompleted() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ completed: 0, live: 0, removed: 0 });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [yearFilter, setYearFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState(''); // 'live', 'removed', or '' for all
    const [checkingId, setCheckingId] = useState(null);

    // Bulk check state
    const [bulkStatus, setBulkStatus] = useState({ running: false, total: 0, checked: 0, live: 0, notFound: 0, errors: 0 });
    const pollRef = useRef(null);

    // Generate year options (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const fetchData = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: 50 };
            if (yearFilter) params.year = yearFilter;
            if (statusFilter) params.status = statusFilter;

            const result = await adminAPI.getCompletedLinks(params);
            setData(result.data || []);
            setStats(result.stats || { completed: 0, live: 0, removed: 0 });
            setPagination(result.pagination || { page: 1, pages: 1, total: 0 });
        } catch (error) {
            console.error('Error fetching completed links:', error);
        } finally {
            setLoading(false);
        }
    }, [yearFilter, statusFilter]);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    // Poll bulk check status
    const pollBulkStatus = useCallback(async () => {
        try {
            const status = await adminAPI.getBulkCheckStatus();
            setBulkStatus(status);
            if (!status.running && pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
                fetchData(pagination.page); // Refresh data when done
            }
        } catch (error) {
            console.error('Error polling status:', error);
        }
    }, [fetchData, pagination.page]);

    // Start bulk check
    const handleStartBulkCheck = async () => {
        try {
            await adminAPI.startBulkCheck();
            setBulkStatus(prev => ({ ...prev, running: true }));
            pollRef.current = setInterval(pollBulkStatus, 2000); // Poll every 2 seconds
        } catch (error) {
            console.error('Error starting bulk check:', error);
        }
    };

    // Stop bulk check
    const handleStopBulkCheck = async () => {
        try {
            await adminAPI.stopBulkCheck();
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
            setBulkStatus(prev => ({ ...prev, running: false }));
            fetchData(pagination.page);
        } catch (error) {
            console.error('Error stopping bulk check:', error);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const handleCheckLink = async (groupIndex, linkIndex, link) => {
        const checkKey = `${groupIndex}-${linkIndex}`;
        setCheckingId(checkKey);
        try {
            const group = data[groupIndex];
            const result = await adminAPI.checkLinkStatus({
                detailId: link.detail_id,
                bloggerLink: link.blogger_link,
                clientWebsite: group.client_website,
                anchorText: link.anchor_text
            });

            // Update local state (table row)
            setData(prev => prev.map((g, gi) => {
                if (gi !== groupIndex) return g;
                return {
                    ...g,
                    links: g.links.map((l, li) =>
                        li === linkIndex
                            ? { ...l, link_status: result.status, link_check_result: result.result }
                            : l
                    )
                };
            }));

            // Update stats locally without refreshing the table
            setStats(prev => {
                const oldStatus = link.link_status;
                const newStatus = result.status;
                let newStats = { ...prev };

                // Decrement old status count
                if (oldStatus === 'Live') newStats.live = Math.max(0, newStats.live - 1);
                else if (oldStatus && oldStatus !== 'Pending Check') newStats.removed = Math.max(0, newStats.removed - 1);

                // Increment new status count
                if (newStatus === 'Live') newStats.live = newStats.live + 1;
                else if (newStatus && newStatus !== 'Pending Check') newStats.removed = newStats.removed + 1;

                return newStats;
            });

        } catch (error) {
            console.error('Error checking link:', error);
        } finally {
            setCheckingId(null);
        }
    };

    const getStatusDisplay = (link) => {
        const status = link.link_status;
        const result = link.link_check_result;

        if (status === 'Live') {
            return (
                <a
                    href={link.blogger_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
                >
                    <CheckCircle className="w-3 h-3" />
                    {result || 'Live'}
                    <ExternalLink className="w-3 h-3" />
                </a>
            );
        }
        if (status === 'Pending Check' || !status) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            );
        }
        if (status === 'Issue') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <AlertTriangle className="w-3 h-3" />
                    {result || 'Issue'}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                <XCircle className="w-3 h-3" />
                {result || status || 'Not Found'}
            </span>
        );
    };

    return (
        <div className="animate-fadeIn space-y-6">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Links Card */}
                <div
                    className={`premium-card p-6 cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === '' ? 'ring-2 ring-[var(--primary-cyan)]' : ''}`}
                    onClick={() => setStatusFilter('')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--text-muted)] text-sm">Total Links</p>
                            <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stats.completed}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[var(--primary-cyan)]/10 flex items-center justify-center">
                            <Link2 className="w-6 h-6 text-[var(--primary-cyan)]" />
                        </div>
                    </div>
                    {statusFilter === '' && <div className="mt-2 text-xs text-[var(--primary-cyan)]">Showing All</div>}
                </div>

                {/* Live Links Card */}
                <div
                    className={`premium-card p-6 cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'live' ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => setStatusFilter('live')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--text-muted)] text-sm">Live Links</p>
                            <h3 className="text-3xl font-bold text-green-500 mt-1">{stats.live}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    {statusFilter === 'live' && <div className="mt-2 text-xs text-green-500">Filtering Live Only</div>}
                </div>

                {/* Removed/Issue Links Card */}
                <div
                    className={`premium-card p-6 cursor-pointer transition-all hover:scale-[1.02] ${statusFilter === 'removed' ? 'ring-2 ring-red-500' : ''}`}
                    onClick={() => setStatusFilter('removed')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--text-muted)] text-sm">Removed/Issue Links</p>
                            <h3 className="text-3xl font-bold text-red-500 mt-1">{stats.removed}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                    {statusFilter === 'removed' && <div className="mt-2 text-xs text-red-500">Filtering Removed Only</div>}
                </div>
            </div>

            {/* Filter Section */}
            <div className="premium-card p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">All Links</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="appearance-none bg-[var(--background-dark)] border border-[var(--border)] rounded-lg px-4 py-2 pr-8 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-cyan)]/50"
                            >
                                <option value="">All Years</option>
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                        </div>
                        <button
                            onClick={() => fetchData(1)}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-cyan)] text-white rounded-lg hover:bg-[var(--primary-cyan)]/80 transition-colors text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Apply
                        </button>

                        {/* Check All Button */}
                        {!bulkStatus.running ? (
                            <button
                                onClick={handleStartBulkCheck}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                                <Play className="w-4 h-4" />
                                Check All
                            </button>
                        ) : (
                            <button
                                onClick={handleStopBulkCheck}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                <Square className="w-4 h-4" />
                                Stop
                            </button>
                        )}
                    </div>
                </div>

                {/* Bulk Check Progress */}
                {bulkStatus.running && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[var(--text-secondary)]">
                                Checking links... {bulkStatus.checked} / {bulkStatus.total}
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                                Live: {bulkStatus.live} | Not Found: {bulkStatus.notFound} | Errors: {bulkStatus.errors}
                            </span>
                        </div>
                        <div className="w-full bg-[var(--background-dark)] rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--primary-cyan)] to-green-500 transition-all duration-300"
                                style={{ width: `${bulkStatus.total ? (bulkStatus.checked / bulkStatus.total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Data Table */}
            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="premium-table w-full">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Website</th>
                                <th># Links</th>
                                <th>Target URL</th>
                                <th>Blogger Link</th>
                                <th>Anchor Text</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-[var(--text-muted)]">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-[var(--text-muted)]">
                                        No links found
                                    </td>
                                </tr>
                            ) : (
                                data.map((group, groupIndex) => (
                                    group.links.map((link, linkIndex) => (
                                        <tr key={`${groupIndex}-${linkIndex}`} className="hover:bg-[var(--background-dark)]/50 transition-colors border-b border-[var(--border)]">
                                            {/* Client Name - rowspan */}
                                            {linkIndex === 0 && (
                                                <td
                                                    rowSpan={group.links.length}
                                                    className="font-medium text-[var(--text-primary)] align-top border-r border-[var(--border)] bg-[var(--background-dark)]/30"
                                                >
                                                    {group.client_name || 'N/A'}
                                                </td>
                                            )}
                                            {/* Website - rowspan */}
                                            {linkIndex === 0 && (
                                                <td
                                                    rowSpan={group.links.length}
                                                    className="align-top border-r border-[var(--border)] bg-[var(--background-dark)]/30"
                                                >
                                                    <a
                                                        href={group.client_website?.startsWith('http') ? group.client_website : `https://${group.client_website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[var(--primary-cyan)] hover:underline flex items-center gap-1"
                                                    >
                                                        {group.client_website?.replace(/^https?:\/\//, '').slice(0, 25)}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </td>
                                            )}
                                            {/* # Links - rowspan */}
                                            {linkIndex === 0 && (
                                                <td
                                                    rowSpan={group.links.length}
                                                    className="text-center align-top border-r border-[var(--border)] bg-[var(--background-dark)]/30"
                                                >
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] font-bold">
                                                        {group.link_count}
                                                    </span>
                                                </td>
                                            )}
                                            {/* Target URL */}
                                            <td>
                                                <a
                                                    href={link.target_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[var(--text-secondary)] hover:text-[var(--primary-cyan)] flex items-center gap-1 text-sm"
                                                >
                                                    {link.target_url?.slice(0, 35)}{link.target_url?.length > 35 ? '...' : ''}
                                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                            </td>
                                            {/* Blogger Link */}
                                            <td>
                                                {link.blogger_link ? (
                                                    <a
                                                        href={link.blogger_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                                                    >
                                                        {link.blogger_link?.slice(0, 35)}{link.blogger_link?.length > 35 ? '...' : ''}
                                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">N/A</span>
                                                )}
                                            </td>
                                            {/* Anchor Text */}
                                            <td className="text-sm text-[var(--text-secondary)]">
                                                {link.anchor_text || 'N/A'}
                                            </td>
                                            {/* Status */}
                                            <td>
                                                {getStatusDisplay(link)}
                                            </td>
                                            {/* Action */}
                                            <td>
                                                <button
                                                    onClick={() => handleCheckLink(groupIndex, linkIndex, link)}
                                                    disabled={checkingId === `${groupIndex}-${linkIndex}` || !link.blogger_link}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-secondary)] hover:border-[var(--primary-cyan)] hover:text-[var(--primary-cyan)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <RefreshCw className={`w-3 h-3 ${checkingId === `${groupIndex}-${linkIndex}` ? 'animate-spin' : ''}`} />
                                                    {checkingId === `${groupIndex}-${linkIndex}` ? 'Checking...' : 'Check'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)]">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} links)
                        </p>
                        <div className="flex items-center gap-1">
                            {/* Previous Button */}
                            <button
                                onClick={() => fetchData(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="px-3 py-1.5 text-sm bg-[var(--background-dark)] border border-[var(--border)] rounded-lg disabled:opacity-50 hover:border-[var(--primary-cyan)] transition-colors"
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {(() => {
                                const pages = [];
                                const current = pagination.page;
                                const total = pagination.pages;

                                // Always show first page
                                pages.push(1);

                                // Show ellipsis if current is far from start
                                if (current > 4) {
                                    pages.push('...');
                                }

                                // Show pages around current
                                for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
                                    if (!pages.includes(i)) {
                                        pages.push(i);
                                    }
                                }

                                // Show ellipsis if current is far from end
                                if (current < total - 3) {
                                    pages.push('...');
                                }

                                // Always show last two pages
                                if (total > 1 && !pages.includes(total - 1)) {
                                    pages.push(total - 1);
                                }
                                if (total > 0 && !pages.includes(total)) {
                                    pages.push(total);
                                }

                                return pages.map((p, idx) => {
                                    if (p === '...') {
                                        return (
                                            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-[var(--text-muted)]">
                                                ...
                                            </span>
                                        );
                                    }
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => fetchData(p)}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${current === p
                                                ? 'bg-[var(--primary-cyan)] text-white'
                                                : 'bg-[var(--background-dark)] border border-[var(--border)] hover:border-[var(--primary-cyan)] text-[var(--text-secondary)]'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                });
                            })()}

                            {/* Next Button */}
                            <button
                                onClick={() => fetchData(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="px-3 py-1.5 text-sm bg-[var(--background-dark)] border border-[var(--border)] rounded-lg disabled:opacity-50 hover:border-[var(--primary-cyan)] transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
