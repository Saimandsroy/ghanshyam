import React, { useMemo, useState } from 'react';
import { Pagination } from '../../../components/Pagination.jsx';

const refs = [
  'https://www.paypal.com/invoice/p/#INV2-WU54-PYS9-MR7K-28Y2',
  'nexbet.dolls@gmail.com',
  'https://tinyurl.com/2be8zvqr',
  'https://www.paypal.com/invoice/p/#U9NHG8Z6AL79U3SZ',
  'https://www.paypal.com/invoice/p/#INV2-YNV8-22MG-W97Z-UEVR',
  'gposting.com/direct-payment?refno=15748268378',
  'usamajavedeo@gmail.com',
];

const data = Array.from({ length: 87 }).map((_, i) => ({
  id: 2635 - i,
  invoice: `LM10${250 + (i % 400)}`,
  method: 'Paypal ID',
  reference: refs[i % refs.length],
  amount: [15, 25, 75, 112, 245, 260, 320, 460][i % 8],
  date: new Date(2025, (i * 3) % 12, (i % 27) + 1, 10, (i * 7) % 60, (i * 11) % 60).toISOString(),
}));

export function InvoiceList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortDir, setSortDir] = useState('asc');

  const rows = useMemo(() => {
    const sorted = [...data].sort((a, b) => sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    return sorted;
  }, [sortDir]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Invoice List</h2>
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Id</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Invoice number</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Payment Method</th>
              <th className="px-4 py-3 text-left text-sm cursor-pointer select-none" style={{ color: 'var(--text-muted)' }} onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>Amount {sortDir === 'asc' ? '▲' : '▼'}</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Datetime</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.invoice}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs mr-2" style={{ backgroundColor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60A5FA' }}>{r.method}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{r.reference}</span>
                </td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>${r.amount}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(r.date).toLocaleString()}</td>
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
