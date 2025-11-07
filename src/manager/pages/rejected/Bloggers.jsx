import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DataTable } from '../../components/tables/DataTable';

const seed = [
  { id: 'CA795710 - 2', orderType: 'niche', blogger: 'Every Movie Has a Lesson\nadmin@everymoviehasalesson.com', root: 'everymoviehasalesson.com', status: 'rejected', reason: 'wrong order' },
  { id: '33792F12', orderType: 'niche', blogger: 'editors\ned@nerdbot.com', root: 'nerdbot.com', status: 'rejected', reason: "This article cannot receive link inserts. It's too new" },
  { id: '02AD5274', orderType: 'niche', blogger: 'jovialpedro\njovialpedro@gmail.com', root: 'earntuffer.com', status: 'rejected', reason: 'blogger not able to complete order' },
  { id: '5C22788A', orderType: 'niche', blogger: 'Timebiz.co.uk\nTimebiz.co.uk@gmail.com', root: 'worthview.com', status: 'rejected', reason: 'blogger not response' },
];

export const RejectedBloggers = () => {
  const [filters, setFilters] = useState({ orderId: '', user: '' });

  const rows = useMemo(() => {
    let list = seed;
    if (filters.orderId) list = list.filter(x => x.id.toLowerCase().includes(filters.orderId.toLowerCase()));
    if (filters.user) list = list.filter(x => (x.blogger || '').toLowerCase().includes(filters.user.toLowerCase()));
    return list;
  }, [filters]);

  const columns = ['Order Id','Order Type','Blogger','Root Domain','Status','Reject Reason'];
  const data = rows.map(r => ({
    orderId: r.id,
    orderType: <span className="badge">{r.orderType}</span>,
    blogger: (
      <div>
        <div className="font-medium">{r.blogger.split('\n')[0]}</div>
        <div className="text-xs text-text-secondary">{r.blogger.split('\n')[1]}</div>
      </div>
    ),
    rootDomain: r.root,
    status: r.status,
    rejectReason: r.reason
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">Bloggers</h1>

      <div className="bg-surface border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-medium text-text-secondary">Filters</div>
          <button className="text-error text-sm" onClick={() => setFilters({ orderId: '', user: '' })}>Reset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Order Id</label>
            <input className="input w-full" value={filters.orderId} onChange={(e)=>setFilters(f=>({...f,orderId:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">User name/email</label>
            <input className="input w-full" value={filters.user} onChange={(e)=>setFilters(f=>({...f,user:e.target.value}))} />
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={data} emptyStateMessage="No rejected blogger orders" />
      </div>
    </Layout>
  );
};
