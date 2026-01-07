import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, FileText } from 'lucide-react';
import { bloggerAPI } from '../../../lib/api';

export function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [sortDir, setSortDir] = useState('desc');

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bloggerAPI.getInvoices({ page, limit: pageSize });
      setInvoices(response.invoices || []);
      setPagination(response.pagination || { total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Sort invoices by amount
  const sortedInvoices = [...invoices].sort((a, b) =>
    sortDir === 'asc' ? (a.amount || 0) - (b.amount || 0) : (b.amount || 0) - (a.amount || 0)
  );

  // Calculate showing range
  const showingFrom = pagination.total > 0 ? (page - 1) * pageSize + 1 : 0;
  const showingTo = Math.min(page * pageSize, pagination.total);

  // Format status
  const getStatusBadge = (status) => {
    if (status === 1 || status === '1') {
      return { text: 'Completed', color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.1)' };
    }
    if (status === 0 || status === '0') {
      return { text: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    }
    return { text: 'Processing', color: 'var(--text-muted)', bg: 'var(--background-dark)' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FileText className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Invoice List
        </h2>
        <button
          onClick={fetchInvoices}
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
          <button onClick={fetchInvoices} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Showing X to Y of Z */}
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {showingFrom} to {showingTo} of {pagination.total} results
      </div>

      {/* Loading State */}
      {loading && invoices.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading invoices...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Id</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Invoice Number</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Type</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Payment Method</th>
                <th
                  className="px-4 py-3 text-left text-sm cursor-pointer select-none"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                >
                  Amount {sortDir === 'asc' ? '▲' : '▼'}
                </th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Datetime</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.map((inv) => {
                const status = getStatusBadge(inv.status);
                return (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{inv.id}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{inv.invoice_number}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs capitalize"
                        style={{
                          backgroundColor: inv.type === 'credit' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: inv.type === 'credit' ? 'var(--success)' : 'var(--error)'
                        }}
                      >
                        {inv.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs mr-2" style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>
                        {inv.payment_method || 'N/A'}
                      </span>
                      {inv.paypal_email && <span style={{ color: 'var(--text-secondary)' }}>{inv.paypal_email}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      ${inv.amount || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                      {inv.created_at ? new Date(inv.created_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
              {sortedInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-2 rounded-lg text-sm disabled:opacity-50"
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
