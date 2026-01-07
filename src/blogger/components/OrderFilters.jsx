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
        <div className="premium-card p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
                <div className="font-bold flex items-center gap-2 text-[var(--text-primary)]">
                    <Search className="h-4 w-4 text-[var(--primary-cyan)]" />
                    Filters
                </div>
                {hasActiveFilters && (
                    <button
                        className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[var(--error)]/10 px-2 py-1 rounded-md transition-all text-[var(--error)]"
                        onClick={onReset}
                    >
                        <X className="h-3 w-3" />
                        Reset
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                        <Calendar className="h-3 w-3 inline mr-1 mb-0.5" />
                        Search By Date
                    </label>
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="premium-input"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                        Task ID
                    </label>
                    <input
                        type="text"
                        placeholder="Search by ID..."
                        value={filters.orderId}
                        onChange={(e) => handleChange('orderId', e.target.value)}
                        className="premium-input"
                    />
                </div>

                <div className="lg:col-span-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
                        Search by Website Domain
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. example.com"
                        value={filters.domain}
                        onChange={(e) => handleChange('domain', e.target.value)}
                        className="premium-input"
                    />
                </div>
            </div>
        </div>
    );
}
