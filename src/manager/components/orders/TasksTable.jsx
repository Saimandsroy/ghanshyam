import React from 'react';

/**
 * Get status display information
 */
export const getTaskStatusInfo = (status) => {
    const statusMap = {
        'DRAFT': { label: 'Draft', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' },
        'PENDING_MANAGER_APPROVAL_1': { label: 'Pending Approval', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
        'ASSIGNED_TO_WRITER': { label: 'Assigned (Writer)', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
        'WRITING_IN_PROGRESS': { label: 'Writing', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
        'PENDING_MANAGER_APPROVAL_2': { label: 'Review Content', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
        'ASSIGNED_TO_BLOGGER': { label: 'Assigned (Blogger)', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
        'PUBLISHED_PENDING_VERIFICATION': { label: 'Pending Verification', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
        'PENDING_FINAL_CHECK': { label: 'Final Check', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
        'COMPLETED': { label: 'Completed', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
        'CREDITED': { label: 'Credited', color: '#22C55E', bgColor: 'rgba(34, 197, 94, 0.1)' },
        'REJECTED': { label: 'Rejected', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' };
};

/**
 * TasksTable - Reusable table component for displaying tasks
 * @param {Array} tasks - Array of task objects
 * @param {Function} onViewTask - Callback when viewing a task
 * @param {Function} onApprove - Callback when approving a task
 * @param {Function} onReject - Callback when rejecting a task
 * @param {boolean} loading - Whether data is loading
 */
export function TasksTable({ tasks, onViewTask, onApprove, onReject, loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-3 text-sm text-muted">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full">
                <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                    <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Task ID</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Website</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Assigned To</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                        const statusInfo = getTaskStatusInfo(task.current_status);
                        const isPending = task.current_status?.includes('PENDING_MANAGER');

                        return (
                            <tr
                                key={task.id}
                                className="hover:bg-white/5 transition-colors"
                                style={{ borderBottom: '1px solid var(--border)' }}
                            >
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-1 rounded text-xs font-medium"
                                        style={{
                                            backgroundColor: 'rgba(107, 240, 255, 0.1)',
                                            border: '1px solid rgba(107, 240, 255, 0.3)',
                                            color: '#6BF0FF'
                                        }}
                                    >
                                        TASK-{task.id}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div style={{ color: 'var(--text-primary)' }}>
                                        {task.website_domain || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        {task.assigned_writer_id ? (
                                            <span>Writer #{task.assigned_writer_id}</span>
                                        ) : task.assigned_blogger_id ? (
                                            <span>Blogger #{task.assigned_blogger_id}</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-1 rounded text-xs font-medium"
                                        style={{
                                            backgroundColor: statusInfo.bgColor,
                                            color: statusInfo.color,
                                            border: `1px solid ${statusInfo.color}30`
                                        }}
                                    >
                                        {statusInfo.label}
                                    </span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(task.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewTask(task)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/10"
                                            style={{ color: 'var(--primary-cyan)', border: '1px solid var(--border)' }}
                                        >
                                            View
                                        </button>
                                        {isPending && (
                                            <>
                                                <button
                                                    onClick={() => onApprove(task)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onReject(task)}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                No tasks found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
