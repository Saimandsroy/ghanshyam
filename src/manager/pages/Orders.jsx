import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DataTable } from '../components/tables/DataTable';
import { TableFilter } from '../components/filters/TableFilter';
import { OrderForm } from '../components/forms/OrderForm';
export const Orders = () => {
  const [view, setView] = useState('list');
  // Sample data for orders table
  const orderColumns = ['Order ID', 'Order Type', 'Blogger', 'Root Domain', 'Ordered At', 'Status'];
  const orderData = [{
    id: 'ORD-1234',
    type: 'Guest Post',
    blogger: 'John Smith',
    domain: 'techblog.com',
    date: '2023-10-15',
    status: 'pending'
  }, {
    id: 'ORD-1235',
    type: 'Link Insertion',
    blogger: 'Sarah Johnson',
    domain: 'marketingpro.com',
    date: '2023-10-14',
    status: 'accepted'
  }, {
    id: 'ORD-1236',
    type: 'Content Creation',
    blogger: 'Mike Wilson',
    domain: 'digitaltrends.com',
    date: '2023-10-13',
    status: 'rejected'
  }, {
    id: 'ORD-1237',
    type: 'Guest Post',
    blogger: 'Emma Davis',
    domain: 'seomaster.com',
    date: '2023-10-12',
    status: 'in-process'
  }, {
    id: 'ORD-1238',
    type: 'Link Insertion',
    blogger: 'Alex Brown',
    domain: 'contentking.com',
    date: '2023-10-11',
    status: 'pending'
  }, {
    id: 'ORD-1239',
    type: 'Guest Post',
    blogger: 'Lisa Taylor',
    domain: 'blogexpert.com',
    date: '2023-10-10',
    status: 'accepted'
  }];
  return <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {view === 'list' ? <button className="btn btn-accent" onClick={() => setView('create')}>
            Create New Order
          </button> : <button className="btn btn-outline" onClick={() => setView('list')}>
            Back to Orders
          </button>}
      </div>
      {view === 'list' ? <>
          <TableFilter />
          <DataTable columns={orderColumns} data={orderData} />
        </> : <OrderForm />}
    </Layout>;
};