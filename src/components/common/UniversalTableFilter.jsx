import React from 'react';
import { Search, Filter, X } from 'lucide-react';

/**
 * UniversalTableFilter Component
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Handler for search input change
 * @param {Object} props.filters - Current state of filters { key: value }
 * @param {Function} props.onFilterChange - Handler for filter dropdown changes (key, value)
 * @param {Function} props.onClearFilters - Handler to reset all filters
 * @param {Array} props.filterOptions - Array of filter configs:
 *   [
 *     { 
 *       key: 'status', 
 *       label: 'Status', 
 *       options: [
 *         { value: 'all', label: 'All Statuses' },
 *         { value: 'pending', label: 'Pending' }, ...
 *       ]
 *     }
 *   ]
 */
export const UniversalTableFilter = ({
    searchQuery,
    onSearchChange,
    filters,
    onFilterChange,
    onClearFilters,
    filterOptions = [],
}) => {
    return (
        <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Search Input */}
                <div className="relative flex-1 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--background-dark)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)] transition-colors"
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                </div>

                {/* Dynamic Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {filterOptions.map((option) => (
                        <div key={option.key} className="relative min-w-[160px] flex-1 md:flex-none">
                            <select
                                value={filters[option.key] || 'all'}
                                onChange={(e) => onFilterChange(option.key, e.target.value)}
                                className="w-full pl-9 pr-4 py-2 appearance-none bg-[var(--background-dark)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)] text-sm transition-colors cursor-pointer"
                            >
                                {option.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                        </div>
                    ))}

                    {/* Clear Filters Button */}
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background-dark)] text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors text-sm whitespace-nowrap"
                    >
                        <X size={16} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
