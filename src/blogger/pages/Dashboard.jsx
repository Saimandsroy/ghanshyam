import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Globe, MessageCircle, RefreshCw, Eye, ExternalLink, Layers } from 'lucide-react';
import { ChartCard } from '../../admin/components/ChartCard';
import { PremiumStatsCard } from '../../components/PremiumStatsCard';
import { BarChart } from '../../admin/components/BarChart';
import { bloggerAPI } from '../../lib/api';
import { mapTaskStatus } from '../components/OrdersTable';

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksResponse = await bloggerAPI.getTasks();
      setTasks(tasksResponse.tasks || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate counts by status
  const statusCounts = {
    pending: tasks.filter(t => mapTaskStatus(t.current_status) === 'pending').length,
    waiting: tasks.filter(t => mapTaskStatus(t.current_status) === 'waiting').length,
    rejected: tasks.filter(t => mapTaskStatus(t.current_status) === 'rejected').length,
    completed: tasks.filter(t => mapTaskStatus(t.current_status) === 'completed').length,
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter(t => mapTaskStatus(t.current_status) === 'pending');
  const waitingTasks = tasks.filter(t => mapTaskStatus(t.current_status) === 'waiting');
  const rejectedTasks = tasks.filter(t => mapTaskStatus(t.current_status) === 'rejected');
  const completedTasks = tasks.filter(t => mapTaskStatus(t.current_status) === 'completed');

  // Stats cards data
  const stats = [
    { label: 'Total Sites', value: tasks.length || 0, icon: Globe, color: '#6BF0FF', link: '/blogger/sites/all' },
    { label: 'Pending Orders', value: statusCounts.pending, icon: Clock, color: '#F59E0B', link: '/blogger/orders' },
    { label: 'Waiting Orders', value: statusCounts.waiting, icon: Layers, color: '#3B82F6', link: '/blogger/orders' },
    { label: 'Rejected Orders', value: statusCounts.rejected, icon: XCircle, color: '#EF4444', link: '/blogger/orders' },
    { label: 'Completed Orders', value: statusCounts.completed, icon: CheckCircle, color: '#22C55E', link: '/blogger/orders' },
    { label: 'Threads', value: 1, icon: MessageCircle, color: '#9CA3AF', link: '/blogger/threads' }
  ];

  // Chart data
  const chartLabels = ['Pending', 'Waiting', 'Rejected', 'Completed'];
  const chartData = [statusCounts.pending, statusCounts.waiting, statusCounts.rejected, statusCounts.completed];
  const chartColors = ['#F59E0B', '#3B82F6', '#EF4444', '#22C55E'];

  // Order card component
  const OrderCard = ({ task }) => (
    <div
      className="p-4 rounded-xl cursor-pointer hover:bg-[var(--background-dark)] transition-all border border-[var(--border)] hover:border-[var(--primary-cyan)] group"
      style={{ backgroundColor: 'var(--card-background)' }}
      onClick={() => navigate(`/blogger/orders/${task.id}`)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-cyan)] transition-colors">
          Order #{task.order_id || task.id}
        </span>
        <Eye className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)] transition-colors" />
      </div>
      <div className="text-xs mb-3 text-[var(--text-secondary)] font-medium">
        {task.root_domain || task.website_domain || 'N/A'}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${task.order_type?.toLowerCase().includes('niche')
            ? 'text-purple-500 bg-purple-500/10 border-purple-500/20'
            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
          }`}>
          {task.order_type || 'Unknown'}
        </span>
        {task.target_url && (
          <a
            href={task.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 text-[var(--primary-cyan)] hover:underline"
            onClick={e => e.stopPropagation()}
          >
            Link <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );

  // Orders section component
  const OrdersSection = ({ title, orders, accentColor, emptyMessage }) => (
    <div className="premium-card h-full flex flex-col">
      <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background-dark)]/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor }} />
          <h3 className="font-bold text-[var(--text-primary)] text-lg">{title}</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-md border" style={{
          backgroundColor: `${accentColor}10`,
          color: accentColor,
          borderColor: `${accentColor}20`
        }}>
          {orders.length}
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto max-h-[320px] custom-scrollbar space-y-3">
        {orders.length > 0 ? (
          orders.map(task => <OrderCard key={task.id} task={task} />)
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8 text-[var(--text-muted)] opacity-70">
            <div className="bg-[var(--background-dark)] p-3 rounded-full mb-3 border border-[var(--border)]">
              <Layers className="h-6 w-6 opacity-30" />
            </div>
            <p className="text-sm font-medium">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome back!</h1>
          <p className="text-[var(--text-secondary)] mt-1">Here's an overview of your orders and performance.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="premium-btn premium-btn-accent self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Cards - 3x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <PremiumStatsCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            onClick={() => {
              if (stat.link) navigate(stat.link);
            }}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Section - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2">
          <ChartCard title="Order Status Distribution">
            <BarChart
              labels={chartLabels}
              datasets={[{
                label: 'Count',
                data: chartData,
                backgroundColor: chartColors,
                borderRadius: 6,
                maxBarThickness: 40
              }]}
              height={300}
            />
          </ChartCard>
        </div>

        {/* Pending Orders - Priority View */}
        <div className="lg:col-span-1 h-full">
          <OrdersSection
            title="Pending Action"
            orders={pendingTasks}
            accentColor="#F59E0B"
            emptyMessage="No pending orders. Good job!"
          />
        </div>
      </div>

      {/* Other Statuses Input Info */}
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <Layers className="h-5 w-5 text-[var(--primary-cyan)]" />
        Order Queues
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OrdersSection
          title="Waiting Approval"
          orders={waitingTasks}
          accentColor="#3B82F6"
          emptyMessage="No orders waiting for approval"
        />
        <OrdersSection
          title="Rejected / Issues"
          orders={rejectedTasks}
          accentColor="#EF4444"
          emptyMessage="No rejected orders"
        />
        <OrdersSection
          title="Completed"
          orders={completedTasks}
          accentColor="#22C55E"
          emptyMessage="No completed orders yet"
        />
      </div>

      {/* Loading Overlay if needed or just handled by button state, 
          but initial load needs full screen spinner maybe? 
          Kept simple for now as per previous design but cleaner */}
      {loading && tasks.length === 0 && (
        <div className="fixed inset-0 bg-[var(--background-dark)]/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-cyan)] border-t-transparent"></div>
        </div>
      )}

      {/* Error Toast styled inline for now */}
      {error && (
        <div className="fixed bottom-8 right-8 bg-[var(--error)] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp z-50">
          <XCircle className="h-5 w-5" />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full"><XCircle size={14} /></button>
        </div>
      )}
    </div>
  );
}
