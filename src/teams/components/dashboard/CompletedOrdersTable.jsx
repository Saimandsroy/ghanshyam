import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Download, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { teamAPI } from '../../../lib/api';
import { useTableFilter } from '../../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../../components/common/UniversalTableFilter';

export function CompletedOrdersTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamAPI.getCompletedOrders();
      // Show top 50
      setTasks((response.orders || []).slice(0, 50));
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filterOptions = [
    {
      key: 'current_status',
      label: 'All Statuses',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CREDITED', label: 'Credited' },
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
  } = useTableFilter(tasks, { current_status: 'all' });

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted">Loading completed orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <p className="text-error text-sm">{error}</p>
          <button onClick={fetchTasks} className="flex items-center gap-1 text-primary text-sm">
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(tasks.length > 0 || searchQuery || filters.current_status !== 'all') && (
        <UniversalTableFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          filterOptions={filterOptions}
        />
      )}

      {filteredData.length === 0 && tasks.length > 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <p className="text-sm text-muted">No matching completed orders found</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-card rounded-xl border border-border flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-accent">
            <CheckCircle size={32} className="text-muted" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">No Completed Orders Yet</h3>
          <p className="mt-2 text-sm text-muted">Completed orders will appear here.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Website</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Completed At</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((task) => (
                  <tr key={task.id} className="hover:bg-accent/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                      #{task.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {task.website_url || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                        {task.current_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(task.updated_at || task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors" aria-label="View order">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}