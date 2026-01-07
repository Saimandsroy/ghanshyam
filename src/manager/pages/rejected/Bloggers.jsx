import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Pagination } from '../../../components/Pagination.jsx';
import { managerAPI } from '../../../lib/api';

export const RejectedBloggers = () => {
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
      const response = await managerAPI.getRejectedOrders(page, pageSize);
      setOrders(response.orders || []);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('Error fetching rejected orders:', err);
      setError(err.message || 'Failed to load rejected orders');
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
      list = list.filter(x => (x.order_id || '').toLowerCase().includes(filters.orderId.toLowerCase()));
    }
    if (filters.user) {
      list = list.filter(x =>
        (x.blogger_name || '').toLowerCase().includes(filters.user.toLowerCase()) ||
        (x.blogger_email || '').toLowerCase().includes(filters.user.toLowerCase())
      );
    }
    return list;
  }, [orders, filters]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Rejected Orders - Bloggers</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">{total} total rejected orders</span>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 flex items-center justify-between">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchOrders} className="btn btn-sm">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-surface border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium text-text-secondary">Filters</div>
          <button className="text-error text-sm" onClick={() => setFilters({ orderId: '', user: '' })}>Reset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Order Id</label>
            <input
              className="input w-full"
              placeholder="Search by order ID..."
              value={filters.orderId}
              onChange={(e) => setFilters(f => ({ ...f, orderId: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">User name/email</label>
            <input
              className="input w-full"
              placeholder="Search by blogger name or email..."
              value={filters.user}
              onChange={(e) => setFilters(f => ({ ...f, user: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-background-dark">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-muted">Order Id</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Order Type</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Blogger</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Root Domain</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Status</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Reject Reason</th>
              <th className="px-4 py-3 text-left text-sm text-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No rejected blogger orders
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{order.order_id || `#${order.id}`}</td>
                  <td className="px-4 py-3">
                    <span className="badge">{order.order_type || 'Guest Post'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.blogger_name || 'N/A'}</div>
                    <div className="text-xs text-text-secondary">{order.blogger_email || ''}</div>
                  </td>
                  <td className="px-4 py-3">
                    {order.website_url ? (
                      <a href={`https://${order.website_url}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        {order.website_url}
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${order.status === 11
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {order.status === 11 ? 'Rejected' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={order.status === 11 ? 'text-red-400' : 'text-yellow-400'}>
                      {order.rejection_reason || 'No reason provided'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(order.updated_at || order.created_at)}
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

export default RejectedBloggers;
