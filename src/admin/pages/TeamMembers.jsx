import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const roles = ['team','manager','writer'];
const members = Array.from({ length: 96 }).map((_, i) => ({
  id: i + 1,
  name: ['Kushal Gaikwad','Chaitali Patil','Dhruv Mahajan','Shivanjali Sethi','John Shah','Harpreet Aulakh','Harshita Jain'][i % 7],
  email: [
    'gaikwadkushal0207@gmail.com',
    'softcrowdtest025@gmail.com',
    'dhruvrankmeup@gmail.com',
    'shivanjalisethi@rankmeup.in',
    'johnshah281@gmail.com',
    'harpreeta802@gmail.com',
    'harshitajain27795@gmail.com'
  ][i % 7],
  role: roles[i % roles.length],
  logins: Math.floor(Math.random()*1200),
  status: ['Active','Blocked','Active','Active','Active','Active','Blocked'][i % 7],
}));

export function TeamMembers() {
  const [filters, setFilters] = useState({ role: 'all', name: '', email: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = members;
    if (filters.role !== 'all') r = r.filter(m => m.role === filters.role);
    if (filters.name) r = r.filter(m => m.name.toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email) r = r.filter(m => m.email.toLowerCase().includes(filters.email.toLowerCase()));
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <select value={filters.role} onChange={e => { setFilters({ ...filters, role: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="all">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input value={filters.name} onChange={e => { setFilters({ ...filters, name: e.target.value }); setPage(1); }} placeholder="Name" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input value={filters.email} onChange={e => { setFilters({ ...filters, email: e.target.value }); setPage(1); }} placeholder="Email" className="rounded-xl px-3 py-2 lg:col-span-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <div className="flex gap-3">
            <button onClick={() => { setFilters({ role: 'all', name: '', email: '' }); setPage(1); }} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Name</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Email</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Role</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Login Counts</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{m.name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{m.email}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{m.role}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{m.logins}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: m.status === 'Active' ? 'var(--success)' : 'var(--error)' }}>{m.status}</span>
                </td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No members</td>
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
