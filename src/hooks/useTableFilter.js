import { useState, useMemo } from 'react';

export const useTableFilter = (data, initialFilters = {}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState(initialFilters);

    const filteredData = useMemo(() => {
        if (!data) return [];

        return data.filter((item) => {
            // 1. Search Logic
            const matchesSearch = searchQuery === '' || Object.values(item).some((val) => {
                if (val === null || val === undefined) return false;
                return String(val).toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (!matchesSearch) return false;

            // 2. Filter Logic
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (!value || value === 'all') return true; // 'all' or empty string ignores filter

                // Handle nested properties or custom logic if needed, 
                // but for now assume direct match or simple transformation
                const itemValue = item[key];

                // If the item value is null/undefined, it only matches if filter is explicitly looking for that (unlikely)
                if (itemValue === undefined || itemValue === null) return false;

                return String(itemValue).toLowerCase() === String(value).toLowerCase();
            });

            return matchesFilters;
        });
    }, [data, searchQuery, filters]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setFilters(initialFilters);
    };

    return {
        filteredData,
        searchQuery,
        filters,
        handleSearchChange,
        handleFilterChange,
        clearFilters,
    };
};
