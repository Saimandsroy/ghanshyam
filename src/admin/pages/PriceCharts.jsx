import React, { useMemo, useState } from 'react';

const initialRows = [
  { rd: '0-100', traffic: '0-500', dr: '10-20', da: '10-20', niche: '5-10', gp: '5-10' },
  { rd: '100-200', traffic: '500-1000', dr: '20-30', da: '20-30', niche: '5-12', gp: '10-20' },
  { rd: '200-400', traffic: '1000-2000', dr: '30-40', da: '30-40', niche: '5-15', gp: '10-25' },
  { rd: '400-1000', traffic: '2000-5000', dr: '40-50', da: '40-50', niche: '10-20', gp: '10-30' },
  { rd: '1000-100000', traffic: '5000-500000', dr: '50-50000', da: '50-50000', niche: '10-30', gp: '15-40' },
  { rd: '3-9', traffic: '9-12', dr: '12-18', da: '18-21', niche: '21-27', gp: '27-30' },
];

export function PriceCharts() {
  const [rows, setRows] = useState(initialRows);
  const [filters, setFilters] = useState({ q: '' });
  const [form, setForm] = useState({ rd: '', traffic: '', dr: '', da: '', niche: '', gp: '' });

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
  }, [rows, filters]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.rd || !form.traffic) return;
    setRows(prev => [...prev, form]);
    setForm({ rd: '', traffic: '', dr: '', da: '', niche: '', gp: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search</label>
          <input value={filters.q} onChange={e => setFilters({ q: e.target.value })} placeholder="Filter rows" className="rounded-xl px-3 py-2 w-full" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>RD</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Traffic</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DR</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DA</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Niche Price</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>GP Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.rd}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.traffic}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.dr}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.da}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.niche}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.gp}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Add Row</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {['rd','traffic','dr','da','niche','gp'].map(k => (
            <input key={k} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={k.toUpperCase()} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          ))}
          <button type="submit" className="px-4 py-2 rounded-md" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>Add</button>
        </form>
      </div>
    </div>
  );
}
