import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { PremiumStatsCard } from '../../components/PremiumStatsCard';
import { EmptyState } from '../components/empty/EmptyState';
import { Users, AlertTriangle, MessageSquare, RefreshCw, Zap, FileText } from 'lucide-react';
import { managerAPI } from '../../lib/api';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await managerAPI.getDashboard();
      setDashboardData(response);
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

  // Build stats array from API data (matching production layout with navigation)
  const stats = dashboardData ? [
    {
      icon: <Users size={24} />,
      label: 'Pending Approvals for Bloggers',
      value: dashboardData.stats.pending_bloggers,
      type: 'warning',
      onClick: () => navigate('/manager/pending/bloggers')
    },
    {
      icon: <Zap size={24} />,
      label: 'Pending Approvals Teams',
      value: dashboardData.stats.pending_teams,
      type: 'info',
      onClick: () => navigate('/manager/pending/teams')
    },
    {
      icon: <FileText size={24} />,
      label: 'Pending Approvals Writers',
      value: dashboardData.stats.pending_writers,
      type: 'primary',
      onClick: () => navigate('/manager/pending/writers')
    },
    {
      icon: <AlertTriangle size={24} />,
      label: 'Rejected Orders Bloggers',
      value: dashboardData.stats.rejected_orders,
      type: 'error',
      onClick: () => navigate('/manager/rejected/bloggers')
    },
    {
      icon: <MessageSquare size={24} />,
      label: 'Threads',
      value: dashboardData.stats.threads,
      type: 'success',
      onClick: () => navigate('/manager/threads')
    }
  ] : [];

  // Pending blogger approvals for the table
  const pendingApprovals = dashboardData?.pending_blogger_approvals || [];

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
      {!loading && !error && dashboardData && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* 5 Stat Cards - First Row (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {stats.slice(0, 3).map((stat, index) => {
                const colors = { warning: '#F59E0B', info: '#3B82F6', primary: '#06b6d4', error: '#EF4444', success: '#22C55E' };
                return (
                  <PremiumStatsCard
                    key={index}
                    icon={stat.icon.type}
                    label={stat.label}
                    value={stat.value}
                    color={colors[stat.type] || '#3B82F6'}
                    onClick={stat.onClick}
                  />
                )
              })}
            </div>

            {/* Second Row (2 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.slice(3).map((stat, index) => {
                const colors = { warning: '#F59E0B', info: '#3B82F6', primary: '#06b6d4', error: '#EF4444', success: '#22C55E' };
                return (
                  <PremiumStatsCard
                    key={index + 3}
                    icon={stat.icon.type}
                    label={stat.label}
                    value={stat.value}
                    color={colors[stat.type] || '#3B82F6'}
                    onClick={stat.onClick}
                  />
                )
              })}
            </div>
          </div>

          {/* Today Pending Approvals For Bloggers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Today Pending Approvals For Bloggers</h2>
            <div className="card overflow-hidden">
              {pendingApprovals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Order Id</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Vendor</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">New site</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {pendingApprovals.map((approval) => (
                        <tr key={approval.detail_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-4 text-sm">{approval.order_id || '-'}</td>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium">{approval.vendor_name || '-'}</div>
                            <div className="text-xs text-gray-500">{approval.vendor_email || ''}</div>
                          </td>
                          <td className="px-4 py-4 text-sm">{approval.new_site || '-'}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${approval.status === 'Accepted'
                                ? 'bg-green-100 text-green-700'
                                : approval.status === 'Rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                              {approval.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex gap-2">
                              <button
                                className="text-cyan-500 hover:text-cyan-600 text-sm font-medium"
                                onClick={() => navigate(`/manager/orders/${approval.detail_id}`)}
                              >
                                Detail
                              </button>
                              <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                                Reject post
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  title="No Pending Approvals"
                  message="There are no blogger approvals pending at the moment."
                />
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};