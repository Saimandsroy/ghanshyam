import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle, Clock, Minus, FileText } from 'lucide-react';

/**
 * TransactionsTable - Blogger Wallet History Table
 * Columns: Date | Order Id (with full URL) | Credit | Status (Pending/Approved) | Invoice
 */
import { useTableFilter } from '../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../components/common/UniversalTableFilter';

export function TransactionsTable({ transactions, loading }) {
    const navigate = useNavigate();

    // Add a computed 'display_status' property so useTableFilter can match on it
    const enrichedTransactions = useMemo(() => {
        return (transactions || []).map(tx => ({
            ...tx,
            display_status: tx.approved_date ? 'approved' : tx.request_date ? 'pending' : 'not_requested'
        }));
    }, [transactions]);

    // Define filter options using the computed display_status field
    const filterOptions = [
        {
            key: 'display_status',
            label: 'Status',
            options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'not_requested', label: 'Not Requested' }
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
    } = useTableFilter(enrichedTransactions, { display_status: 'all' });

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

    // Get combined status display (merges old Withdrawal Status + Approved Status)
    const getStatus = (tx) => {
        if (tx.approved_date) {
            return {
                label: 'Approved',
                date: formatDate(tx.approved_date),
                color: 'var(--color-success)',
                icon: CheckCircle,
                badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
            };
        }
        if (tx.request_date) {
            return {
                label: 'Pending',
                date: formatDate(tx.request_date),
                color: 'var(--color-warning)',
                icon: Clock,
                badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
            };
        }
        return {
            label: '-',
            date: null,
            color: 'var(--text-muted)',
            icon: Minus,
            badgeClass: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    };

    return (
        <div className="space-y-4">
            {(enrichedTransactions.length > 0 || searchQuery || filters.display_status !== 'all') && (
                <UniversalTableFilter
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                    filterOptions={filterOptions}
                />
            )}

            {filteredData.length === 0 && enrichedTransactions.length > 0 ? (
                <div className="premium-card p-12 text-center">
                    <p className="text-[var(--text-muted)]">No matching transactions found.</p>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="premium-card p-12 text-center">
                    <div className="h-16 w-16 bg-[var(--surface-muted)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--color-border)]">
                        <Clock className="h-8 w-8 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-main)]">No Transactions Found</h3>
                    <p className="text-[var(--text-muted)] mt-1">Your transaction history will appear here.</p>
                </div>
            ) : (
                <div className="premium-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Order Id</th>
                                <th>Credit</th>
                                <th>Status</th>
                                <th>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((tx) => {
                                const status = getStatus(tx);

                                return (
                                <tr key={tx.id} className="group transition-colors duration-200">
                                        {/* Date Column */}
                                        <td>
                                            <span className="font-mono text-xs text-[var(--text-muted)]">
                                                {formatDate(tx.date)}
                                            </span>
                                        </td>

                                        {/* Order Id Column - with full URL shown */}
                                        <td>
                                            <div>
                                                <div className="text-sm font-semibold text-[var(--color-primary)]">
                                                    {tx.order_id || tx.order_detail_id || tx.id}
                                                </div>
                                                {tx.submit_url && (
                                                    <a
                                                        href={tx.submit_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs flex items-center gap-1 mt-1 text-[var(--text-body)] hover:text-[var(--color-primary)] hover:underline opacity-80 hover:opacity-100 transition-opacity break-all"
                                                    >
                                                        {tx.submit_url}
                                                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
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

                                        {/* Status Column - merged Withdrawal + Approved */}
                                        <td>
                                            <div>
                                                <span className={`premium-badge ${status.badgeClass}`}>
                                                    <status.icon className="h-3 w-3" />
                                                    {status.label}
                                                </span>
                                                {status.date && (
                                                    <div className="text-[10px] mt-1 text-[var(--text-muted)] font-mono">
                                                        {status.date}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Invoice Column - link to invoice if credited */}
                                        <td>
                                            {tx.withdraw_request_id ? (
                                                <button
                                                    onClick={() => navigate(`/blogger/payments/invoices/${tx.withdraw_request_id}`)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
                                                    View Invoice
                                                </button>
                                            ) : (
                                                <span className="text-xs text-[var(--text-muted)]">-</span>
                                            )}
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
