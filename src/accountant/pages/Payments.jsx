import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';
import { Pagination } from '../../components/Pagination.jsx';

const payments = Array.from({ length: 30 }).map((_, i) => ({
  id: 9000 + i,
  blogger: ['davidc','crystal','admin','claymansell','marc','gina'][i % 6],
  email: ['davidc@ecr-mag.com','crystal@cinnamon.com','admin@abc.com','clay@courier.net','marc@insider.com','gina@stylecurator.com'][i % 6],
  method: ['PayPal','Stripe','Wire'][i % 3],
  amount: [50,120,75,200,85][i % 5],
  status: ['pending','processing','paid'][i % 3],
  date: new Date(2025, (i * 2) % 12, 3 + (i % 20)).toISOString(),
}));

export function Payments() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = payments;
    const q = filters.q.toLowerCase();
    if (q) r = r.filter(p => p.blogger.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.method.toLowerCase().includes(q));
    if (filters.status !== 'all') r = r.filter(p => p.status === filters.status);
    if (filters.start) r = r.filter(p => new Date(p.date) >= new Date(filters.start));
    if (filters.end) r = r.filter(p => new Date(p.date) <= new Date(filters.end));
    return r;
  }, [filters]);

  const total = rows.reduce((s, p) => s + p.amount, 0);
  const count = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

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
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Method</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Date</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{p.blogger}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.email}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.method}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${p.amount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{p.status}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(p.date).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {p.status !== 'paid' ? (
                    <button className="px-3 py-1 rounded-md text-sm" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>Mark as Paid</button>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--success)' }}>Paid</span>
                  )}
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No records</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Total</td>
              <td className="px-4 py-3 font-bold" style={{ color: 'var(--text-primary)' }}>${total}</td>
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
