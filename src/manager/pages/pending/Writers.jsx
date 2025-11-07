import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DataTable } from '../../components/tables/DataTable';
import { Search } from 'lucide-react';

const seed = [
  { id: 'A670CCF7', writerName: 'Ashima Gandhi', writerEmail: 'agandhi.1.579@gmail.com', clientName: 'Ferenc M. - Samples', website: 'https://thesocialmediagrowth.com/', links: 5, orderType: 'niche' },
  { id: '13207279', writerName: 'Ashima Gandhi', writerEmail: 'agandhi.1.579@gmail.com', clientName: 'Ferenc M.', website: 'https://etherealgolddispensary.com', links: 3, orderType: 'niche' },
];

export const PendingWriters = () => {
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = seed;
    if (query) {
      list = list.filter(r => r.id.toLowerCase().includes(query) || r.writerName.toLowerCase().includes(query) || r.writerEmail.toLowerCase().includes(query) || r.clientName.toLowerCase().includes(query));
    }
    return list;
  }, [q]);

  const columns = ['Order Id','Writer','Client Name','Client Website','No of Links','Order Type'];
  const data = rows.map(r => ({
    orderId: r.id,
    writer: (
      <div>
        <div className="font-medium">{r.writerName}</div>
        <div className="text-xs text-text-secondary">{r.writerEmail}</div>
      </div>
    ),
    clientName: r.clientName,
    website: <a className="text-accent underline" href={r.website} rel="noreferrer" target="_blank">{r.website}</a>,
    links: r.links,
    orderType: <span className="badge">{r.orderType}</span>,
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pending Approval For Writers</h1>
      <div className="card">
        <div className="flex items-center justify-end p-3 border-b border-border">
          <div className="relative w-full max-w-xs">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search" className="input w-full pl-9" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>
        <DataTable columns={columns} data={data} emptyStateMessage="No writer approvals pending" />
      </div>
    </Layout>
  );
};
