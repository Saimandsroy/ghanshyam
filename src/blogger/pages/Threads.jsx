import React, { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';
import { getThreads } from '../../lib/threadsStore.js';

export function Threads() {
  const [rows, setRows] = useState(() => getThreads());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const onStorage = () => setRows(getThreads());
    window.addEventListener('storage', onStorage);
    // also refresh on mount
    setRows(getThreads());
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const total = rows.length;
  const pageData = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);

  return (
    <div className="space-y-4">
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Threads {'>'} List</div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Threads</h2>
        <button className="px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors">New thread</button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Thread Created by</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Subject</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Last Updated at</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{t.creator}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Messages:- {t.messages}</div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.subject}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(t.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No threads</td>
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
