import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Eye, RefreshCw, FileText } from 'lucide-react';
import { adminAPI } from '../../../lib/api';

export function AdminOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ search: '', status: '' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await adminAPI.getOrders({ page, limit: pageSize });
            setOrders(response.orders || []);
            setTotal(response.total || 0);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Local filter - search within loaded data
    const filteredOrders = useMemo(() => {
        let list = orders;
        const q = filters.search.trim().toLowerCase();
        if (q) {
            list = list.filter(o =>
                (o.order_id || '').toLowerCase().includes(q) ||
                (o.client_name || '').toLowerCase().includes(q) ||
                (o.manager_name || '').toLowerCase().includes(q) ||
                (o.client_website || '').toLowerCase().includes(q)
            );
        }
        if (filters.status) {
            list = list.filter(o => o.status_label === filters.status);
        }
        return list;
    }, [orders, filters]);

    const getStatusBadge = (status) => {
        const statusStyles = {
            'Pending': { bg: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' },
            'In Progress': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
            'With Writer': { bg: 'rgba(168, 85, 247, 0.2)', color: '#A855F7' },
            'With Blogger': { bg: 'rgba(107, 240, 255, 0.2)', color: '#6BF0FF' },
            'Completed': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' },
            'Rejected': { bg: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' },
            'Unknown': { bg: 'rgba(107, 114, 128, 0.2)', color: '#6B7280' }
        };
        return statusStyles[status] || statusStyles['Unknown'];
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} total orders</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={loading}
                    className="p-2 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <p className="text-red-400">{error}</p>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">&times;</button>
                </div>
            )}

            {/* Filters */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            value={filters.search}
                            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                            type="text"
                            placeholder="Search by order id, client, manager, website..."
                            className="w-full rounded-xl px-10 py-2"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div className="relative min-w-[180px]">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                            className="w-full rounded-xl px-10 py-2 appearance-none"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="With Writer">With Writer</option>
                            <option value="With Blogger">With Blogger</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <button
                        onClick={() => setFilters({ search: '', status: '' })}
                        className="px-4 py-2 rounded-xl flex items-center gap-2"
                        style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                        <X size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <table className="w-full">
                    <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                        <tr>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order ID</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Manager</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Client Name</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Website</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>No of Links</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Type</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Ordered At</th>
                            <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                    <RefreshCw className="h-5 w-5 animate-spin inline mr-2" />
                                    Loading orders...
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => {
                                const statusStyle = getStatusBadge(order.status_label);
                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.order_id || `#${order.id}`}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.order_package || 'Standard'}</div>
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{order.manager_name || 'N/A'}</td>
                                        <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{order.client_name || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-1 rounded text-xs font-medium"
                                                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                                            >
                                                {order.status_label || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.client_website ? (
                                                <a
                                                    href={order.client_website}
                                                    className="text-sm hover:underline"
                                                    style={{ color: 'var(--primary-cyan)' }}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {order.client_website.replace(/^https?:\/\//, '').replace(/\/$/, '').substring(0, 30)}...
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>No site</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{order.no_of_links || 1}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-1 rounded text-xs font-medium"
                                                style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#A855F7' }}
                                            >
                                                {order.order_type === 'gp' ? 'Guest Post' : order.order_type === 'niche' ? 'Niche Edit' : order.order_type || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                className="p-2 rounded-lg transition-all hover:bg-white/10"
                                                title="View Order Details"
                                            >
                                                <Eye size={16} style={{ color: 'var(--primary-cyan)' }} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > pageSize && (
                <div className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg disabled:opacity-50"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * pageSize >= total}
                            className="px-4 py-2 rounded-lg disabled:opacity-50"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
