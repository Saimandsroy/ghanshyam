import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, CheckCircle, DollarSign, Calendar, Globe } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { writerAPI } from '../../lib/api';

/**
 * CompletedOrders - Writer's completed tasks
 * Integrated with backend API
 */
export function CompletedOrders() {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await writerAPI.getTasks();
      // Filter for completed tasks only
      const completedTasks = (response.tasks || []).filter(t =>
        t.current_status === 'COMPLETED' || t.current_status === 'CREDITED'
      );
      setTasks(completedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Calculate totals
  const totalEarned = useMemo(() => {
    return tasks.reduce((sum, t) => sum + parseFloat(t.payment_amount || 0), 0);
  }, [tasks]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return tasks.slice(startIndex, startIndex + pageSize);
  }, [tasks, page, pageSize]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Tasks {'>'} Completed
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <CheckCircle className="h-6 w-6" style={{ color: '#22C55E' }} />
          Completed Orders
        </h2>
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <CheckCircle className="h-6 w-6" style={{ color: '#22C55E' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Completed</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{tasks.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)' }}>
              <DollarSign className="h-6 w-6" style={{ color: '#6BF0FF' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Earned</p>
              <p className="text-2xl font-bold" style={{ color: '#22C55E' }}>${totalEarned.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <p className="text-red-400">{error}</p>
          <button onClick={fetchTasks} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading completed tasks...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Task ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Website</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Completed</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: '#6BF0FF' }}>
                      TASK-{task.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-primary)' }}>{task.website_domain || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{new Date(task.updated_at || task.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}>
                      {task.current_status === 'CREDITED' ? 'Credited' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: '#22C55E' }}>
                      ${parseFloat(task.payment_amount || 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    No completed tasks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {tasks.length > pageSize && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={tasks.length}
          pageSizeOptions={[20, 50]}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      )}
    </div>
  );
}
