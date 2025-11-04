import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';

const orders = Array.from({ length: 30 }).map((_, i) => ({
  id: 8000 + i,
  client: ['Acme Inc','Globex','Initech','Umbrella'][i % 4],
  status: ['pending','in-process','completed','rejected'][i % 4],
  date: new Date(2025, (i*2)%12, 1 + (i%27)).toISOString(),
  amount: [60, 80, 120, 200][i % 4]
}));

export function Orders() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const rows = useMemo(() => {
    let r = orders;
    const q = filters.q.toLowerCase();
    if (q) r = r.filter(o => `${o.id}`.includes(q) || o.client.toLowerCase().includes(q));
    if (filters.status !== 'all') r = r.filter(o => o.status === filters.status);
    if (filters.start) r = r.filter(o => new Date(o.date) >= new Date(filters.start));
    if (filters.end) r = r.filter(o => new Date(o.date) <= new Date(filters.end));
    return r;
  }, [filters]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Today Orders</h2>
      <FilterBar value={filters} onChange={setFilters} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Client</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>#{o.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.client}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.status}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${o.amount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(o.date).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
