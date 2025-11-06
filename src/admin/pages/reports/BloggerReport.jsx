import React, { useMemo, useState } from 'react';
import { Pagination } from '../../../components/Pagination.jsx';

const bloggers = [
  { name: 'urdufeedpk', email: 'urdufeedpk@gmail.com' },
  { name: 'davidc', email: 'davidc@ccr-mag.com' },
  { name: 'Crystal Martin', email: 'crystalmartin@thecinnamonhollow.com' },
  { name: 'admin', email: 'admin@rabbitfirm.com' },
  { name: 'gina', email: 'gina@stylecurator.com.au' },
  { name: 'Elevated Magazines', email: 'elevated@elevatedmagazines.com' },
  { name: 'aweawais3', email: 'aweawais3@gmail.com' },
];

const rootDomains = [
  'alightmotiondpro.com',
  'ccr-mag.com',
  'thecinnamonhollow.com',
  'flixpress.com',
  'stylecurator.com.au',
  'elevatedmagazines.com',
  'charmfulnames.com',
];

const rowsData = Array.from({ length: 120 }).map((_, i) => {
  const blogger = bloggers[i % bloggers.length];
  const domain = rootDomains[i % rootDomains.length];
  const price = [10, 13, 15, 20, 25, 40, 85][i % 7];
  const count = [2, 5, 7, 9, 11, 17, 27, 28][i % 8];
  return {
    id: i + 1,
    bloggerName: blogger.name,
    bloggerEmail: blogger.email,
    rootDomain: domain,
    price,
    count,
    amount: price * count,
    date: new Date(Date.now() - (i % 28) * 24 * 60 * 60 * 1000),
  };
});

export function BloggerReport() {
  const [filters, setFilters] = useState({ blogger: '', root: '', start: '', end: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    let r = rowsData;
    if (filters.blogger) {
      const q = filters.blogger.toLowerCase();
      r = r.filter(x => x.bloggerName.toLowerCase().includes(q) || x.bloggerEmail.toLowerCase().includes(q));
    }
    if (filters.root) {
      const q = filters.root.toLowerCase();
      r = r.filter(x => x.rootDomain.toLowerCase().includes(q));
    }
    if (filters.start) {
      const s = new Date(filters.start).getTime();
      r = r.filter(x => x.date.getTime() >= s);
    }
    if (filters.end) {
      const e = new Date(filters.end).getTime();
      r = r.filter(x => x.date.getTime() <= e);
    }
    return r;
  }, [filters]);

  const total = filtered.length;
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <input
            placeholder="Blogger"
            value={filters.blogger}
            onChange={(e) => { setFilters({ ...filters, blogger: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            placeholder="Root domain"
            value={filters.root}
            onChange={(e) => { setFilters({ ...filters, root: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="date"
            value={filters.start}
            onChange={(e) => { setFilters({ ...filters, start: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            type="date"
            value={filters.end}
            onChange={(e) => { setFilters({ ...filters, end: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setFilters({ blogger: '', root: '', start: '', end: '' }); setPage(1); }}
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Reset
            </button>
          </div>
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
            {pageData.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>
                  <div className="font-medium">{row.bloggerName}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{row.bloggerEmail}</div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.rootDomain}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.price}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.count}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{row.amount}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No results</td>
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
