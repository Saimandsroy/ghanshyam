import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';
import { Pagination } from '../../components/Pagination.jsx';

const rows = Array.from({ length: 20 }).map((_, i) => ({
  blogger: ['you','me','alex','maria','sam','kate'][i % 6],
  root: ['sitea.com','siteb.com','sitec.net','sited.org'][i % 4],
  price: [10,20,30,40][i % 4],
  count: [2,4,6,8][i % 4],
}));

export function Reports() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return rows.filter(r => r.blogger.includes(q) || r.root.includes(q));
  }, [filters]);
  const totalAmount = filtered.reduce((s, r) => s + r.price * r.count, 0);
  const total = filtered.length;
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Blogger Report</h2>
      <FilterBar value={filters} onChange={(v) => { setFilters(v); setPage(1); }} fields={{ q: true, status: false, start: true, end: true }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Blogger</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Root</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Price</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Count</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.blogger}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.root}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.price}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.count}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{r.price * r.count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Total</td>
              <td className="px-4 py-3 font-bold" style={{ color: 'var(--text-primary)' }}>{totalAmount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={[20, 50]}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
