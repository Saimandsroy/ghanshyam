import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw, Users, CheckCircle, XCircle } from 'lucide-react';
import { Pagination } from '../../../components/Pagination.jsx';
import { managerAPI } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

export function PendingTeams() {
  const { showSuccess, showError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [processing, setProcessing] = useState(null);

  // Fetch tasks pending initial approval from team
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerAPI.getTasks();
      // Filter for tasks pending manager's first approval
      const pendingTasks = (response.tasks || []).filter(t =>
        t.current_status === 'PENDING_MANAGER_APPROVAL_1' || t.current_status === 'DRAFT'
      );
      setTasks(pendingTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle approval (assign to writer)
  const handleApprove = async (taskId) => {
    try {
      setProcessing(taskId);
      // This would typically open a modal to select a writer
      // For now, we'll just show success
      showSuccess('Select a writer to assign this task');
      // In real implementation: await managerAPI.assignToWriter(taskId, writerId);
    } catch (err) {
      showError('Failed to approve: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  // Handle rejection
  const handleReject = async (taskId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      setProcessing(taskId);
      await managerAPI.rejectTask(taskId, reason);
      showSuccess('Task rejected');
      fetchTasks();
    } catch (err) {
      showError('Failed to reject: ' + err.message);
    } finally {
      setProcessing(null);
    }
  };

  // Filter tasks
  const rows = useMemo(() => {
    let r = tasks;
    const q = filters.search.toLowerCase();
    if (q) {
      r = r.filter(t =>
        `${t.id}`.includes(q) ||
        (t.website_domain || '').toLowerCase().includes(q) ||
        (t.created_by_name || '').toLowerCase().includes(q)
      );
    }
    return r;
  }, [tasks, filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Users className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Pending Approval - Teams
        </h2>
        <button onClick={fetchTasks} disabled={loading} className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50">
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400">{error}</p>
          <button onClick={fetchTasks} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)' }}>Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          <button className="text-sm" style={{ color: 'var(--error)' }} onClick={() => setFilters({ search: '' })}>Reset</button>
        </div>
        <div className="flex gap-3 items-center">
          <input placeholder="Search by ID, domain, creator..." value={filters.search} onChange={(e) => { setFilters({ search: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2 flex-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} pending</span>
        </div>
      </div>

      {/* Loading */}
      {loading && tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading pending approvals...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Task ID</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Domain</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Created By</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((task) => (
                <tr key={task.id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>TASK-{task.id}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{task.website_domain || 'N/A'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{task.created_by_name || 'Team'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: 'var(--warning)' }}>
                      {task.current_status === 'DRAFT' ? 'Draft' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleApprove(task.id)} disabled={processing === task.id} className="p-2 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50" title="Assign to Writer">
                      <CheckCircle className="h-5 w-5" style={{ color: 'var(--success)' }} />
                    </button>
                    <button onClick={() => handleReject(task.id)} disabled={processing === task.id} className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50" title="Reject">
                      <XCircle className="h-5 w-5" style={{ color: 'var(--error)' }} />
                    </button>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No pending team approvals</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && <Pagination page={page} pageSize={pageSize} total={total} pageSizeOptions={[20, 50]} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />}
    </div>
  );
}

export default PendingTeams;
