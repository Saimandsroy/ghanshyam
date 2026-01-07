import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, Check, X as XIcon } from 'lucide-react';
import { managerAPI } from '../../../lib/api';
import { Layout } from '../../components/layout/Layout';

export const PendingFromBloggers = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getPendingFromBloggers();
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await managerAPI.finalizeTask(orderId);
      setSuccess('Order approved and blogger credited!');
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to approve order');
    }
  };

  const handleReject = async (orderId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await managerAPI.rejectTask(orderId, reason);
      setSuccess('Order rejected');
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reject order');
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pending Orders From Bloggers</h1>
          <button onClick={fetchOrders} className="btn" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400">
            {error}
            <button onClick={() => setError('')} className="ml-2">&times;</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400">
            {success}
          </div>
        )}

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Type</th>
                <th>Blogger</th>
                <th>Website</th>
                <th>Status</th>
                <th>Updated At</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    No pending orders from bloggers
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="font-semibold text-[var(--text-primary)]">#{order.id}</div>
                    </td>
                    <td>
                      <span className="premium-badge border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                        {order.order_type || 'Guest Post'}
                      </span>
                    </td>
                    <td>
                      <div className="font-medium text-[var(--text-primary)]">{order.blogger_name || 'N/A'}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{order.blogger_email}</div>
                    </td>
                    <td>
                      {order.website_url ? (
                        <a href={order.website_url} className="flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--primary-cyan)] transition-colors" target="_blank" rel="noreferrer">
                          <img src={`https://www.google.com/s2/favicons?domain=${order.website_url}&sz=32`} className="w-4 h-4 rounded-sm opacity-80" alt="" />
                          {order.website_url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="premium-badge-dot bg-orange-500"></div>
                        <span className="text-sm font-medium text-orange-400">
                          {order.current_status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm text-[var(--text-muted)]">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-cyan)] hover:bg-[var(--primary-cyan)]/10 transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="p-1.5 rounded-lg text-green-400 hover:bg-green-400/10 transition-colors"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Reject"
                        >
                          <XIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
                <button onClick={() => setShowDetailModal(false)} className="text-xl">&times;</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background-dark p-3 rounded">
                    <div className="text-sm text-secondary">Client</div>
                    <div className="font-medium">{selectedOrder.client_name}</div>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <div className="text-sm text-secondary">Order Type</div>
                    <div className="font-medium">{selectedOrder.order_type}</div>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <div className="text-sm text-secondary">Blogger</div>
                    <div className="font-medium">{selectedOrder.blogger_name}</div>
                  </div>
                  <div className="bg-background-dark p-3 rounded">
                    <div className="text-sm text-secondary">Website</div>
                    <div className="font-medium truncate">{selectedOrder.website_url}</div>
                  </div>
                </div>

                {selectedOrder.live_published_url && (
                  <div className="bg-background-dark p-3 rounded">
                    <div className="text-sm text-secondary">Published URL</div>
                    <a href={selectedOrder.live_published_url} className="text-accent underline" target="_blank" rel="noreferrer">
                      {selectedOrder.live_published_url}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => handleApprove(selectedOrder.id)} className="btn btn-accent flex-1">
                  Approve & Credit Blogger
                </button>
                <button onClick={() => handleReject(selectedOrder.id)} className="btn flex-1 bg-red-500/20 text-red-400">
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PendingFromBloggers;
