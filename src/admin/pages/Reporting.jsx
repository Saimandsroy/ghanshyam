import React, { useMemo, useState } from 'react';

const mockRows = [
  { blogger: 'davidc', email: 'davidc@ecr-mag.com', rootDomain: 'ecr-mag.com', price: 10, count: 28 },
  { blogger: 'Crystal Martin', email: 'crystalmartin@thecinnamonhollow.com', rootDomain: 'thecinnamonhollow.com', price: 20, count: 11 },
  { blogger: 'admin', email: 'admin@rabbithlrm.com', rootDomain: 'flixpress.com', price: 20, count: 10 },
  { blogger: 'claymansell', email: 'claymansell@theclintoncourier.net', rootDomain: 'theclintoncourier.net', price: 30, count: 6 },
  { blogger: 'marc', email: 'marc@programminginsider.com', rootDomain: 'programminginsider.com', price: 20, count: 9 },
  { blogger: 'gina', email: 'gina@stylecurator.com.au', rootDomain: 'stylecurator.com.au', price: 85, count: 2 },
];

export function Reporting() {
  const [active, setActive] = useState('blogger');
  const [filters, setFilters] = useState({ blogger: '', root: '', start: '', end: '' });

  const filtered = useMemo(() => {
    const s = filters;
    return mockRows.filter(r => {
      const b = (r.blogger + ' ' + r.email).toLowerCase().includes(s.blogger.toLowerCase());
      const rd = r.rootDomain.toLowerCase().includes(s.root.toLowerCase());
      // For demo, dates are not in data; simulate by allowing any
      return b && rd;
    });
  }, [filters]);

  const totalAmount = filtered.reduce((sum, r) => sum + r.price * r.count, 0);

  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="p-4" style={{ color: 'var(--text-secondary)' }}>Reporting</div>
        <nav className="px-2 pb-4 space-y-1">
          {[
            { key: 'blogger', label: 'Blogger Report' },
            { key: 'client', label: 'Client Report' },
            { key: 'client-ui', label: 'Client UI Reporting Page' },
            { key: 'price', label: 'Price Reporting Page' },
            { key: 'site', label: 'Site Reporting Page' },
            { key: 'vendor', label: 'Vendor Reporting Page' },
          ].map(i => (
            <button key={i.key} onClick={() => setActive(i.key)} className={`w-full text-left px-3 py-2 rounded-md ${active === i.key ? 'bg-[rgba(107,240,255,0.1)]' : ''}`} style={{ color: active === i.key ? 'white' : 'var(--text-secondary)' }}>
              {i.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="col-span-12 md:col-span-9 space-y-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{active === 'blogger' ? 'Blogger Report Page' : 'Client Report Page'}</h2>

        <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
          <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <input value={filters.blogger} onChange={e => setFilters({ ...filters, blogger: e.target.value })} placeholder="Blogger" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={filters.root} onChange={e => setFilters({ ...filters, root: e.target.value })} placeholder="Root domain" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={filters.start} onChange={e => setFilters({ ...filters, start: e.target.value })} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input type="date" value={filters.end} onChange={e => setFilters({ ...filters, end: e.target.value })} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="mt-3">
            <button onClick={() => setFilters({ blogger: '', root: '', start: '', end: '' })} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Blogger</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Root domain</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Price</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Count</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.blogger}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.email}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.rootDomain}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.price}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.count}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text-primary)' }}>{r.price * r.count}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No data</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-4 py-3" colSpan={4} style={{ color: 'var(--text-secondary)' }}>Total</td>
                <td className="px-4 py-3 font-bold" style={{ color: 'var(--text-primary)' }}>{totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
