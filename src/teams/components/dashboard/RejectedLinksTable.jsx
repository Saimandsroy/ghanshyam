import React, { useState, Fragment, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';
import { teamAPI } from '../../../lib/api';
import { useTableFilter } from '../../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../../components/common/UniversalTableFilter';

export function RejectedLinksTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamAPI.getTasks();
      // Filter for rejected tasks
      const rejectedTasks = (response.tasks || []).filter(t => t.current_status === 'REJECTED').slice(0, 50);
      setTasks(rejectedTasks);
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

  const {
    filteredData,
    searchQuery,
    handleSearchChange,
    filters,
    onFilterChange,
    clearFilters
  } = useTableFilter(tasks, {}); // No specific filters, just search

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-muted">Loading rejected links...</p>
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
      {/* Render search if there are rejected links */}
      {(tasks.length > 0 || searchQuery) && (
        <UniversalTableFilter
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filters={filters} // unused
          onFilterChange={onFilterChange} // unused
          onClearFilters={clearFilters}
          filterOptions={[]} // No extra dropdowns
        />
      )}

      {filteredData.length === 0 && tasks.length > 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted">
          No matching rejected links found
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-card rounded-xl border border-border flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-accent">
            <AlertCircle size={32} className="text-muted" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">No Rejected Links</h3>
          <p className="mt-2 text-sm text-muted">All links are currently approved.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider w-10"></th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Task ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Website</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Rejected At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map(task => (
                  <Fragment key={task.id}>
                    <tr className="hover:bg-accent/50 transition-colors duration-150 cursor-pointer" onClick={() => toggleRow(task.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary">
                          {expandedRows[task.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-error">
                        TASK-{task.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {task.website_domain || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {new Date(task.updated_at || task.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                    {expandedRows[task.id] && (
                      <tr className="bg-background">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="pl-10 border-l-2 border-error">
                            <p className="text-sm font-medium text-error">Rejection Reason:</p>
                            <p className="text-sm text-muted mt-1">{task.rejection_reason || 'No reason provided'}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}