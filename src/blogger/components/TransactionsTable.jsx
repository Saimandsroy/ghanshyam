import React from 'react';
import { ExternalLink, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';

/**
 * TransactionsTable - Production matching wallet history table
 * Columns: Date | Order Id (with URL) | Credit | Withdrawal Status | Approved Status
 */
import { useTableFilter } from '../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../components/common/UniversalTableFilter';

/**
 * TransactionsTable - Production matching wallet history table
 * Columns: Date | Order Id (with URL) | Credit | Withdrawal Status | Approved Status
 */
export function TransactionsTable({ transactions, loading }) {
    // Define filter options
    const filterOptions = [
        {
            key: 'status', // withdrawal status code (1=pending, 2=approved, 3=rejected)
            label: 'Withdrawal Status',
            options: [
                { value: 'all', label: 'All Statuses' },
                { value: '1', label: 'Pending' },
                { value: '2', label: 'Approved' },
                { value: '3', label: 'Rejected' }
            ]
        }
    ];

    const {
        filteredData,
        searchQuery,
        filters,
        handleSearchChange,
        handleFilterChange,
        clearFilters
    } = useTableFilter(transactions, { status: 'all' });

    if (loading) {
        return (
            <div className="premium-card p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary-cyan)] border-t-transparent"></div>
                <p className="mt-4 text-sm font-medium text-[var(--text-muted)]">Loading transactions...</p>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'N/A';
        }
    };

    // Format approved date like production: "Tue, Dec 30, 2025 8:45 PM"
    const formatApprovedDate = (dateStr) => {
        if (!dateStr) return null;
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return null;
        }
    };

    // Get withdrawal status display
    const getWithdrawalStatus = (tx) => {
        if (!tx.request_date && tx.type === 'credit') {
            return { label: '-', color: 'var(--text-muted)', icon: Minus, badgeClass: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
        }
        if (Number(tx.status) === 1) {
            return { label: 'Pending', color: 'var(--warning)', icon: Clock, badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
        }
        if (Number(tx.status) === 2) {
            return { label: 'Approved', color: 'var(--success)', icon: CheckCircle, badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
        }
        if (Number(tx.status) === 3) {
            return { label: 'Rejected', color: 'var(--error)', icon: XCircle, badgeClass: 'bg-red-500/10 text-red-500 border-red-500/20' };
        }
        return { label: '-', color: 'var(--text-muted)', icon: Minus, badgeClass: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    };

    // Get approved status display with formatted date
    const getApprovedStatus = (tx) => {
        if (tx.approved_date) {
            return {
                label: 'Approved',
                date: formatApprovedDate(tx.approved_date),
                color: 'var(--success)',
                icon: CheckCircle
            };
        }
        if (tx.request_date && !tx.approved_date) {
            return { label: 'Pending', date: null, color: 'var(--warning)', icon: Clock };
        }
        return { label: '-', date: null, color: 'var(--text-muted)', icon: Minus };
    };

    return (
        <div className="space-y-4">
            {(transactions.length > 0 || searchQuery || filters.status !== 'all') && (
                <UniversalTableFilter
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    filterOptions={filterOptions}
                />
            )}

            {filteredData.length === 0 && transactions.length > 0 ? (
                <div className="premium-card p-12 text-center">
                    <p className="text-[var(--text-secondary)]">No matching transactions found.</p>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="premium-card p-12 text-center">
                    <div className="h-16 w-16 bg-[var(--background-dark)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                        <Clock className="h-8 w-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">No Transactions Found</h3>
                    <p className="text-[var(--text-secondary)] mt-1">Your transaction history will appear here.</p>
                </div>
            ) : (
                <div className="premium-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Order Id</th>
                                <th>Credit</th>
                                <th>Withdrawal Status</th>
                                <th>Approved Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((tx) => {
                                const withdrawalStatus = getWithdrawalStatus(tx);
                                const approvedStatus = getApprovedStatus(tx);

                                return (
                                    <tr key={tx.id} className="group hover:bg-[var(--background-dark)]/50 transition-colors duration-200">
                                        {/* Date Column */}
                                        <td>
                                            <span className="font-mono text-xs text-[var(--text-secondary)]">
                                                {formatDate(tx.date)}
                                            </span>
                                        </td>

                                        {/* Order Id Column - use order_id from new_orders table, fallback to order_detail_id */}
                                        <td>
                                            <div>
                                                <div className="text-sm font-bold text-[var(--text-primary)]">
                                                    {tx.order_id || tx.order_detail_id || tx.id}
                                                </div>
                                                {tx.submit_url && (
                                                    <a
                                                        href={tx.submit_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs flex items-center gap-1 mt-1 text-[var(--primary-cyan)] hover:underline opacity-80 hover:opacity-100 transition-opacity"
                                                    >
                                                        {tx.submit_url.length > 30
                                                            ? tx.submit_url.substring(0, 30) + '...'
                                                            : tx.submit_url}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </td>

                                        {/* Credit Column */}
                                        <td>
                                            <span className="text-sm font-bold text-emerald-500">
                                                ${parseFloat(tx.credit || 0).toFixed(0)}
                                            </span>
                                        </td>

                                        {/* Withdrawal Status Column */}
                                        <td>
                                            <span className={`premium-badge ${withdrawalStatus.badgeClass}`}>
                                                <withdrawalStatus.icon className="h-3 w-3" />
                                                {withdrawalStatus.label}
                                            </span>
                                        </td>

                                        {/* Approved Status Column - shows status and formatted date */}
                                        <td>
                                            <div>
                                                <div className={`flex items-center gap-1.5 font-medium text-sm`} style={{ color: approvedStatus.color }}>
                                                    {approvedStatus.icon && <approvedStatus.icon className="h-3.5 w-3.5" />}
                                                    {approvedStatus.label}
                                                </div>
                                                {approvedStatus.date && (
                                                    <div className="text-[10px] mt-1 text-[var(--text-muted)] font-mono">
                                                        {approvedStatus.date}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
