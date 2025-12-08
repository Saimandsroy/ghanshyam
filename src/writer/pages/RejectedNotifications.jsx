import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, XCircle, AlertTriangle } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { writerAPI } from '../../lib/api';

/**
 * RejectedNotifications - Writer's rejected tasks
 * Integrated with backend API
 */
export function RejectedNotifications() {
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
      // Filter for rejected tasks only
      const rejectedTasks = (response.tasks || []).filter(t => t.current_status === 'REJECTED');
      setTasks(rejectedTasks);
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

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return tasks.slice(startIndex, startIndex + pageSize);
  }, [tasks, page, pageSize]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Tasks {'>'} Rejected
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <XCircle className="h-6 w-6" style={{ color: '#EF4444' }} />
          Rejected Notifications
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
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading rejected tasks...</p>
        </div>
      )}

      {/* Task Cards */}
      {!loading && (
        <div className="space-y-4">
          {paginatedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--card-background)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <XCircle className="h-5 w-5" style={{ color: '#EF4444' }} />
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: '#6BF0FF' }}>
                      TASK-{task.id}
                    </span>
                    <h3 className="text-lg font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                      {task.website_domain || 'Task Rejected'}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                  Rejected
                </span>
              </div>

              {task.rejection_reason && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: '#EF4444' }} />
                    <div>
                      <p className="text-sm font-medium mb-1" style={{ color: '#EF4444' }}>Rejection Reason</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{task.rejection_reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                Rejected on: {new Date(task.updated_at || task.created_at).toLocaleString()}
              </div>
            </div>
          ))}

          {paginatedTasks.length === 0 && (
            <div
              className="rounded-2xl flex items-center justify-center py-16"
              style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
            >
              <div className="text-center">
                <XCircle className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No rejected tasks</p>
              </div>
            </div>
          )}
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
