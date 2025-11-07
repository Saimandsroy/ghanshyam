import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const data = Array.from({ length: 64 }).map((_, i) => ({
  id: ['13BCAA2','D7B272C','72A23D3F','2B9322E3','5BD08682','517B6572'][i % 6],
  type: 'niche',
  category: 'General Blog',
  client: ['Ferenc M. - Samples','Ferenc M.'][i % 2],
  website: ['https://linkfi.com','https://www.bengorola.com/','https://novitium.com/','https://iwoski.app/','https://premierparts.co.uk/','https://tivateck.com/'][i % 6],
  links: [1,5,10,30][i % 4],
  pkg: 'Basic Ahrefs Ref-Domain Upto 400',
}));

export function OrderNotifications() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const total = data.length;
  const pageData = useMemo(() => data.slice((page - 1) * pageSize, page * pageSize), [page, pageSize]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order Added Notifications</h2>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Id</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Type</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Category</th>
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
