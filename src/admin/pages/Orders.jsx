import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw, Package, Eye, CheckCircle } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { managerAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

// Status mapping for display
const STATUS_MAP = {
  'DRAFT': { label: 'Draft', color: 'var(--text-muted)' },
  'PENDING_MANAGER_APPROVAL_1': { label: 'Pending Review', color: 'var(--warning)' },
  'ASSIGNED_TO_WRITER': { label: 'With Writer', color: 'var(--primary-cyan)' },
  'WRITING_IN_PROGRESS': { label: 'Writing', color: 'var(--primary-cyan)' },
  'PENDING_MANAGER_APPROVAL_2': { label: 'Content Review', color: 'var(--warning)' },
  'ASSIGNED_TO_BLOGGER': { label: 'With Blogger', color: 'var(--medium-purple)' },
  'PUBLISHED_PENDING_VERIFICATION': { label: 'Pending Verification', color: 'var(--warning)' },
  'COMPLETED': { label: 'Completed', color: 'var(--success)' },
  'CREDITED': { label: 'Credited', color: 'var(--success)' },
  'REJECTED': { label: 'Rejected', color: 'var(--error)' }
};

export function Orders() {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerAPI.getTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks
  const filtered = useMemo(() => {
    let r = tasks;
    const q = filters.search.toLowerCase();

    if (q) {
      r = r.filter(o =>
        `${o.id}`.includes(q) ||
        (o.website_domain || '').toLowerCase().includes(q) ||
        (o.assigned_blogger_name || '').toLowerCase().includes(q)
      );
    }

    if (filters.status !== 'all') {
      r = r.filter(o => o.current_status === filters.status);
    }

    if (filters.start) {
      r = r.filter(o => new Date(o.created_at) >= new Date(filters.start));
    }

    if (filters.end) {
      r = r.filter(o => new Date(o.created_at) <= new Date(filters.end));
    }

    return r;
  }, [tasks, filters]);

  const total = filtered.length;
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getStatusDisplay = (status) => {
    const config = STATUS_MAP[status] || { label: status, color: 'var(--text-muted)' };
    return config;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Package className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          All Orders
        </h2>
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400">{error}</p>
          <button onClick={fetchTasks} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={filters.search}
            onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
            placeholder="Search ID, domain, blogger..."
            className="rounded-xl px-3 py-2 col-span-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <select
            value={filters.status}
            onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Status</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.start}
            onChange={e => { setFilters({ ...filters, start: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="date"
            value={filters.end}
            onChange={e => { setFilters({ ...filters, end: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="mt-3 flex gap-3 items-center">
          <button onClick={() => { setFilters({ search: '', status: 'all', start: '', end: '' }); setPage(1); }} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} order(s)</span>
        </div>
      </div>

      {/* Loading State */}
      {loading && tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading orders...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Task ID</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Website</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Blogger</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Created</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(o => {
                const statusConfig = getStatusDisplay(o.current_status);
                return (
                  <tr key={o.id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>TASK-{o.id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{o.website_domain || 'N/A'}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.assigned_blogger_name || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: statusConfig.color }}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${o.payment_to_blogger || 0}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1 rounded-md text-sm flex items-center gap-1" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          pageSizeOptions={[20, 50]}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      )}
    </div>
  );
}
