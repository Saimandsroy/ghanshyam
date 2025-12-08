import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { writerAPI } from '../../lib/api';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { tasks: fetchedTasks } = await writerAPI.getTasks();
      setTasks(fetchedTasks || []);
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

  // Calculate stats from tasks
  const completedOrders = tasks.filter(t =>
    t.current_status === 'COMPLETED' || t.current_status === 'CREDITED'
  ).length;

  const inProgressOrders = tasks.filter(t =>
    t.current_status === 'WRITING_IN_PROGRESS'
  ).length;

  const rejectedOrders = tasks.filter(t =>
    t.current_status === 'REJECTED'
  ).length;

  // Get today's tasks
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.created_at);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const cards = [
    { label: 'Total Tasks', value: tasks.length, icon: FileText },
    { label: 'In Progress', value: inProgressOrders, icon: Clock },
    { label: 'Completed Orders', value: completedOrders, icon: CheckCircle },
    { label: 'Rejected', value: rejectedOrders, icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Writer Dashboard</h2>

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

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="rounded-xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.label}</div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-2 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.value}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            <div className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Tasks Added Today</div>
            <div className="border-t" style={{ borderColor: 'var(--border)' }} />
            {todayTasks.length > 0 ? (
              <div className="p-4 space-y-3">
                {todayTasks.map(task => (
                  <div key={task.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)' }}>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Task #{task.id}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Status: {task.current_status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No new tasks today
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
