import React, { useMemo, useState } from 'react';
import { reportRows } from './data.js';
import { Pagination } from '../../../components/Pagination.jsx';

export function ClientUrlReport() {
  const [filters, setFilters] = useState({ orderId: '', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const groups = useMemo(() => {
    let r = reportRows;
    if (filters.orderId) {
      const q = filters.orderId.toLowerCase();
      r = r.filter(x => x.orderId.toLowerCase().includes(q));
    }
    if (filters.start) r = r.filter(x => new Date(x.date) >= new Date(filters.start));
    if (filters.end) r = r.filter(x => new Date(x.date) <= new Date(filters.end));

    const map = new Map();
    for (const row of r) {
      const key = row.client;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
    return Array.from(map.entries()).map(([client, rows]) => ({ client, rows, total: rows.reduce((s, x) => s + x.price, 0) }));
  }, [filters]);

  const totalGroups = groups.length;
  const pageGroups = useMemo(() => groups.slice((page - 1) * pageSize, page * pageSize), [groups, page, pageSize]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input value={filters.orderId} onChange={e => { setFilters({ ...filters, orderId: e.target.value }); setPage(1); }} placeholder="Order Id" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input type="date" value={filters.start} onChange={e => { setFilters({ ...filters, start: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input type="date" value={filters.end} onChange={e => { setFilters({ ...filters, end: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
        <div className="mt-3">
          <button onClick={() => { setFilters({ orderId: '', start: '', end: '' }); setPage(1); }} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order id</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Root domain</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {pageGroups.map((g, gi) => (
              <React.Fragment key={gi}>
                <tr>
                  <td colSpan={3} className="px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Client website: {g.client}</td>
                </tr>
                {g.rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.orderId}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.rootDomain}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.price}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{g.client} summary</td>
                  <td className="px-4 py-3 text-right" style={{ color: 'var(--text-secondary)' }}>Total Amount</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{g.total}</td>
                </tr>
              </React.Fragment>
            ))}
            {pageGroups.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={totalGroups}
        pageSizeOptions={[20, 50]}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
