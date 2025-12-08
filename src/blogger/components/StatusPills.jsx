import React from 'react';

/**
 * StatusPills - Reusable status filter tabs component
 * @param {string[]} statuses - Array of status values
 * @param {string} activeStatus - Currently selected status
 * @param {Object} counts - Object with counts for each status
 * @param {Function} onStatusChange - Callback when status changes
 */
export function StatusPills({ statuses, activeStatus, counts, onStatusChange }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#22C55E';
            case 'rejected': return '#EF4444';
            case 'pending': return '#F59E0B';
            case 'waiting': return '#3B82F6';
            default: return '#6B7280';
        }
    };

    return (
        <div
            className="inline-flex gap-2 rounded-xl p-2"
            style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
        >
            {statuses.map((status) => {
                const isActive = activeStatus === status;
                const color = getStatusColor(status);

                return (
                    <button
                        key={status}
                        onClick={() => onStatusChange(status)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-white shadow-md' : 'hover:bg-white/5'
                            }`}
                        style={isActive
                            ? { backgroundColor: color }
                            : { color: 'var(--text-secondary)' }
                        }
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="ml-1.5 opacity-80">
                            {counts[status] ?? 0}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
