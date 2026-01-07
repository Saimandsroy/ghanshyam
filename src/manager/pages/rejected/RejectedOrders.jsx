import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { Pagination } from '../../../components/Pagination.jsx';
import { managerAPI } from '../../../lib/api';

export const RejectedOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchOrders();
    }, [page, pageSize]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getRejectedOrders(page, pageSize);
            setOrders(response.orders || []);
            setTotal(response.total || 0);
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Rejected Orders - Bloggers</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted">{total} total rejected orders</span>
                    <button onClick={fetchOrders} className="btn" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400">
                    {error}
                    <button onClick={() => setError('')} className="ml-2">&times;</button>
                </div>
            )}

            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-background-dark">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm text-muted">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Client</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Order Type</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Website</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Blogger</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Rejection Reason</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Rejected At</th>
                            <th className="px-4 py-3 text-left text-sm text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-muted">Loading...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                                    No rejected orders
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-t border-border hover:bg-white/5">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{order.order_id || `#${order.id}`}</div>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{order.client_name || 'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                                            {order.order_type || 'Guest Post'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {order.website_url ? (
                                            <a href={`https://${order.website_url}`} className="text-accent underline text-sm" target="_blank" rel="noreferrer">
                                                {order.website_url}
                                            </a>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{order.blogger_name || 'N/A'}</div>
                                        <div className="text-xs text-muted">{order.blogger_email || ''}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-red-400 text-sm">
                                            {order.rejection_reason || 'No reason provided'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {formatDate(order.updated_at || order.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                                            className="p-2 rounded hover:bg-white/10"
                                            title="View Details"
                                        >
                                            <Eye size={16} className="text-accent" />
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

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Rejected Order {selectedOrder.order_id || `#${selectedOrder.id}`}</h2>
                            <button onClick={() => setShowDetailModal(false)} className="text-xl">&times;</button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-background-dark p-3 rounded">
                                    <div className="text-sm text-secondary">Client</div>
                                    <div className="font-medium">{selectedOrder.client_name || 'N/A'}</div>
                                </div>
                                <div className="bg-background-dark p-3 rounded">
                                    <div className="text-sm text-secondary">Order Type</div>
                                    <div className="font-medium">{selectedOrder.order_type || 'Guest Post'}</div>
                                </div>
                                <div className="bg-background-dark p-3 rounded">
                                    <div className="text-sm text-secondary">Blogger</div>
                                    <div className="font-medium">{selectedOrder.blogger_name || 'N/A'}</div>
                                    <div className="text-xs text-muted">{selectedOrder.blogger_email || ''}</div>
                                </div>
                                <div className="bg-background-dark p-3 rounded">
                                    <div className="text-sm text-secondary">Website</div>
                                    <div className="font-medium truncate">{selectedOrder.website_url || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded">
                                <div className="text-sm text-red-400 mb-1">Rejection Reason</div>
                                <div className="font-medium text-red-300">
                                    {selectedOrder.rejection_reason || 'No reason provided'}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowDetailModal(false)} className="btn flex-1">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RejectedOrders;
