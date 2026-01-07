import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, Eye, Edit2, RefreshCw, User, Tag, ExternalLink, Calendar, Check, Globe, FileText, LayoutTemplate, MoreHorizontal } from 'lucide-react';
import { Pagination } from '../../../components/Pagination.jsx';
import { managerAPI } from '../../../lib/api';
import { useSocket } from '../../../context/SocketContext.jsx';
import { Layout } from '../../components/layout/Layout';

const STATUS_LABELS = {
  'Pending': 'Pending',
  'In Progress': 'In Progress',
  'With Writer': 'With Writer',
  'With Blogger': 'With Blogger',
  'Completed': 'Completed',
  'Rejected': 'Rejected'
};

export const ViewOrders = () => {
  const navigate = useNavigate();
  const { socket, isConnected, joinOrdersList } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '', orderType: '' });

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await managerAPI.getOrders({ page, limit: pageSize });
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

  // Join orders-list room for real-time updates
  useEffect(() => {
    if (socket && isConnected) {
      joinOrdersList();

      // Listen for new orders
      socket.on('order-created', (data) => {
        console.log('📡 Real-time: Order created', data);
        setOrders(prev => [data.order, ...prev]);
        setTotal(prev => prev + 1);
        setSuccess('New order created!');
        setTimeout(() => setSuccess(''), 3000);
      });

      // Listen for order updates
      socket.on('order-updated', (data) => {
        console.log('📡 Real-time: Order updated', data);
        setOrders(prev => prev.map(o =>
          o.id === data.order.id ? { ...o, ...data.order } : o
        ));
      });

      // Listen for workflow changes
      socket.on('workflow-changed', (data) => {
        console.log('📡 Real-time: Workflow changed', data);
        fetchOrders(); // Refresh to get latest status
      });
    }

    return () => {
      if (socket) {
        socket.off('order-created');
        socket.off('order-updated');
        socket.off('workflow-changed');
      }
    };
  }, [socket, isConnected, joinOrdersList, fetchOrders]);

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
    if (filters.orderType) {
      list = list.filter(o => {
        if (filters.orderType === 'gp') return o.order_type === 'gp';
        if (filters.orderType === 'niche') return o.order_type === 'niche';
        return true;
      });
    }
    return list;
  }, [orders, filters]);

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const openEditModal = (order) => {
    setEditData({
      client_name: order.client_name || '',
      client_website: order.client_website || '',
      order_type: order.order_type || 'gp',
      no_of_links: order.no_of_links || 1,
      message: order.message || ''
    });
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      await managerAPI.updateOrder(selectedOrder.id, editData);
      setSuccess('Order updated successfully!');
      setShowEditModal(false);
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'With Writer': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'With Blogger': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Unknown': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
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
    <Layout>
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">View Orders</h1>
            <p className="text-[var(--text-muted)] mt-1">{total} total orders managed</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
              className="premium-btn bg-[var(--card-background)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--primary-cyan)]/50"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              className="premium-btn premium-btn-primary"
              onClick={() => navigate('/manager/orders/create')}
            >
              <LayoutTemplate className="h-4 w-4" />
              Create New Order
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="hover:text-red-300"><X className="h-4 w-4" /></button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-2">
            <Check className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="premium-card p-5 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <input
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                type="text"
                placeholder="Search by order id, client, web..."
                className="premium-input pl-10"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={filters.status}
                onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                className="premium-input w-full pl-10 appearance-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                {Object.keys(STATUS_LABELS).map(key => (
                  <option key={key} value={key}>{STATUS_LABELS[key]}</option>
                ))}
              </select>
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={filters.orderType}
                onChange={(e) => setFilters(f => ({ ...f, orderType: e.target.value }))}
                className="premium-input w-full pl-10 appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="gp">Guest Post</option>
                <option value="niche">Niche Edit</option>
              </select>
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
            </div>

            {(filters.search || filters.status || filters.orderType) && (
              <button
                onClick={() => setFilters({ search: '', status: '', orderType: '' })}
                className="premium-btn px-4 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
              >
                <X className="h-4 w-4 mr-2" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Manager</th>
                <th>Client Name</th>
                <th>Status</th>
                <th>Website</th>
                <th className="text-center">Links</th>
                <th>Order Type</th>
                <th>Ordered At</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-[var(--primary-cyan)]" />
                      <span>Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <p>No orders found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badgeClass = getStatusBadge(order.status_label);

                  return (
                    <tr key={order.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[var(--primary-cyan)]">#{order.order_id || order.id}</span>
                          {order.order_package && (
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-muted)] border border-[var(--border)] tracking-wider">
                              {order.order_package.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {order.manager_name ? (
                          <div className="flex items-center gap-2 text-[var(--text-primary)]">
                            <div className="w-6 h-6 rounded-full bg-[var(--primary-cyan)]/20 flex items-center justify-center text-[var(--primary-cyan)] text-xs">
                              {order.manager_name.charAt(0)}
                            </div>
                            <span className="text-sm">{order.manager_name}</span>
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] text-sm">-</span>
                        )}
                      </td>
                      <td className="font-medium text-[var(--text-primary)]">{order.client_name || '-'}</td>
                      <td>
                        <span className={`premium-badge ${badgeClass} border`}>
                          {order.status_label || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        {order.client_website ? (
                          <a href={order.client_website} className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--primary-cyan)] transition-colors group" target="_blank" rel="noreferrer">
                            <img src={`https://www.google.com/s2/favicons?domain=${order.client_website}&sz=32`} className="w-4 h-4 rounded-sm opacity-80" alt="" />
                            <span className="truncate max-w-[150px]">{order.client_website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span className="premium-metric-pill bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {order.no_of_links || 1}
                        </span>
                      </td>
                      <td>
                        <span className={`premium-badge ${order.order_type === 'gp' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}`}>
                          {order.order_type === 'gp' ? 'Guest Post' : order.order_type === 'niche' ? 'Niche Edit' : order.order_type || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col text-xs text-[var(--text-muted)]">
                          <span>{formatDate(order.created_at).split(',')[0]}</span>
                          <span className="opacity-60">{formatDate(order.created_at).split(',')[1]}</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/manager/orders/${order.id}`)}
                            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary-cyan)] hover:bg-[var(--primary-cyan)]/10 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(order)}
                            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--bright-cyan)] hover:bg-[var(--bright-cyan)]/10 transition-colors"
                            title="Edit Order"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="mt-6 flex justify-end">
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

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--primary-cyan)]" />
                  Order #{selectedOrder.order_id} Details
                </h2>
                <button onClick={() => setShowDetailModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Card Items */}
                {[
                  { label: 'Order ID', value: selectedOrder.order_id, icon: Tag },
                  { label: 'Client Name', value: selectedOrder.client_name, icon: User },
                  { label: 'Order Type', value: selectedOrder.order_type === 'gp' ? 'Guest Post' : selectedOrder.order_type === 'niche' ? 'Niche Edit' : selectedOrder.order_type, icon: LayoutTemplate },
                  { label: 'Status', value: selectedOrder.status_label, icon: Check, isBadge: true },
                  { label: 'No of Links', value: selectedOrder.no_of_links, icon: MoreHorizontal },
                  { label: 'Package', value: selectedOrder.order_package, icon: Tag },
                  { label: 'Manager', value: selectedOrder.manager_name, icon: User },
                  { label: 'Created At', value: formatDate(selectedOrder.created_at), icon: Calendar },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[var(--background-dark)] border border-[var(--border)] p-4 rounded-xl">
                    <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                      {item.icon && <item.icon className="h-3 w-3" />}
                      {item.label}
                    </div>
                    {item.isBadge ? (
                      <span className={`premium-badge ${getStatusBadge(item.value)}`}>
                        {item.value}
                      </span>
                    ) : (
                      <div className="font-medium text-[var(--text-primary)] truncate">{item.value || 'N/A'}</div>
                    )}
                  </div>
                ))}

                {/* Full Width Items */}
                <div className="bg-[var(--background-dark)] border border-[var(--border)] p-4 rounded-xl col-span-1 md:col-span-2">
                  <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Client Website
                  </div>
                  <div className="font-medium">
                    {selectedOrder.client_website ? (
                      <a href={selectedOrder.client_website} className="text-[var(--primary-cyan)] hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
                        {selectedOrder.client_website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : 'N/A'}
                  </div>
                </div>

                {selectedOrder.message && (
                  <div className="bg-[var(--background-dark)] border border-[var(--border)] p-4 rounded-xl col-span-1 md:col-span-2">
                    <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">Message / Notes</div>
                    <div className="text-sm text-[var(--text-primary)] bg-black/20 p-3 rounded-lg border border-[var(--border)]" dangerouslySetInnerHTML={{ __html: selectedOrder.message }} />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[var(--border)] flex gap-3">
                <button
                  onClick={() => { setShowDetailModal(false); openEditModal(selectedOrder); }}
                  className="premium-btn premium-btn-accent flex-1 justify-center"
                >
                  <Edit2 className="h-4 w-4" /> Edit Order
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="premium-btn bg-[var(--background-dark)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text-primary)] flex-1 justify-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Order Modal */}
        {showEditModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-[var(--primary-cyan)]" />
                  Edit Order
                </h2>
                <button onClick={() => setShowEditModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="premium-label">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="premium-input"
                      value={editData.client_name}
                      onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="premium-label">
                      Client Website <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="premium-input"
                      value={editData.client_website}
                      onChange={(e) => setEditData({ ...editData, client_website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="premium-label">
                    Message <span className="text-red-500">*</span>
                  </label>

                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 bg-[var(--background-dark)] border border-[var(--border)] border-b-0 rounded-t-xl">
                    {['B', 'I', 'U'].map((t) => (
                      <button type="button" key={t} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-[var(--text-primary)] font-bold text-xs">{t}</button>
                    ))}
                    <span className="w-px h-4 bg-[var(--border)] mx-1"></span>
                    <button type="button" className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded text-[var(--text-primary)] text-xs">H2</button>
                  </div>
                  <textarea
                    className="premium-input rounded-t-none min-h-[120px]"
                    value={editData.message}
                    onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                    placeholder="Enter message or notes..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[var(--border)] flex gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className="premium-btn premium-btn-primary flex-1 justify-center"
                >
                  {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="premium-btn bg-[var(--background-dark)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text-primary)] flex-1 justify-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ViewOrders;
