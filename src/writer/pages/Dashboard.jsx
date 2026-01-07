import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, CheckCircle, Bell, XCircle, MessageSquare, X, Eye } from 'lucide-react';
import { writerAPI } from '../../lib/api';
import { PremiumStatsCard } from '../../components/PremiumStatsCard';

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

      const data = await writerAPI.getDashboard();
      setStats(data.stats || {});
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
      color: 'var(--success)',
      link: '/writer/completed-orders'
    },
    {
      label: 'Order Notifications',
      value: stats.order_added_notifications,
      icon: Bell,
      color: 'var(--primary-cyan)',
      link: '/writer/notifications'
    },
    {
      label: 'Rejected',
      value: stats.rejected_notifications,
      icon: XCircle,
      color: 'var(--error)',
      link: '/writer/rejected'
    },
    {
      label: 'Threads',
      value: stats.threads,
      icon: MessageSquare,
      color: '#8B5CF6',
      link: '/writer/threads'
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--primary-cyan)]" />
        <p className="mt-4 text-[var(--text-muted)] font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card p-8 text-center max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-[var(--error)]" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Failed to load dashboard</h3>
        <p className="text-[var(--text-muted)] mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="premium-btn premium-btn-primary mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Overview
          </h1>
          <p className="mt-1 text-[var(--text-secondary)]">
            Welcome back, Writer. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="premium-badge transition-colors" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary-cyan)' }}>
            <div className="w-2 h-2 rounded-full bg-[var(--primary-cyan)] animate-pulse" />
            Live Updates
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, index) => (
          <PremiumStatsCard
            key={index}
            icon={c.icon}
            label={c.label}
            value={c.value}
            color={c.color}
            onClick={() => navigate(c.link)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Added Today Notification Section */}
        <div className="premium-card flex flex-col h-full">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--primary-glow)]">
                <Bell className="w-5 h-5 text-[var(--primary-cyan)]" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)]">New Orders (Today)</h3>
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
            {ordersAddedToday.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {ordersAddedToday.map(order => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-[var(--background-dark)] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--primary-cyan)] transition-colors">
                        {order.manual_order_id || `Order #${order.id}`}
                      </div>
                      <div className="text-sm mt-1 text-[var(--text-muted)]">
                        {order.client_name} • <span className="font-medium">{order.order_type}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/writer/order-added-notifications/detail/${order.id}`)}
                      className="p-2 rounded-lg hover:bg-[var(--primary-glow)] text-[var(--text-muted)] hover:text-[var(--primary-cyan)] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-[var(--text-muted)]">
                <div className="w-12 h-12 rounded-full bg-[var(--background-dark)] flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p>No new orders today</p>
              </div>
            )}
          </div>
        </div>

        {/* Rejected Notifications Section */}
        <div className="premium-card flex flex-col h-full">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--error)]/10">
                <XCircle className="w-5 h-5 text-[var(--error)]" />
              </div>
              <h3 className="font-bold text-[var(--text-primary)]">Rejected Orders</h3>
            </div>
          </div>

          <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
            {rejectedOrders.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {rejectedOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 hover:bg-[var(--background-dark)] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                        {order.manual_order_id || `Order #${order.id}`}
                        <span className="premium-badge text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
                          Rejected
                        </span>
                      </div>
                      <div className="text-sm mt-1 text-[var(--text-muted)]">
                        {order.client_name} • {order.order_type}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/writer/rejected`)}
                      className="p-2 rounded-lg hover:bg-[var(--primary-glow)] text-[var(--text-muted)] hover:text-[var(--primary-cyan)] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-[var(--text-muted)]">
                <div className="w-12 h-12 rounded-full bg-[var(--background-dark)] flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-[var(--success)] opacity-40" />
                </div>
                <p>No rejected orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
