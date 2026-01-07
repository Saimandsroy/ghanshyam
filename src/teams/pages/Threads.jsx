import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Plus, X, Send, RefreshCw, Users, FileText, ChevronRight, User } from 'lucide-react';
import { teamAPI } from '../../lib/api';

export function Threads() {
  const [threads, setThreads] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    role: 'manager',
    user_id: '',
    subject: ''
  });
  const [newMessage, setNewMessage] = useState('');

  // Fetch threads
  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getThreads();
      setThreads(response.threads || []);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError(err.message || 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch managers list
  const fetchManagers = useCallback(async () => {
    try {
      const response = await teamAPI.getManagers();
      setManagers(response.managers || []);
    } catch (err) {
      console.error('Error fetching managers:', err);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
    fetchManagers();
  }, [fetchThreads, fetchManagers]);

  // Create thread
  const handleCreateThread = async () => {
    if (!formData.user_id) {
      setError('Please select a manager');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }

    try {
      setSubmitting(true);
      await teamAPI.createThread({
        user_id: parseInt(formData.user_id),
        subject: formData.subject
      });
      setSuccess('Thread created successfully!');
      setShowCreateModal(false);
      setFormData({ role: 'manager', user_id: '', subject: '' });
      fetchThreads();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create thread');
    } finally {
      setSubmitting(false);
    }
  };

  // View thread
  const handleViewThread = async (thread) => {
    try {
      setSelectedThread(thread);
      setShowViewModal(true);
      setMessagesLoading(true);
      const response = await teamAPI.getThreadMessages(thread.id);
      setMessages(response.messages || []);
      // Scroll to bottom
      setTimeout(() => {
        const container = document.getElementById('messages-container');
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSubmitting(true);
      await teamAPI.sendMessage(selectedThread.id, newMessage);
      setNewMessage('');
      const response = await teamAPI.getThreadMessages(selectedThread.id);
      setMessages(response.messages || []);
      // Scroll to bottom
      setTimeout(() => {
        const container = document.getElementById('messages-container');
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <span>Threads</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--text-primary)]">{showCreateModal ? 'Create New' : 'All Threads'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/20">
              <MessageSquare className="h-6 w-6 text-[var(--primary-cyan)]" />
            </div>
            {showCreateModal ? 'Create New Ticket' : 'Support Threads'}
          </h1>
          <p className="text-[var(--text-muted)] mt-1 ml-12">
            {showCreateModal ? 'Start a new conversation with a manager' : 'Manage your communications with managers'}
          </p>
        </div>

        <div className="flex gap-3">
          {!showCreateModal && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="premium-btn bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90 shadow-[0_0_15px_rgba(6,182,212,0.3)] group"
            >
              <Plus className="h-4 w-4 transform group-hover:rotate-90 transition-transform duration-300" />
              New Thread
            </button>
          )}
          <button
            onClick={fetchThreads}
            disabled={loading}
            className="premium-btn bg-[var(--background-dark)] border border-[var(--border)] hover:bg-[var(--card-background)] text-[var(--text-secondary)] px-3"
            title="Refresh Threads"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="premium-card p-4 border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3 animate-in slide-in-from-top-2">
          <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError('')} className="hover:text-red-300"><X className="h-4 w-4" /></button>
        </div>
      )}

      {success && (
        <div className="premium-card p-4 border-green-500/20 bg-green-500/10 text-green-400 flex items-center gap-3 animate-in slide-in-from-top-2">
          <span className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
          <p>{success}</p>
        </div>
      )}

      {/* Create Thread Form */}
      {showCreateModal && (
        <div className="premium-card p-8 max-w-2xl mx-auto border-[var(--primary-cyan)]/20 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[var(--primary-cyan)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">New Thread Details</h2>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Role Field */}
            <div className="space-y-2">
              <label className="premium-label">Recipient Role <span className="text-red-400">*</span></label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="premium-input w-full appearance-none"
              >
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* User Field */}
            <div className="space-y-2">
              <label className="premium-label">Select Manager <span className="text-red-400">*</span></label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="premium-input w-full pl-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                >
                  <option value="">Select a manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="premium-label">Subject <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your inquiry..."
                className="premium-input w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setShowCreateModal(false)}
              className="premium-btn bg-transparent border border-[var(--border)] hover:bg-[var(--background-dark)] text-[var(--text-secondary)] order-2 sm:order-1"
            >
              Cancel
            </button>
            <div className="flex gap-3 order-1 sm:order-2 ml-auto">
              <button
                onClick={() => {
                  handleCreateThread();
                  if (!error) setFormData({ role: 'manager', user_id: '', subject: '' });
                }}
                disabled={submitting}
                className="premium-btn bg-[var(--background-dark)] border border-[var(--primary-cyan)]/30 hover:border-[var(--primary-cyan)] text-[var(--primary-cyan)] hover:bg-[var(--primary-cyan)]/5"
              >
                Create & Add Another
              </button>
              <button
                onClick={handleCreateThread}
                disabled={submitting}
                className="premium-btn bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Create Thread
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Threads List */}
      {!showCreateModal && (
        <>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <RefreshCw className="h-8 w-8 animate-spin mb-4 text-[var(--primary-cyan)]" />
              <p>Loading threads...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="premium-card p-12 text-center border-dashed border-2 border-[var(--border)] bg-transparent">
              <div className="w-16 h-16 rounded-full bg-[var(--background-dark)] flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                <MessageSquare className="h-8 w-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-xl font-medium text-[var(--text-primary)] mb-2">No threads yet</p>
              <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">Start a conversation with a manager to get support or discuss tasks.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="premium-btn bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90"
              >
                <Plus className="h-4 w-4" /> Create First Thread
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleViewThread(thread)}
                  className="premium-card p-5 cursor-pointer hover:border-[var(--primary-cyan)] hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all group flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-cyan)]/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 text-[var(--primary-cyan)] font-bold border border-[var(--primary-cyan)]/30">
                    {thread.user_name ? thread.user_name.charAt(0).toUpperCase() : 'M'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-[var(--text-primary)] truncate pr-4 group-hover:text-[var(--primary-cyan)] transition-colors">
                        {thread.subject}
                      </h3>
                      <span className="premium-badge bg-[var(--background-dark)] border-[var(--border)] text-[var(--text-muted)] text-xs flex items-center gap-1 whitespace-nowrap">
                        {new Date(thread.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <User className="h-3.5 w-3.5" />
                        <span>To: {thread.user_name || 'Manager'}</span>
                      </div>

                      <span className="premium-badge bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] border-[var(--primary-cyan)]/20 text-xs px-2.5 py-0.5">
                        {thread.message_count || 0} messages
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-[var(--text-muted)] group-hover:text-[var(--primary-cyan)] self-center transition-colors" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View Thread Modal */}
      {showViewModal && selectedThread && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="premium-card w-full max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden shadow-2xl border-[var(--primary-cyan)]/20">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-[var(--border)] bg-[var(--card-background)] flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-cyan)]/10 flex items-center justify-center text-[var(--primary-cyan)] font-bold border border-[var(--primary-cyan)]/30">
                  {selectedThread.user_name ? selectedThread.user_name.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{selectedThread.subject}</h3>
                  <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                    <span>To: <span className="text-[var(--text-secondary)]">{selectedThread.user_name || 'Manager'}</span></span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
                    <span>Started {new Date(selectedThread.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 rounded-lg hover:bg-[var(--background-dark)] text-[var(--text-muted)] hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              id="messages-container"
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#0F1115]"
            >
              {messagesLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-[var(--primary-cyan)]/50" />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-60">
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  // Determine if the message is from the current user (team member)
                  // Assuming "Team" role sends messages that should be on the right
                  // Or checking if sender_name matches user name? 
                  // For now, let's style based on basic logic or backend data if available.
                  // Usually backend returns 'sender_type' or we can infer.
                  // Since we don't have sender_type here, we'll try to guess or use neutral styling.
                  // BUT, standard chat UI puts user on right, others on left.
                  // Let's assume teamAPI.sendMessage adds a message from 'me'. 
                  // Backend likely returns 'sender_id' or 'sender_role'.

                  // Let's use a logic: If I created it, my messages are on right? No.
                  // Let's stick to a clean linear design if we can't be sure, 
                  // OR use a neutral card style for everyone but highlight 'Manager' vs 'Team'.

                  const isManager = msg.sender_role === 'manager' || msg.sender_role === 'admin';
                  const isMe = !isManager; // Assuming I am 'team'

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${isMe
                            ? 'bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/20 rounded-tr-sm text-[var(--text-primary)]'
                            : 'bg-[#1E2024] border border-[var(--border)] rounded-tl-sm text-[var(--text-secondary)]'
                          }`}
                      >
                        <div className={`flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider ${isMe ? 'text-[var(--primary-cyan)] justify-end' : 'text-[var(--text-muted)]'}`}>
                          {!isMe && <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">M</div>}
                          {msg.sender_name || 'User'}
                          {isMe && <div className="w-5 h-5 rounded-full bg-[var(--primary-cyan)] flex items-center justify-center text-[10px] text-black">Me</div>}
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className={`text-[10px] mt-2 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Reply Input */}
            <div className="p-4 md:p-6 bg-[var(--card-background)] border-t border-[var(--border)]">
              <div className="relative">
                <textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="premium-input w-full min-h-[50px] max-h-[150px] pr-12 py-3 resize-none scrollbar-hide"
                  style={{ height: 'auto' }}
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={submitting || !newMessage.trim()}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-[var(--primary-cyan)] text-black hover:bg-[var(--primary-cyan)]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
                Press <kbd className="px-1 py-0.5 rounded bg-[var(--background-dark)] border border-[var(--border)] text-[var(--text-secondary)] font-mono">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-[var(--background-dark)] border border-[var(--border)] text-[var(--text-secondary)] font-mono">Shift + Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Threads;
