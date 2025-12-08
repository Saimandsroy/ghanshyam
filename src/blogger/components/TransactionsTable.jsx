import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

/**
 * TransactionsTable - Display transaction history
 * @param {Array} transactions - Transaction list
 * @param {boolean} loading - Loading state
 */
export function TransactionsTable({ transactions, loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                    <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading transactions...</p>
                </div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'credited':
                return {
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22C55E',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                };
            case 'pending':
            case 'requested':
                return {
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: '#F59E0B',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                };
            case 'rejected':
                return {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                };
            default:
                return {
                    backgroundColor: 'rgba(107, 240, 255, 0.1)',
                    color: '#6BF0FF',
                    border: '1px solid rgba(107, 240, 255, 0.3)'
                };
        }
    };

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
                <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                    <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Transaction</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Amount</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => {
                        const isCredit = tx.transaction_type === 'CREDIT' || tx.type === 'credit';
                        const statusStyle = getStatusStyle(tx.status);

                        return (
                            <tr
                                key={tx.id}
                                className="hover:bg-white/5 transition-colors"
                                style={{ borderBottom: '1px solid var(--border)' }}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: isCredit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
                                        >
                                            {isCredit ? (
                                                <ArrowDownLeft className="h-4 w-4" style={{ color: '#22C55E' }} />
                                            ) : (
                                                <ArrowUpRight className="h-4 w-4" style={{ color: '#EF4444' }} />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            #{tx.id}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                                        {tx.transaction_type?.toLowerCase() || tx.type || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="text-sm font-semibold"
                                        style={{ color: isCredit ? '#22C55E' : '#EF4444' }}
                                    >
                                        {isCredit ? '+' : '-'}${parseFloat(tx.amount || 0).toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-1 rounded text-xs font-medium capitalize"
                                        style={statusStyle}
                                    >
                                        {tx.status || 'Completed'}
                                    </span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(tx.created_at || tx.date).toLocaleString()}
                                </td>
                            </tr>
                        );
                    })}
                    {transactions.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                No transactions found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
