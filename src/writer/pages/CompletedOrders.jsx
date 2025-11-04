import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';

const orders = Array.from({ length: 40 }).map((_, i) => ({
  id: 5000 + i,
  manager: ['Shivanjali Sethi', 'Arjun', 'Maya'][i % 3],
  type: ['gp', 'li'][i % 2],
  pushedAt: new Date(2024, (i * 3) % 12, 5 + (i % 20)).toISOString(),
}));

export function CompletedOrders() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });

  const rows = useMemo(() => {
    let r = orders;
    const q = filters.q.toLowerCase();
    if (q) r = r.filter(o => `${o.id}`.includes(q) || o.manager.toLowerCase().includes(q) || o.type.toLowerCase().includes(q));
    if (filters.start) r = r.filter(o => new Date(o.pushedAt) >= new Date(filters.start));
    if (filters.end) r = r.filter(o => new Date(o.pushedAt) <= new Date(filters.end));
    return r;
  }, [filters]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Completed Orders</h2>
      <FilterBar value={filters} onChange={setFilters} fields={{ q: true, status: false, start: true, end: true }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order ID</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Manager</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Order Type</th>
              <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Pushed Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>R{o.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.manager}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{o.type}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(o.pushedAt).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
