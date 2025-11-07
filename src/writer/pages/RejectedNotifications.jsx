import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

// Start empty to match the screenshot's empty-state
const data = [];

export function RejectedNotifications() {
  const [filters, setFilters] = useState({ date: '', orderId: '', orderType: '', manager: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = data;
    if (filters.date) r = r.filter(x => new Date(x.pushedAt).toDateString() === new Date(filters.date).toDateString());
    if (filters.orderId) r = r.filter(x => `${x.id}`.toLowerCase().includes(filters.orderId.toLowerCase()));
    if (filters.orderType) r = r.filter(x => x.type === filters.orderType);
    if (filters.manager) r = r.filter(x => x.manager === filters.manager);
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rejected Notifications {'>'} List</div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Rejected Notifications</h2>

      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          <button className="text-sm" style={{ color: 'var(--error)' }} onClick={() => { setFilters({ date: '', orderId: '', orderType: '', manager: '' }); setPage(1); }}>Reset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Pushed Date</label>
            <input type="date" value={filters.date} onChange={(e)=>{ setFilters({ ...filters, date: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Order Id</label>
            <input value={filters.orderId} onChange={(e)=>{ setFilters({ ...filters, orderId: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Order Type</label>
            <select value={filters.orderType} onChange={(e)=>{ setFilters({ ...filters, orderType: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              <option>gp</option>
              <option>li</option>
              <option>niche</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Manager</label>
            <select value={filters.manager} onChange={(e)=>{ setFilters({ ...filters, manager: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              <option>Shivanjali Sethi</option>
              <option>Arjun</option>
              <option>Maya</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl flex items-center justify-center py-16" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>No Rejected Notifications</div>
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
