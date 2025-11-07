import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const statuses = ['all','pending','waiting','rejected','completed'];
const orders = Array.from({ length: 140 }).map((_, i) => ({
  id: 965894000 + i,
  root: ['indiehackers.com','tftimes.com','fourmagazine.co.uk','greensourcedfw.org'][i % 4],
  status: ['completed','pending','waiting','rejected'][i % 4],
  date: new Date(2025, (i*2)%12, (i%28)+1, 16, (i*3)%60, (i*7)%60).toISOString(),
}));

export function Orders() {
  const [status, setStatus] = useState('all');
  const [filters, setFilters] = useState({ date: '', orderId: '', root: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = orders;
    if (status !== 'all') r = r.filter(o => o.status === status);
    if (filters.date) r = r.filter(o => new Date(o.date).toDateString() === new Date(filters.date).toDateString());
    if (filters.orderId) r = r.filter(o => `${o.id}`.includes(filters.orderId));
    if (filters.root) r = r.filter(o => o.root.toLowerCase().includes(filters.root.toLowerCase()));
    return r;
  }, [status, filters]);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    ['pending','waiting','rejected','completed'].forEach(s => { c[s] = orders.filter(o => o.status === s).length; });
    return c;
  }, []);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Orders {'>'} List</div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders</h2>

      {/* Status pills */}
      <div className="inline-flex gap-2 rounded-xl p-2" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        {['all','pending','waiting','rejected','completed'].map((s) => {
          const active = status === s;
          return (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm ${active ? 'text-white' : ''}`}
              style={active ? { backgroundColor: '#f59e0b' } : { color: 'var(--text-secondary)' }}
            >
              {s.charAt(0).toUpperCase()+s.slice(1)} <span className="ml-1 opacity-80">{counts[s]}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          <button className="text-sm" style={{ color: 'var(--error)' }} onClick={() => { setFilters({ date: '', orderId: '', root: '' }); setStatus('all'); setPage(1); }}>Reset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search By Date</label>
            <input type="date" value={filters.date} onChange={(e)=>{ setFilters({ ...filters, date: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Order Id</label>
            <input value={filters.orderId} onChange={(e)=>{ setFilters({ ...filters, orderId: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search by Root Domain</label>
            <input value={filters.root} onChange={(e)=>{ setFilters({ ...filters, root: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order Id</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Root Domain</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Date/Time</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>DK{o.id}</span>
              </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.root}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(o.date).toISOString().slice(0,19).replace('T',' ')}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: o.status === 'completed' ? 'var(--success)' : o.status === 'rejected' ? 'var(--error)' : '#F59E0B' }}>
                    {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No orders</td>
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
