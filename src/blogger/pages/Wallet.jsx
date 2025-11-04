import React, { useMemo, useState } from 'react';
import { FilterBar } from '../../components/FilterBar';

const txs = Array.from({ length: 25 }).map((_, i) => ({
  id: 7000 + i,
  type: ['credit','debit'][i % 2],
  amount: [25,50,75,100][i % 4],
  method: ['PayPal','Stripe','Wire'][i % 3],
  date: new Date(2025, (i*2)%12, 1 + (i%27)).toISOString(),
}));

export function Wallet() {
  const [filters, setFilters] = useState({ q: '', status: 'all', start: '', end: '' });
  const rows = useMemo(() => {
    let r = txs;
    const q = filters.q.toLowerCase();
    if (q) r = r.filter(t => `${t.id}`.includes(q) || t.type.includes(q) || t.method.toLowerCase().includes(q));
    if (filters.start) r = r.filter(t => new Date(t.date) >= new Date(filters.start));
    if (filters.end) r = r.filter(t => new Date(t.date) <= new Date(filters.end));
    return r;
  }, [filters]);
  const balance = rows.reduce((s, t) => s + (t.type==='credit'? t.amount : -t.amount), 0);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Wallet</h2>
      <FilterBar value={filters} onChange={setFilters} fields={{ q: true, status: false, start: true, end: true }} />
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Txn</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Type</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Method</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>#{t.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.type}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.method}</td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{t.type==='credit'? '+' : '-'}${t.amount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Balance</td>
              <td className="px-4 py-3 font-bold" style={{ color: 'var(--text-primary)' }}>${balance}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
