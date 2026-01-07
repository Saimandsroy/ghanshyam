import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle, Bell, XCircle, MessageSquare, X, Eye, ArrowUpRight } from 'lucide-react';
import { teamAPI } from '../../lib/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    completed_orders: 0,
    order_added_notifications: 0,
    rejected_notifications: 0,
    threads: 0
  });
  const [ordersAddedToday, setOrdersAddedToday] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await teamAPI.getDashboard();
      // Map backend stats to frontend format
      setStats({
        completed_orders: data.stats?.completed_tasks || 0,
        order_added_notifications: data.stats?.pending_tasks || 0,
        rejected_notifications: data.stats?.rejected_tasks || 0,
        threads: data.stats?.total_tasks || 0
      });
      setOrdersAddedToday(data.orders_added_today || []);
      setRejectedOrders(data.rejected_orders || []);
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

  const cards = [
    {
      label: 'Completed Orders',
      value: stats.completed_orders,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      link: '/teams/completed-orders'
    },
    {
      label: 'Order Added Notifications',
      value: stats.order_added_notifications,
      icon: Bell,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      link: '/teams/order-notifications'
    },
    {
      label: 'Rejected Links',
      value: stats.rejected_notifications,
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      link: '/teams/rejected-links'
    },
    {
      label: 'Threads',
      value: stats.threads,
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      link: '/teams/threads'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-[var(--text-muted)] mt-1">Welcome back, Team Member</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="premium-btn bg-[var(--card-background)] border border-[var(--border)] hover:border-[var(--primary-cyan)] text-[var(--text-primary)]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="premium-card p-4 border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          <p>Error loading dashboard: {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-2 border-[var(--primary-cyan)] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[var(--text-muted)] animate-pulse">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  onClick={() => navigate(c.link)}
                  className={`premium-card p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98] group relative`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${c.bgColor} ${c.color} border ${c.borderColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)] transition-colors" />
                  </div>
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                    {c.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] font-medium">
                    {c.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today Order Added Notification Section */}
            <div className="premium-card flex flex-col h-full">
              <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-400" />
                  Today's New Orders
                </h3>
                <span className="premium-badge bg-blue-500/10 text-blue-400 border-blue-500/20">
                  {ordersAddedToday.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                {ordersAddedToday.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {ordersAddedToday.map(order => (
                      <div
                        key={order.id}
                        className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                      >
                        <div>
                          <div className="font-medium text-[var(--primary-cyan)]">
                            {order.manual_order_id || `Order #${order.id}`}
                          </div>
                          <div className="text-sm mt-1 text-[var(--text-secondary)]">
                            {order.client_name} • <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">{order.order_type}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/teams/order-notifications`)}
                          className="premium-btn p-2 h-auto text-[var(--text-muted)] hover:text-[var(--primary-cyan)] bg-transparent shadow-none border border-transparent hover:border-[var(--primary-cyan)]/20 hover:bg-[var(--primary-cyan)]/5"
                          title="View Order"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--background-dark)] flex items-center justify-center mb-4 border border-[var(--border)]">
                      <Bell className="h-8 w-8 text-[var(--text-muted)] opacity-50" />
                    </div>
                    <p className="text-[var(--text-muted)]">No new orders added today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rejected Links Section */}
            <div className="premium-card flex flex-col h-full">
              <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-white/[0.02]">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  Rejected Links
                </h3>
                <span className="premium-badge bg-red-500/10 text-red-400 border-red-500/20">
                  {rejectedOrders.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
                {rejectedOrders.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {rejectedOrders.map(order => (
                      <div
                        key={order.id}
                        className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                      >
                        <div>
                          <div className="font-medium flex items-center gap-2 text-[var(--text-primary)]">
                            {order.manual_order_id || `Order #${order.id}`}
                            <span className="premium-badge bg-red-500/10 text-red-400 border-red-500/20 text-[10px] py-0.5 px-1.5 h-auto">
                              Rejected
                            </span>
                          </div>
                          <div className="text-sm mt-1 text-[var(--text-secondary)]">
                            {order.client_name} • <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">{order.order_type}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/teams/rejected-links`)}
                          className="premium-btn p-2 h-auto text-[var(--text-muted)] hover:text-red-400 bg-transparent shadow-none border border-transparent hover:border-red-400/20 hover:bg-red-500/5 api-transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--background-dark)] flex items-center justify-center mb-4 border border-[var(--border)]">
                      <CheckCircle className="h-8 w-8 text-green-500/50" />
                    </div>
                    <p className="text-[var(--text-muted)]">No rejected links pending</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}