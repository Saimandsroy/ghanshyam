import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Download, Eye, CheckCircle, RefreshCw } from 'lucide-react';
import { teamAPI } from '../../../lib/api';

export function CompletedOrdersTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamAPI.getTasks();
      // Filter for completed tasks
      const completedTasks = (response.tasks || []).filter(t =>
        t.current_status === 'COMPLETED' || t.current_status === 'CREDITED'
      ).slice(0, 5);
      setTasks(completedTasks);
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

  if (tasks.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border flex flex-col items-center justify-center py-16">
        <div className="p-4 rounded-full bg-accent">
          <CheckCircle size={32} className="text-muted" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">No Completed Orders Yet</h3>
        <p className="mt-2 text-sm text-muted">Completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background">
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Task ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Website</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Completed At</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-accent transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                  TASK-{task.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {task.website_domain || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                    {task.current_status === 'CREDITED' ? 'Credited' : 'Completed'}
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
                    <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors" aria-label="Download report">
                      <Download size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors" aria-label="More options">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}