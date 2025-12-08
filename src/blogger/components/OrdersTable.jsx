import React from 'react';
import { ExternalLink, Eye, Send } from 'lucide-react';

/**
 * Map backend task status to display status
 */
export const mapTaskStatus = (status) => {
    const statusMap = {
        'ASSIGNED_TO_BLOGGER': 'pending',
        'PUBLISHED_PENDING_VERIFICATION': 'waiting',
        'PENDING_FINAL_CHECK': 'waiting',
        'COMPLETED': 'completed',
        'CREDITED': 'completed',
        'REJECTED': 'rejected',
    };
    return statusMap[status] || 'pending';
};

/**
 * Get status badge styling
 */
const getStatusStyle = (status) => {
    switch (status) {
        case 'completed':
            return {
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22C55E'
            };
        case 'rejected':
            return {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444'
            };
        case 'waiting':
            return {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3B82F6'
            };
        default:
            return {
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#F59E0B'
            };
    }
};

/**
 * OrdersTable - Reusable data table for displaying orders/tasks
 * @param {Array} data - Array of order/task objects
 * @param {Function} onViewDetails - Callback when viewing task details
 * @param {Function} onSubmitLink - Callback when submitting a link for a task
 * @param {boolean} loading - Whether data is loading
 */
export function OrdersTable({ data, onViewDetails, onSubmitLink, loading }) {
    if (loading) {
        return (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                    <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
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
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Date/Time</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                        <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((task) => {
                        const displayStatus = mapTaskStatus(task.current_status);
                        const statusStyle = getStatusStyle(displayStatus);
                        const canSubmitLink = displayStatus === 'pending';

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
                                    {task.suggested_topic_url && (
                                        <a
                                            href={task.suggested_topic_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs flex items-center gap-1 hover:underline mt-1"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View Topic
                                        </a>
                                    )}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(task.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-1 rounded text-xs font-medium"
                                        style={statusStyle}
                                    >
                                        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewDetails(task)}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" style={{ color: 'var(--primary-cyan)' }} />
                                        </button>
                                        {canSubmitLink && (
                                            <button
                                                onClick={() => onSubmitLink(task)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all hover:opacity-80"
                                                style={{
                                                    background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)',
                                                    color: 'var(--background-dark)'
                                                }}
                                            >
                                                <Send className="h-3 w-3" />
                                                Submit Link
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                No tasks found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
