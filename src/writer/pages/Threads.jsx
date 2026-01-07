import React, { useEffect, useState, useCallback } from 'react';
import { Pagination } from '../../components/Pagination.jsx';
import { threadsAPI } from '../../lib/api';
import { MessageSquare, Plus, RefreshCw, Send, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function Threads() {
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [threads, setThreads] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');

  // Form State
  const [form, setForm] = useState({
    department: '', // Was 'role'
    priority: 'Medium', // Default
    subject: '',
    message: '' // Initial message
  });

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await threadsAPI.getThreads();
      setThreads(response.threads || []);
    } catch (err) {
      console.error('Error fetching threads:', err);
      // Don't show error on 404/empty, just empty list
      if (err.message && !err.message.includes('No threads')) {
        showError('Failed to load threads');
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (createAnother = false) => {
    if (!form.subject || !form.message || !form.department) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      await threadsAPI.createThread({
        subject: form.subject,
        department: form.department,
        priority: form.priority,
        message: form.message
      });

      showSuccess('Ticket created successfully');
      fetchThreads();

      if (createAnother) {
        setForm({ ...form, subject: '', message: '' });
      } else {
        setForm({ department: '', priority: 'Medium', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Error creating thread:', err);
      showError('Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  // Filter threads
  const filteredThreads = threads.filter(t =>
    (t.subject || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.ticket_id || '').toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredThreads.length;
  const paginatedThreads = filteredThreads.slice((page - 1) * pageSize, page * pageSize);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F97316';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#3B82F6';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'rgba(239, 68, 68, 0.1)';
      case 'high': return 'rgba(249, 115, 22, 0.1)';
      case 'medium': return 'rgba(59, 130, 246, 0.1)';
      case 'low': return 'rgba(16, 185, 129, 0.1)';
      default: return 'rgba(59, 130, 246, 0.1)';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <MessageSquare className="h-6 w-6 text-[var(--primary-cyan)]" />
            Support Tickets
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">
            Create and manage support requests and communications.
          </p>
        </div>
        <button
          onClick={fetchThreads}
          disabled={loading}
          className="premium-btn premium-btn-ghost"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Create Thread Form */}
      <div className="premium-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background-dark)] flex items-center gap-2">
          <Plus className="h-4 w-4 text-[var(--primary-cyan)]" />
          <h3 className="font-bold text-[var(--text-primary)]">Create New Ticket</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Department*</label>
            <select
              name="department"
              value={form.department}
              onChange={onChange}
              className="premium-input w-full"
            >
              <option value="">Select Department</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Billing & Payments">Billing & Payments</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={onChange}
              className="premium-input w-full"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Subject*</label>
            <input
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder="Brief summary of the issue..."
              className="premium-input w-full"
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Message*</label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows={3}
              placeholder="Describe your issue in detail..."
              className="premium-input w-full min-h-[100px]"
            />
          </div>
        </div>
        <div className="px-6 py-4 bg-[var(--background-dark)] border-t border-[var(--border)] flex justify-end gap-3">
          <button
            onClick={() => setForm({ department: '', priority: 'Medium', subject: '', message: '' })}
            className="premium-btn premium-btn-secondary"
            disabled={creating}
          >
            Cancel
          </button>
          <button
            onClick={() => handleCreate(false)}
            disabled={creating}
            className="premium-btn premium-btn-primary"
          >
            {creating ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </div>

      {/* Threads List */}
      <div className="premium-card">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-[var(--text-primary)]">Your Tickets</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input pl-10 py-1.5 text-sm w-full"
            />
          </div>
        </div>

        {loading && threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--border)] border-t-[var(--primary-cyan)]"></div>
            <p className="mt-4 text-[var(--text-muted)]">Loading tickets...</p>
          </div>
        ) : (
          <div className="premium-table-container rounded-none border-0">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {paginatedThreads.map((t) => (
                  <tr key={t.id} className="group cursor-pointer hover:bg-[var(--background-dark)]" onClick={() => { }}>
                    <td className="font-medium text-[var(--primary-cyan)]">
                      #{t.ticket_id || t.id.substring(0, 8)}
                    </td>
                    <td className="font-medium text-[var(--text-primary)] max-w-md truncate">
                      {t.subject}
                    </td>
                    <td className="text-[var(--text-secondary)]">{t.department}</td>
                    <td>
                      <span className="premium-badge bg-[var(--background-dark)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {t.status || 'Open'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="premium-badge"
                        style={{
                          backgroundColor: getPriorityBg(t.priority),
                          color: getPriorityColor(t.priority)
                        }}
                      >
                        {t.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="text-[var(--text-muted)] text-sm">
                      {new Date(t.updated_at || t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {paginatedThreads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)]">
                      {search ? 'No tickets found matching your search.' : 'No tickets created yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {total > 0 && (
          <div className="p-4 border-t border-[var(--border)]">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              pageSizeOptions={[20, 50]}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
