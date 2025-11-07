import React, { useMemo, useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DataTable } from '../../components/tables/DataTable';
import { getOrders, deleteOrder } from '../../lib/ordersStore';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';

export const ViewOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => getOrders());
  const [filters, setFilters] = useState({ q: '', status: '' });

  useEffect(() => {
    const onStorage = () => setOrders(getOrders());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    const q = filters.q.trim().toLowerCase();
    if (q) {
      list = list.filter(o => `${o.id}`.toLowerCase().includes(q) || (o.clientName||'').toLowerCase().includes(q) || (o.manager||'').toLowerCase().includes(q));
    }
    if (filters.status) {
      list = list.filter(o => o.status === filters.status);
    }
    return list;
  }, [orders, filters]);

  const columns = ['Order Id','Manager','Client Name','Status','Website','No of Links','Order Type','Ordered At'];
  const rows = filtered.map(o => ({
    _id: o.id,
    orderId: (
      <div>
        <div className="font-medium">{o.id}</div>
        <div className="text-xs text-text-secondary">{o.kind === 'new' ? 'New Order' : 'Sub Order'}</div>
      </div>
    ),
    manager: o.manager,
    clientName: o.clientName,
    status: o.status,
    website: <a href={o.website} className="text-accent underline" target="_blank" rel="noreferrer">{o.website}</a>,
    links: o.links,
    orderType: o.orderType,
    orderedAt: new Date(o.createdAt).toLocaleString()
  }));

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">View Orders</h1>
        <button className="btn btn-accent" onClick={() => navigate('/manager/orders/create')}>Create New Order</button>
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input value={filters.q} onChange={(e)=>setFilters(f=>({...f,q:e.target.value}))} type="text" placeholder="Search by order id, client, manager..." className="input pl-9 w-full" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <div className="relative min-w-[180px]">
            <select value={filters.status} onChange={(e)=>setFilters(f=>({...f,status:e.target.value}))} className="input w-full pl-9 appearance-none">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-process">In Process</option>
              <option value="completed">Completed</option>
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <button className="btn btn-outline" onClick={()=>setFilters({q:'',status:''})}>
            <X size={16} className="mr-1.5" /> Reset
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        onView={(row) => navigate('/manager/orders/create')}
        onDelete={(row) => { deleteOrder(row._id); setOrders(getOrders()); }}
      />
    </Layout>
  );
};
