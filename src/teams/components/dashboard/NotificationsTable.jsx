import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Inbox } from 'lucide-react';
import { teamAPI } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useTableFilter } from '../../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../../components/common/UniversalTableFilter';

export function NotificationsTable() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamAPI.getOrderNotifications();
      // Show top 20 instead of 5 to demonstrate filtering more effectively for this task
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

  const handlePush = (id) => {
    navigate(`/teams/order-notifications/push/${id}`);
  };

  const filterOptions = [
    {
      key: 'order_type',
      label: 'All Types',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'General', label: 'General' },
        { value: 'OnlyMailChecker', label: 'Only Mail Checker' },
        // Add other types as they appear in data
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
  } = useTableFilter(tasks, { order_type: 'all' });

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted">Loading notifications...</p>
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
      {/* Only show filter if there are tasks or if a filter is active (to allow clearing) */}
      {(tasks.length > 0 || searchQuery || filters.order_type !== 'all') && (
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
          <p className="text-sm text-muted">No matching notifications found</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <Inbox className="h-10 w-10 mx-auto text-muted" />
          <p className="mt-2 text-sm text-muted">No pending notifications</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((task) => (
                  <tr key={task.id} className="hover:bg-accent/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      #{task.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {task.client_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        {task.order_type || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handlePush(task.id)}
                        className="p-2 rounded-full hover:bg-accent text-primary transition-colors"
                        title="Push to Manager"
                      >
                        <ChevronRight size={16} />
                      </button>
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