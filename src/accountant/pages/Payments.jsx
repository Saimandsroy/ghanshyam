import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCw, DollarSign } from 'lucide-react';
import { FilterBar } from '../../components/FilterBar';
import { Pagination } from '../../components/Pagination.jsx';
import { accountantAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function Payments() {
  const { showSuccess, showError } = useToast();
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await accountantAPI.getPayments(filters);
      setPayments(data.payments || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]); // Re-fetch when filters change

  const handleMarkAsPaid = async (id) => {
    try {
      setProcessing(id);
      await accountantAPI.markAsPaid(id);
      showSuccess('Payment marked as paid!');
      // Refresh list after update
      fetchPayments();
    } catch (err) {
      console.error('Error processing payment:', err);
      showError('Failed to process payment: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  // Client-side pagination for now since API returns all
  const rows = useMemo(() => {
    let r = payments;
    // Filter by search query if needed (API might handle some, but client-side search is good for small lists)
    const q = filters.q.toLowerCase();
    if (q) {
      r = r.filter(p =>
        (p.user_name && p.user_name.toLowerCase().includes(q)) ||
        (p.user_email && p.user_email.toLowerCase().includes(q))
      );
    }

    // Date filtering is already done by API if we pass it, but let's keep client side for safety/flexibility
    if (filters.start) r = r.filter(p => new Date(p.request_date) >= new Date(filters.start));
    if (filters.end) r = r.filter(p => new Date(p.request_date) <= new Date(filters.end));

    return r;
  }, [payments, filters]);

  const total = rows.reduce((s, p) => s + parseFloat(p.amount), 0);
  const count = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  if (loading && payments.length === 0) return <div className="p-4">Loading payments...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Payments</h2>
      <FilterBar value={filters} onChange={(v) => { setFilters(v); setPage(1); }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Blogger</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Email</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Date</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{p.user_name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.user_email}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${parseFloat(p.amount).toFixed(2)}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                  <span className={`px-2 py-1 rounded text-xs ${p.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(p.request_date).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {p.status !== 'Paid' && p.status !== 'Rejected' ? (
                    <button
                      onClick={() => handleMarkAsPaid(p.id)}
                      className="px-3 py-1 rounded-md text-sm"
                      style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}
                    >
                      Mark as Paid
                    </button>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--success)' }}>
                      {p.status === 'Paid' ? 'Paid' : '-'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No records</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Total</td>
              <td className="px-4 py-3 font-bold" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={count}
        pageSizeOptions={[20, 50]}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
