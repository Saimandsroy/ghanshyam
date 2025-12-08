import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatCard } from '../components/dashboard/StatCard';
import { DataTable } from '../components/tables/DataTable';
import { EmptyState } from '../components/empty/EmptyState';
import { TableFilter } from '../components/filters/TableFilter';
import { Users, AlertTriangle, MessageSquare, RefreshCw } from 'lucide-react';
import { managerAPI } from '../../lib/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tasks and withdrawals in parallel
      const [tasksResponse, withdrawalsResponse] = await Promise.all([
        managerAPI.getTasks(),
        managerAPI.getWithdrawals()
      ]);

      setTasks(tasksResponse.tasks || []);
      setWithdrawals(withdrawalsResponse.withdrawals || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate stats from API data
  const pendingApprovals = tasks.filter(t =>
    t.current_status === 'PENDING_MANAGER_APPROVAL_1' ||
    t.current_status === 'PENDING_MANAGER_APPROVAL_2'
  ).length;

  const rejectedOrders = tasks.filter(t => t.current_status === 'REJECTED').length;

  const stats = [
    {
      icon: <Users size={24} />,
      label: 'Pending Approvals',
      value: pendingApprovals,
      type: 'warning'
    },
    {
      icon: <AlertTriangle size={24} />,
      label: 'Rejected Orders',
      value: rejectedOrders,
      type: 'error'
    },
    {
      icon: <MessageSquare size={24} />,
      label: 'Total Tasks',
      value: tasks.length,
      type: 'success'
    }
  ];

  // Format tasks for table display
  const orderColumns = ['Order ID', 'Status', 'Writer', 'Blogger', 'Created At', 'Actions'];
  const orderData = tasks.slice(0, 10).map(task => ({
    id: `TASK-${task.id}`,
    status: task.current_status,
    writer: task.assigned_writer_id ? `Writer #${task.assigned_writer_id}` : 'Not assigned',
    blogger: task.assigned_blogger_id ? `Blogger #${task.assigned_blogger_id}` : 'Not assigned',
    date: new Date(task.created_at).toLocaleDateString(),
    rawStatus: task.current_status
  }));

  // Get pending approval tasks
  const pendingApprovalTasks = tasks.filter(t =>
    t.current_status === 'PENDING_MANAGER_APPROVAL_1' ||
    t.current_status === 'PENDING_MANAGER_APPROVAL_2'
  );

  return (
    <Layout>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted">Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg p-6 mb-6 bg-error/10 border border-error/30">
          <p className="text-error mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  type={stat.type}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Tasks</h2>
              <button
                className="btn btn-accent"
                onClick={() => navigate('/manager/orders/create')}
              >
                Create New Order
              </button>
            </div>
            <TableFilter />
            {orderData.length > 0 ? (
              <DataTable columns={orderColumns} data={orderData} />
            ) : (
              <div className="card">
                <EmptyState
                  title="No Tasks Found"
                  message="There are no tasks in the system yet."
                />
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Pending Approval</h2>
            <div className="card">
              {pendingApprovalTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovalTasks.map(task => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Task #{task.id}</h3>
                          <p className="text-sm text-muted mt-1">Status: {task.current_status}</p>
                          <p className="text-sm text-muted">Created: {new Date(task.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-success">Approve</button>
                          <button className="btn btn-sm btn-error">Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Pending Approvals"
                  message="There are no items waiting for your approval at the moment."
                />
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};