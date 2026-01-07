import React, { useState, useEffect } from 'react';
import { CheckCircle, Bell, AlertTriangle, Globe, MessageSquare, RefreshCw } from 'lucide-react';
import { teamAPI } from '../../../lib/api';

export function KPICards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending_tasks: 0,
    completed_tasks: 0,
    rejected_tasks: 0,
    total_tasks: 0,
    available_websites: 0
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await teamAPI.getDashboard();
      setStats(response.stats || {
        pending_tasks: 0,
        completed_tasks: 0,
        rejected_tasks: 0,
        total_tasks: 0,
        available_websites: 0
      });
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

  const metrics = [
    {
      title: 'Completed Orders',
      value: String(stats.completed_tasks),
      change: `${stats.total_tasks} total`,
      icon: <CheckCircle className="text-success" size={24} />,
      color: 'from-success/20 to-transparent',
      textColor: 'text-success'
    },
    {
      title: 'Order Added Notifications',
      value: String(stats.pending_tasks),
      change: 'Awaiting action',
      icon: <Bell className="text-primary" size={24} />,
      color: 'from-primary/20 to-transparent',
      textColor: 'text-primary'
    },
    {
      title: 'Rejected Links',
      value: String(stats.rejected_tasks),
      change: 'Needs review',
      icon: <AlertTriangle className="text-error" size={24} />,
      color: 'from-error/20 to-transparent',
      textColor: 'text-error'
    },
    {
      title: 'New Sites',
      value: String(stats.available_websites),
      change: 'In inventory',
      icon: <Globe className="text-warning" size={24} />,
      color: 'from-warning/20 to-transparent',
      textColor: 'text-warning'
    },
    {
      title: 'Threads',
      value: 'View',
      change: 'Inbox',
      icon: <MessageSquare className="text-primary" size={24} />,
      color: 'from-primary/20 to-transparent',
      textColor: 'text-primary'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg p-6 mb-6 bg-error/10 border border-error/30">
        <p className="text-error mb-4">Error loading statistics: {error}</p>
        <button
          onClick={fetchDashboardData}
          className="btn btn-primary flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-text-secondary font-medium text-sm mb-2">
                {metric.title}
              </h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value}
                </span>
                <span className="ml-2 text-xs font-medium text-muted">
                  {metric.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${metric.color}`}>
              {metric.icon}
            </div>
          </div>
          <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
            <div className={`h-full ${metric.textColor} bg-current`} style={{
              width: `${(parseInt(metric.value) / (stats.total_tasks || 1)) * 100}%`
            }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}