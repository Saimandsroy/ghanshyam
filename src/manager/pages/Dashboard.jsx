import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatCard } from '../components/dashboard/StatCard';
import { DataTable } from '../components/tables/DataTable';
import { EmptyState } from '../components/empty/EmptyState';
import { TableFilter } from '../components/filters/TableFilter';
import { Users, AlertTriangle, MessageSquare } from 'lucide-react';
export const Dashboard = () => {
  const navigate = useNavigate();
  // Sample data for KPI cards
  const stats = [{
    icon: <Users size={24} />,
    label: 'Pending Approvals',
    value: 24,
    type: 'warning'
  }, {
    icon: <AlertTriangle size={24} />,
    label: 'Rejected Orders',
    value: 7,
    type: 'error'
  }, {
    icon: <MessageSquare size={24} />,
    label: 'Active Threads',
    value: 18,
    type: 'success'
  }];
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
  }];
  return <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} type={stat.type} />)}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <button className="btn btn-accent" onClick={() => navigate('/manager/orders/create')}>Create New Order</button>
        </div>
        <TableFilter />
        <DataTable columns={orderColumns} data={orderData} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Pending Approval</h2>
        <div className="card">
          <EmptyState title="No Pending Approvals" message="There are no items waiting for your approval at the moment." />
        </div>
      </div>
    </Layout>;
};