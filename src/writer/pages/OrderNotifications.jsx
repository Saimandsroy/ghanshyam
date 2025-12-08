import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Bell } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { writerAPI } from '../../lib/api';
import { TaskNotificationsList, ContentSubmitModal } from '../components';

/**
 * OrderNotifications - Writer's assigned tasks awaiting action
 * Integrated with backend API
 */
export function OrderNotifications() {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({ date: '', orderId: '' });

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // State for modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await writerAPI.getTasks();
      // Filter for only active/assigned tasks
      const activeTasks = (response.tasks || []).filter(t =>
        t.current_status === 'ASSIGNED_TO_WRITER' ||
        t.current_status === 'WRITING_IN_PROGRESS'
      );
      setTasks(activeTasks);
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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filters.date) {
      result = result.filter(task =>
        new Date(task.created_at).toDateString() === new Date(filters.date).toDateString()
      );
    }

    if (filters.orderId) {
      result = result.filter(task => String(task.id).includes(filters.orderId));
    }

    return result;
  }, [tasks, filters]);

  // Paginated tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, page, pageSize]);

  // Handlers
  const handleStartWriting = async (task) => {
    try {
      setSubmitting(true);
      await writerAPI.markInProgress(task.id);
      await fetchTasks();
    } catch (err) {
      console.error('Error starting task:', err);
      alert('Failed to start task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (task) => {
    // Could navigate to detail page or open modal
    setSelectedTask(task);
    setShowSubmitModal(true);
  };

  const handleOpenSubmit = (task) => {
    setSelectedTask(task);
    setShowSubmitModal(true);
  };

  const handleSubmitContent = async (taskId, content) => {
    try {
      setSubmitting(true);
      await writerAPI.submitContent(taskId, content);

      setShowSubmitModal(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Error submitting content:', err);
      alert('Failed to submit content: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ date: '', orderId: '' });
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Tasks {'>'} Notifications
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Bell className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Task Notifications
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

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          {(filters.date || filters.orderId) && (
            <button className="text-sm" style={{ color: 'var(--error)' }} onClick={handleResetFilters}>Reset</button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>By Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => { setFilters({ ...filters, date: e.target.value }); setPage(1); }}
              className="w-full rounded-xl px-3 py-2"
              style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Task ID</label>
            <input
              value={filters.orderId}
              onChange={(e) => { setFilters({ ...filters, orderId: e.target.value }); setPage(1); }}
              placeholder="Search by ID..."
              className="w-full rounded-xl px-3 py-2"
              style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {filteredTasks.length} active task(s)
      </div>

      {/* Tasks List */}
      <TaskNotificationsList
        tasks={paginatedTasks}
        loading={loading && tasks.length === 0}
        onStartWriting={handleStartWriting}
        onViewDetails={handleViewDetails}
        onSubmitContent={handleOpenSubmit}
      />

      {/* Pagination */}
      {filteredTasks.length > pageSize && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredTasks.length}
          pageSizeOptions={[20, 50]}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
        />
      )}

      {/* Submit Modal */}
      <ContentSubmitModal
        task={selectedTask}
        isOpen={showSubmitModal}
        onClose={() => { setShowSubmitModal(false); setSelectedTask(null); }}
        onSubmit={handleSubmitContent}
        submitting={submitting}
      />
    </div>
  );
}
