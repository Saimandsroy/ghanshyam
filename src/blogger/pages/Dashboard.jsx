import React, { useState, useEffect } from 'react';
import { Search, Bell, Globe, Clock, CheckCircle, XCircle, ShoppingBag, MessageCircle, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { ChartCard } from '../../admin/components/ChartCard';
import { BarChart } from '../../admin/components/BarChart';
import { bloggerAPI } from '../../lib/api';

export function Dashboard() {
  const [year, setYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and tasks in parallel
      const [statsResponse, tasksResponse] = await Promise.all([
        bloggerAPI.getStats(),
        bloggerAPI.getTasks()
      ]);

      setStatsData(statsResponse.statistics);
      setTasks(tasksResponse.tasks || []);
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
  const stats = statsData ? [
    {
      label: 'Total Orders',
      value: String(statsData.pending_tasks + statsData.completed_tasks + statsData.under_review),
      change: `${statsData.completed_tasks} completed`,
      icon: ShoppingBag
    },
    {
      label: 'Completed Orders',
      value: String(statsData.completed_tasks),
      change: 'Successfully published',
      icon: CheckCircle
    },
    {
      label: 'Pending Orders',
      value: String(statsData.pending_tasks),
      change: 'Awaiting action',
      icon: Clock
    },
    {
      label: 'Under Review',
      value: String(statsData.under_review),
      change: 'Being verified',
      icon: Bell
    },
    {
      label: 'Total Earned',
      value: `$${statsData.total_earned.toFixed(2)}`,
      change: 'From completed tasks',
      icon: Globe
    },
    {
      label: 'Active Tasks',
      value: String(tasks.length),
      change: 'Currently assigned',
      icon: MessageCircle
    }
  ] : [];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Mock data for chart - will be replaced with real monthly data later
  const dataByYear = {
    '2023': [65, 78, 85, 72, 95, 105, 120, 80, 140, 130, 120, 110],
    '2024': [80, 105, 78, 85, 72, 105, 115, 150, 165, 158, 142, 150],
    '2025': [90, 110, 95, 100, 105, 115, 120, 160, 175, 170, 160, 180],
  };

  // Get today's tasks
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.created_at);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Dashboard Overview</h1>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400 mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
            style={{ color: 'var(--icon-on-gradient)' }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="rounded-2xl p-7 relative overflow-hidden hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-sm uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <span>{stat.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <ChartCard title="Monthly Orders" right={(
            <select value={year} onChange={e => setYear(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              {['2023', '2024', '2025'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}>
            <BarChart labels={months} datasets={[{ label: 'Orders', data: dataByYear[year], backgroundColor: '#06B6D4', borderRadius: 6 }]} height={280} />
          </ChartCard>

          <div className="rounded-2xl p-9 shadow-xl mt-8" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            <div className="mb-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Tasks Added Today</div>
            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)' }}>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Task #{task.id}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Status: {task.current_status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>No new tasks today</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
