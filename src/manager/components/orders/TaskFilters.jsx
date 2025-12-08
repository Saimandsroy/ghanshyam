import React from 'react';
import { Search, Calendar, X, Filter } from 'lucide-react';

// Available task statuses for filtering
const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PENDING_MANAGER_APPROVAL_1', label: 'Pending Approval' },
    { value: 'ASSIGNED_TO_WRITER', label: 'Assigned to Writer' },
    { value: 'WRITING_IN_PROGRESS', label: 'Writing' },
    { value: 'PENDING_MANAGER_APPROVAL_2', label: 'Content Review' },
    { value: 'ASSIGNED_TO_BLOGGER', label: 'Assigned to Blogger' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' },
];

/**
 * TaskFilters - Filter controls for tasks
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filters change
 * @param {Function} onReset - Callback to reset filters
 */
export function TaskFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const hasActiveFilters = filters.search || filters.status !== 'all' || filters.startDate || filters.endDate;

    return (
        <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Filter className="h-4 w-4" />
                    Filters
                </div>
                {hasActiveFilters && (
                    <button
                        className="text-sm flex items-center gap-1 hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--error)' }}
                        onClick={onReset}
                    >
                        <X className="h-3 w-3" />
                        Reset
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Search */}
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        <Search className="h-3 w-3 inline mr-1" />
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Task ID or domain..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="w-full rounded-xl px-3 py-2 transition-all focus:ring-2 focus:ring-primary/50"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full rounded-xl px-3 py-2"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        From Date
                    </label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full rounded-xl px-3 py-2"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        To Date
                    </label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        className="w-full rounded-xl px-3 py-2"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* Assigned Filter */}
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Assignment
                    </label>
                    <select
                        value={filters.assigned}
                        onChange={(e) => handleChange('assigned', e.target.value)}
                        className="w-full rounded-xl px-3 py-2"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <option value="all">All</option>
                        <option value="unassigned">Unassigned</option>
                        <option value="writer">Assigned to Writer</option>
                        <option value="blogger">Assigned to Blogger</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
