import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const bloggers = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  name: ['Oluwole Ayomide Philip','ObIRPNoScoTXEhHu','direttore','info','jsntgirl','Redaktion','editorial','contactus'][i % 8],
  email: [
    'oluwoleayomide006@gmail.com',
    'izacevuloli83@gmail.com',
    'direttore@targatcn.it',
    'info@estimatorflorida.com',
    'jsntgirl@gmail.com',
    'Redaktion@ifistalexpress.de',
    'editorial@moneymagpie.com',
    'contactus@stylingoutfits.com'
  ][i % 8],
  status: ['Active','Blocked','Active','Active','Active','Active','Active','Active'][i % 8],
  totals: Math.floor(Math.random()*30),
  pendings: Math.floor(Math.random()*10),
  completeds: Math.floor(Math.random()*25),
  wallet: Math.floor(Math.random()*500),
  logins: Math.floor(Math.random()*1200),
}));

export function Bloggers() {
  const [filters, setFilters] = useState({ q: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    const q = filters.q.toLowerCase();
    let r = bloggers;
    if (q) r = r.filter(b => b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q));
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search</label>
          <input value={filters.q} onChange={e => { setFilters({ q: e.target.value }); setPage(1); }} placeholder="Search name or email" className="rounded-xl px-3 py-2 w-full" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Name</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Email</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Account Status</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Total Orders</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Pending Orders</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Completed Orders</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Wallet</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Login Counts</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{b.name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{b.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: b.status === 'Active' ? 'var(--success)' : 'var(--error)' }}>{b.status}</span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{b.totals}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{b.pendings}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{b.completeds}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${b.wallet}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{b.logins}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No bloggers</td>
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
