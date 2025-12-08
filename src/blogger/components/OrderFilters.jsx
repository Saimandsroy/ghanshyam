import React from 'react';
import { Search, Calendar, X } from 'lucide-react';

/**
 * OrderFilters - Reusable filter bar for orders/tasks
 * @param {Object} filters - Current filter values { date, orderId, domain }
 * @param {Function} onFilterChange - Callback when filters change
 * @param {Function} onReset - Callback to reset all filters
 */
export function OrderFilters({ filters, onFilterChange, onReset }) {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const hasActiveFilters = filters.date || filters.orderId || filters.domain;

    return (
        <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="font-medium flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Search className="h-4 w-4" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Search By Date
                    </label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full rounded-xl px-3 py-2 transition-all focus:ring-2 focus:ring-[#6BF0FF]/50"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div>
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Task ID
                    </label>
                    <input
                        type="text"
                        placeholder="Search by ID..."
                        value={filters.orderId}
                        onChange={(e) => handleChange('orderId', e.target.value)}
                        className="w-full rounded-xl px-3 py-2 transition-all focus:ring-2 focus:ring-[#6BF0FF]/50"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="lg:col-span-2">
                    <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Search by Website Domain
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. example.com"
                        value={filters.domain}
                        onChange={(e) => handleChange('domain', e.target.value)}
                        className="w-full rounded-xl px-3 py-2 transition-all focus:ring-2 focus:ring-[#6BF0FF]/50"
                        style={{
                            backgroundColor: 'var(--background-dark)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
