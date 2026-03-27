import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Pagination } from '../../../components/Pagination.jsx';
import { managerAPI } from '../../../lib/api';

export const RejectedWriters = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ orderId: '', user: '' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await managerAPI.getRejectedWriterOrders(page, pageSize);
            setOrders(response.orders || []);
            setTotal(response.total || 0);
        } catch (err) {
            console.error('Error fetching rejected writer orders:', err);
            setError(err.message || 'Failed to load rejected writer orders');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter orders locally
    const filteredOrders = useMemo(() => {
        let list = orders;
        if (filters.orderId) {
            list = list.filter(x =>
                (x.manual_order_id || `${x.order_id}`).toLowerCase().includes(filters.orderId.toLowerCase())
            );
        }
        if (filters.user) {
            list = list.filter(x =>
                (x.writer_name || '').toLowerCase().includes(filters.user.toLowerCase()) ||
                (x.writer_email || '').toLowerCase().includes(filters.user.toLowerCase())
            );
        }
        return list;
    }, [orders, filters]);

    const handleViewOrder = (order) => {
        // Navigate to the team submission details page so manager can reassign
        navigate(`/manager/pending/teams/${order.order_id}`);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rejected Orders - Writers</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Review orders rejected by writers.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[var(--text-muted)] bg-[var(--background-dark)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                        {total} total rejected orders
                    </span>
                    <button
                        onClick={fetchOrders}
                        className="premium-btn premium-btn-accent"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="premium-card p-4 flex items-center justify-between border-l-4 border-[var(--error)] mb-6">
                    <p className="text-[var(--error)] font-medium">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="text-sm font-semibold underline text-[var(--text-primary)] hover:text-[var(--primary-cyan)]"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="premium-card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <input
                            className="premium-input w-full pl-10"
                            placeholder="Search by Order ID..."
                            value={filters.orderId}
                            onChange={(e) => setFilters(f => ({ ...f, orderId: e.target.value }))}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                    <div className="relative flex-1">
                        <input
                            className="premium-input w-full pl-10"
                            placeholder="Search by Writer Name/Email..."
                            value={filters.user}
                            onChange={(e) => setFilters(f => ({ ...f, user: e.target.value }))}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                    <button
                        className="premium-btn text-sm px-4 py-2 bg-[var(--background-dark)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] whitespace-nowrap"
                        onClick={() => setFilters({ orderId: '', user: '' })}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="premium-table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Type</th>
                            <th>Writer</th>
                            <th>Client</th>
                            <th>Status</th>
                            <th>Reject Reason</th>
                            <th>Date</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-muted)]">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--border)] border-t-[var(--primary-cyan)]"></div>
                                    <p className="mt-4 font-medium">Loading rejected orders...</p>
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-muted)] font-medium">
                                    No rejected writer orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.process_id} className="group">
                                    <td className="font-medium text-[var(--primary-cyan)]">
                                        {order.manual_order_id || `#${order.order_id}`}
                                    </td>
                                    <td>
                                        <span className="premium-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                                            {order.order_type || 'Guest Post'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[var(--background-dark)] flex items-center justify-center font-bold text-[var(--text-muted)] border border-[var(--border)] flex-shrink-0">
                                                {(order.writer_name || 'W')[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-[var(--text-primary)] truncate">{order.writer_name || 'N/A'}</div>
                                                <div className="text-xs text-[var(--text-secondary)] truncate">{order.writer_email || ''}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{order.client_name || 'N/A'}</td>
                                    <td>
                                        <span className="premium-badge bg-red-500/10 text-red-400 border border-red-500/20">
                                            Rejected
                                        </span>
                                    </td>
                                    <td className="text-sm">
                                        <span className="text-red-400 max-w-xs block truncate" title={order.reject_reason || 'No reason provided'}>
                                            {order.reject_reason || 'No reason provided'}
                                        </span>
                                    </td>
                                    <td className="text-[var(--text-muted)] text-sm whitespace-nowrap">
                                        {formatDate(order.updated_at || order.created_at)}
                                    </td>
                                    <td className="text-right">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="premium-btn premium-btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                                        >
                                            Review <ArrowRight className="h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > 0 && (
                <div className="mt-4">
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        pageSizeOptions={[20, 50, 100]}
                        onPageChange={setPage}
                        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                    />
                </div>
            )}
        </Layout>
    );
};

export default RejectedWriters;
