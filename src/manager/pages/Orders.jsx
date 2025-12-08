import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Plus, ClipboardList } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Pagination } from '../../components/Pagination';
import { managerAPI } from '../../lib/api';
import {
  TasksTable,
  TaskFilters,
  ApproveModal,
  RejectModal,
  AssignWriterModal
} from '../components/orders';

/**
 * Orders Page - Manager task management
 * Integrated with backend API for real data
 */
export const Orders = () => {
  // State for data
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    assigned: 'all'
  });

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // State for modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await managerAPI.getTasks();
      setTasks(response.tasks || []);
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

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(task =>
        String(task.id).includes(search) ||
        (task.website_domain || '').toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(task => task.current_status === filters.status);
    }

    // Filter by date range
    if (filters.startDate) {
      result = result.filter(task => new Date(task.created_at) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(task => new Date(task.created_at) <= new Date(filters.endDate));
    }

    // Filter by assignment
    if (filters.assigned === 'unassigned') {
      result = result.filter(task => !task.assigned_writer_id && !task.assigned_blogger_id);
    } else if (filters.assigned === 'writer') {
      result = result.filter(task => task.assigned_writer_id);
    } else if (filters.assigned === 'blogger') {
      result = result.filter(task => task.assigned_blogger_id);
    }

    return result;
  }, [tasks, filters]);

  // Paginated data
  const paginatedTasks = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, page, pageSize]);

  // Handlers
  const handleResetFilters = () => {
    setFilters({ search: '', status: 'all', startDate: '', endDate: '', assigned: 'all' });
    setPage(1);
  };

  const handleViewTask = (task) => {
    // For now, open approve modal - can be expanded to full detail view
    setSelectedTask(task);
    setShowApproveModal(true);
  };

  const handleOpenApprove = (task) => {
    setSelectedTask(task);
    setShowApproveModal(true);
  };

  const handleOpenReject = (task) => {
    setSelectedTask(task);
    setShowRejectModal(true);
  };

  const handleApprove = async (taskId, notes) => {
    try {
      setSubmitting(true);

      // Determine which approval action to take based on current status
      const task = tasks.find(t => t.id === taskId);
      if (task?.current_status === 'PENDING_MANAGER_APPROVAL_1') {
        // First approval - assign to writer (for now just approve)
        await managerAPI.approveContent(taskId, null);
      } else {
        await managerAPI.approveContent(taskId, null);
      }

      setShowApproveModal(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Error approving task:', err);
      alert('Failed to approve task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (taskId, reason) => {
    try {
      setSubmitting(true);
      await managerAPI.rejectTask(taskId, reason);

      setShowRejectModal(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Error rejecting task:', err);
      alert('Failed to reject task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignWriter = async (taskId, writerId, instructions) => {
    try {
      setSubmitting(true);
      await managerAPI.assignToWriter(taskId, writerId, instructions);

      setShowAssignModal(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (err) {
      console.error('Error assigning writer:', err);
      alert('Failed to assign writer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Task Management
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 text-muted ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {/* Navigate to create */ }}
              className="btn btn-accent flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl p-4 flex items-center justify-between bg-error/10 border border-error/30">
            <p className="text-error">{error}</p>
            <button onClick={fetchTasks} className="btn btn-primary flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={(newFilters) => { setFilters(newFilters); setPage(1); }}
          onReset={handleResetFilters}
        />

        {/* Results Summary */}
        <div className="text-sm text-muted">
          Showing {paginatedTasks.length} of {filteredTasks.length} tasks
        </div>

        {/* Table */}
        <TasksTable
          tasks={paginatedTasks}
          onViewTask={handleViewTask}
          onApprove={handleOpenApprove}
          onReject={handleOpenReject}
          loading={loading && tasks.length === 0}
        />

        {/* Pagination */}
        {filteredTasks.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filteredTasks.length}
            pageSizeOptions={[20, 50]}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          />
        )}

        {/* Modals */}
        <ApproveModal
          task={selectedTask}
          isOpen={showApproveModal}
          onClose={() => { setShowApproveModal(false); setSelectedTask(null); }}
          onSubmit={handleApprove}
          submitting={submitting}
        />

        <RejectModal
          task={selectedTask}
          isOpen={showRejectModal}
          onClose={() => { setShowRejectModal(false); setSelectedTask(null); }}
          onSubmit={handleReject}
          submitting={submitting}
        />

        <AssignWriterModal
          task={selectedTask}
          writers={[]} // Would need to fetch writers list
          isOpen={showAssignModal}
          onClose={() => { setShowAssignModal(false); setSelectedTask(null); }}
          onSubmit={handleAssignWriter}
          submitting={submitting}
        />
      </div>
    </Layout>
  );
};