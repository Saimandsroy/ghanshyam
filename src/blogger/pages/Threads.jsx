import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';

const threads = Array.from({ length: 20 }).map((_, i) => ({
  id: 100 + i,
  subject: ['Payment Query','Order Update','Site Issue','General'][i % 4],
  lastMessage: ['Please confirm payment','Order delivered','404 issue fixed','Thank you'][i % 4],
  updatedAt: new Date(2025, i % 12, 10 + (i % 15)).toISOString(),
}));

export function Threads() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const rows = useMemo(() => {
    let r = threads;
    const q = filters.q.toLowerCase();
    if (q) r = r.filter(t => t.subject.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q));
    if (filters.start) r = r.filter(t => new Date(t.updatedAt) >= new Date(filters.start));
    if (filters.end) r = r.filter(t => new Date(t.updatedAt) <= new Date(filters.end));
    return r;
  }, [filters]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Threads</h2>
      <FilterBar value={filters} onChange={setFilters} fields={{ q: true, status: false, start: true, end: true }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Subject</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Last Message</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{t.subject}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.lastMessage}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No threads</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
