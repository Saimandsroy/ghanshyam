import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const data = Array.from({ length: 36 }).map((_, i) => ({
  id: 343559600 + i,
  type: 'niche',
  links: [1,2,3][i % 3],
  sitesSent: 'exploratoryglory.com\nNote:- Url: https://www.hastingsbathcollection.com/products/vanities Anchor: high-end bathroom vanities\nPost Url:- https://www.exploratoryglory.com/home-improvement/revitalising-the-perfect-vanity-for-your-bathroom-makeover',
  reason: ['Please delete this no need','Duplicate','Invalid URL'][i % 3],
  clientWebsite: 'https://www.hastingsbathcollection.com',
}));

export function RejectedLinks() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const total = data.length;
  const pageData = useMemo(() => data.slice((page - 1) * pageSize, page * pageSize), [page, pageSize]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Rejected Links</h2>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Id</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Order Type</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>No of Links</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Sites Sent</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Reason/Note</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Client Website</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.type}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.links}</td>
                <td className="px-4 py-3 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{r.sitesSent}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.reason}</td>
                <td className="px-4 py-3"><a href={r.clientWebsite} className="text-[var(--primary-cyan)]" target="_blank" rel="noreferrer">{r.clientWebsite}</a></td>
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
