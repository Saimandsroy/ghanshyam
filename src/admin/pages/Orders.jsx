import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const mockOrders = Array.from({ length: 25 }).map((_, i) => ({
  id: 1000 + i,
  blogger: ['davidc','Crystal','admin','claymansell','marc','gina'][i % 6],
  client: ['Acme Inc','Globex','Soylent','Initech'][i % 4],
  status: ['pending','in-process','completed','rejected'][i % 4],
  amount: [50,120,75,200][i % 4],
  createdAt: new Date(2025, i % 12, 10 + (i % 10)).toISOString(),
}));

export function Orders() {
  const [filters, setFilters] = useState({ search: '', status: 'all', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    let r = mockOrders;
    const q = filters.search.toLowerCase();
    if (q) r = r.filter(o => `${o.id}`.includes(q) || o.blogger.toLowerCase().includes(q) || o.client.toLowerCase().includes(q));
    if (filters.status !== 'all') r = r.filter(o => o.status === filters.status);
    if (filters.start) r = r.filter(o => new Date(o.createdAt) >= new Date(filters.start));
    if (filters.end) r = r.filter(o => new Date(o.createdAt) <= new Date(filters.end));
    return r;
  }, [filters]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <input value={filters.search} onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} placeholder="Search order id, blogger, client" className="rounded-xl px-3 py-2 col-span-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <select value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-process">In Process</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="date" value={filters.start} onChange={e => { setFilters({ ...filters, start: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input type="date" value={filters.end} onChange={e => { setFilters({ ...filters, end: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
        <div className="mt-3 flex gap-3">
          <button onClick={() => { setFilters({ search: '', status: 'all', start: '', end: '' }); setPage(1); }} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Blogger</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Client</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>#{o.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{o.blogger}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.client}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>{o.status}</span>
                </td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${o.amount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1 rounded-md text-sm mr-2" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>View</button>
                  <button className="px-3 py-1 rounded-md text-sm" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Mark</button>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No orders</td>
              </tr>
            )}
          </tbody>
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
