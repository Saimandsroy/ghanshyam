import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const managers = ['Shivanjali Sethi','Alex Johnson','Sarah Miller'];
const types = ['niche','guest-post'];

const data = Array.from({ length: 120 }).map((_, i) => ({
  id: ['13207279','A67C00F7','A55C94AC','64C20Z2F','C191ICAD','02AD5274','DD6356965'][i % 7],
  type: 'niche',
  category: 'General Blog',
  manager: managers[i % managers.length],
  client: ['Ferenc M.','Ferenc M. - Samples','David Donohue'][i % 3],
  website: ['https://etherealgolddispensary.com','https://thesocialmediagrowth.com/','https://bhseclaw.com','https://www.smashbrand.com/','https://isleblue.co/','https://www.greenarcsremovers.com.au'][i % 6],
  links: [1,3,5,10][i % 4],
  pkg: 'Basic Ahrefs Ref-Domain Upto 400',
  pushedAt: new Date(2025, (i*2)%12, (i%28)+1).toISOString()
}));

export function CompletedOrders() {
  const [filters, setFilters] = useState({ date: '', orderId: '', orderType: '', manager: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = data;
    if (filters.date) r = r.filter(x => new Date(x.pushedAt).toDateString() === new Date(filters.date).toDateString());
    if (filters.orderId) r = r.filter(x => x.id.toLowerCase().includes(filters.orderId.toLowerCase()));
    if (filters.orderType) r = r.filter(x => x.type === filters.orderType);
    if (filters.manager) r = r.filter(x => x.manager === filters.manager);
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Completed Orders</h2>

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
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Order id</label>
            <input value={filters.orderId} onChange={(e)=>{ setFilters({ ...filters, orderId: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Order type</label>
            <select value={filters.orderType} onChange={(e)=>{ setFilters({ ...filters, orderType: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Manager</label>
            <select value={filters.manager} onChange={(e)=>{ setFilters({ ...filters, manager: e.target.value }); setPage(1); }} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              {managers.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Type</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Category</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Manager</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Client Name</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Client Website</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>No of Links</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Package</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.type}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(107,240,255,0.12)', border: '1px solid rgba(107,240,255,0.25)', color: '#6BF0FF' }}>{r.category}</span></td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.manager}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.client}</td>
                <td className="px-4 py-3"><a href={r.website} className="text-[var(--primary-cyan)]" target="_blank" rel="noreferrer">{r.website}</a></td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.links}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.pkg}</td>
              </tr>
            ))}
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
