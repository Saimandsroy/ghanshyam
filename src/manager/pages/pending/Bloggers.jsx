import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DataTable } from '../../components/tables/DataTable';

const seed = [
  { id: 'C1911CAD', orderType: 'niche', vendorName: 'artdailynews', vendorEmail: 'artdailynews@yahoo.com', domain: 'artdaily.com', status: 'accepted' },
  { id: 'A8CD2CC0', orderType: 'gp', vendorName: 'tamarakle', vendorEmail: 'tamarakle@gmail.com', domain: 'tamaracamerablog.com', status: 'accepted' }
];

export const PendingBloggers = () => {
  const [filters, setFilters] = useState({ orderId: '', user: '' });
  const rows = useMemo(() => {
    let list = seed;
    if (filters.orderId) list = list.filter(x => x.id.toLowerCase().includes(filters.orderId.toLowerCase()));
    if (filters.user) list = list.filter(x => (x.vendorName + ' ' + x.vendorEmail).toLowerCase().includes(filters.user.toLowerCase()));
    return list;
  }, [filters]);

  const columns = ['Order Id','Order Type','Vendor','Root Domain','Status'];
  const data = rows.map(r => ({
    orderId: r.id,
    orderType: <span className="badge">{r.orderType}</span>,
    vendor: (
      <div>
        <div className="font-medium">{r.vendorName}</div>
        <div className="text-xs text-text-secondary">{r.vendorEmail}</div>
      </div>
    ),
    rootDomain: r.domain,
    status: r.status
  }));

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pending Approval For Bloggers</h1>

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
        <DataTable columns={columns} data={data} emptyStateMessage="No pending blogger approvals" />
      </div>
    </Layout>
  );
};
