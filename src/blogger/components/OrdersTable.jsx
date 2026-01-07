import React from 'react';
import { ExternalLink, Eye, Send, XCircle } from 'lucide-react';
import { useTableFilter } from '../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../components/common/UniversalTableFilter';

/**
 * Map backend task status to display status
 * Status codes:
 * - 'pending' / 5 = assigned to blogger, not submitted yet
 * - 'waiting' / 7 = blogger submitted URL, waiting for manager approval  
 * - 'completed' / 8 = manager approved and credited
 * - 'rejected' / 11 = manager rejected, needs resubmission
 */
export const mapTaskStatus = (status) => {
    // If it's already a string status from backend
    if (typeof status === 'string') {
        const validStatuses = ['pending', 'waiting', 'completed', 'rejected'];
        if (validStatuses.includes(status)) {
            return status;
        }
    }

    // Legacy string mapping (for backwards compatibility)
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
 * Get status badge class name
 */
const getStatusClass = (status) => {
    switch (status) {
        case 'completed':
            return 'status-badge success';
        case 'rejected':
            return 'status-badge error';
        case 'waiting':
            return 'status-badge info';
        default:
            return 'status-badge warning';
    }
};

/**
 * OrdersTable - Reusable data table for displaying orders/tasks
 * @param {Array} data - Array of order/task objects
 * @param {Function} onViewDetails - Callback when viewing task details
 * @param {Function} onSubmitLink - Callback when submitting a link for a task
 * @param {boolean} loading - Whether data is loading
 */
export function OrdersTable({ data, onViewDetails, onSubmitLink, onRejectTask, loading }) {
    // Define filter options
    const filterOptions = [
        {
            key: 'current_status',
            label: 'All Statuses',
            options: [
                { value: 'all', label: 'All Statuses' },
                { value: 'ASSIGNED_TO_BLOGGER', label: 'Pending' },
                { value: 'PUBLISHED_PENDING_VERIFICATION', label: 'Waiting Approval' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'REJECTED', label: 'Rejected' }
            ]
        }
    ];

    const {
        filteredData,
        searchQuery,
        filters,
        handleSearchChange,
        handleFilterChange,
        clearFilters
    } = useTableFilter(data, { current_status: 'all' });

    if (loading) {
        return (
            <div className="premium-table-container p-8 text-center bg-[var(--card-background)]">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-cyan)]"></div>
                <p className="mt-3 text-sm text-[var(--text-muted)]">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <UniversalTableFilter
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                filterOptions={filterOptions}
            />

            <div className="premium-table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Website</th>
                            <th>Date/Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-[var(--text-muted)]">
                                    {data && data.length > 0 ? 'No matching tasks found' : 'No tasks found'}
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((task) => {
                                const displayStatus = mapTaskStatus(task.current_status);
                                const statusClass = getStatusClass(displayStatus);
                                const canSubmitLink = displayStatus === 'pending';

                                return (
                                    <tr key={task.id} className="hover:bg-[var(--background-dark)]/50 transition-colors duration-200">
                                        <td>
                                            <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-[var(--background-dark)] text-[var(--primary-cyan)] border border-[var(--border)]">
                                                {task.order_id || `ORD-${task.id}`}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="font-medium text-[var(--text-primary)]">
                                                {task.website_domain || 'N/A'}
                                            </div>
                                            {task.suggested_topic_url && (
                                                <a
                                                    href={task.suggested_topic_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs flex items-center gap-1 hover:text-[var(--primary-cyan)] mt-1 transition-colors text-[var(--text-muted)]"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    View Topic
                                                </a>
                                            )}
                                        </td>
                                        <td className="text-[var(--text-secondary)] text-sm">
                                            {(task.created_at || task.assigned_at)
                                                ? new Date(task.created_at || task.assigned_at).toLocaleString()
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <span className={statusClass}>
                                                {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onViewDetails(task)}
                                                    className="p-2 rounded-lg hover:bg-[var(--background-dark)] text-[var(--text-secondary)] hover:text-[var(--primary-cyan)] transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {canSubmitLink && (
                                                    <button
                                                        onClick={() => onSubmitLink(task)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all hover:brightness-110 shadow-lg shadow-[var(--primary-cyan)]/20 text-black bg-gradient-to-r from-[var(--primary-cyan)] to-[var(--bright-cyan)]"
                                                    >
                                                        <Send className="h-3 w-3" />
                                                        Submit Link
                                                    </button>
                                                )}
                                                {canSubmitLink && onRejectTask && (
                                                    <button
                                                        onClick={() => onRejectTask(task)}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        title="Reject Task"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
