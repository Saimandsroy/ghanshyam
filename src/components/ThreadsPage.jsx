import React, { useState, useEffect } from 'react';
import { threadsAPI } from '../lib/api';

/**
 * ThreadsPage - Shared Threads/Tickets UI for all panels
 * Provides full CRUD operations for threads and messages
 */
export const ThreadsPage = ({ userRole = 'User' }) => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedThread, setSelectedThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Filter state
    const [filter, setFilter] = useState('all');

    // Form state
    const [newThread, setNewThread] = useState({
        title: '',
        message: '',
        priority: 'Medium'
    });
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchThreads();
    }, [filter]);

    const fetchThreads = async () => {
        try {
            setLoading(true);
            const filters = filter !== 'all' ? { status: filter } : {};
            const data = await threadsAPI.getThreads(filters);
            setThreads(data.threads || []);
        } catch (err) {
            setError(err.message || 'Failed to load threads');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateThread = async () => {
        if (!newThread.title.trim() || !newThread.message.trim()) {
            setError('Title and message are required');
            return;
        }

        try {
            setSubmitting(true);
            await threadsAPI.createThread({
                title: newThread.title,
                message: newThread.message,
                priority: newThread.priority
            });
            setSuccess('Thread created successfully!');
            setShowCreateModal(false);
            setNewThread({ title: '', message: '', priority: 'Medium' });
            fetchThreads();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to create thread');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewThread = async (thread) => {
        try {
            setSelectedThread(thread);
            setShowViewModal(true);
            const data = await threadsAPI.getThread(thread.id);
            setMessages(data.messages || []);
        } catch (err) {
            setError(err.message || 'Failed to load thread details');
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            setSubmitting(true);
            await threadsAPI.addMessage(selectedThread.id, newMessage);
            setNewMessage('');
            // Refresh messages
            const data = await threadsAPI.getThread(selectedThread.id);
            setMessages(data.messages || []);
        } catch (err) {
            setError(err.message || 'Failed to send message');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (threadId, status) => {
        try {
            await threadsAPI.updateStatus(threadId, status);
            setSuccess('Status updated!');
            fetchThreads();
            if (selectedThread?.id === threadId) {
                setSelectedThread({ ...selectedThread, status });
            }
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/20 text-blue-400';
            case 'In Progress': return 'bg-yellow-500/20 text-yellow-400';
            case 'Resolved': return 'bg-green-500/20 text-green-400';
            case 'Closed': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'bg-red-500/20 text-red-400';
            case 'High': return 'bg-orange-500/20 text-orange-400';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
            case 'Low': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading threads...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Threads / Tickets</h1>
                    <p className="text-text-secondary">Communication and support tickets</p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-accent">
                    + New Thread
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400">
                    {error}
                    <button onClick={() => setError('')} className="ml-2 text-red-300">&times;</button>
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-400">
                    {success}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4">
                {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm ${filter === status
                                ? 'bg-accent text-white'
                                : 'bg-card hover:bg-card-secondary'
                            }`}
                    >
                        {status === 'all' ? 'All' : status}
                    </button>
                ))}
            </div>

            {/* Threads List */}
            {threads.length === 0 ? (
                <div className="card p-8 text-center">
                    <p className="text-text-secondary">No threads found.</p>
                    <button onClick={() => setShowCreateModal(true)} className="btn btn-accent mt-4">
                        Create Your First Thread
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {threads.map((thread) => (
                        <div
                            key={thread.id}
                            className="card p-4 hover:border-accent/50 cursor-pointer transition-all"
                            onClick={() => handleViewThread(thread)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">{thread.title}</h3>
                                    <p className="text-text-secondary text-sm mt-1">
                                        Created by {thread.creator_name || 'Unknown'} • {new Date(thread.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(thread.priority)}`}>
                                        {thread.priority}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(thread.status)}`}>
                                        {thread.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Thread Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold mb-4">Create New Thread</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Subject*</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    placeholder="Thread subject"
                                    value={newThread.title}
                                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Priority</label>
                                <select
                                    className="input w-full"
                                    value={newThread.priority}
                                    onChange={(e) => setNewThread({ ...newThread, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Message*</label>
                                <textarea
                                    className="input w-full h-32"
                                    placeholder="Describe your issue or question..."
                                    value={newThread.message}
                                    onChange={(e) => setNewThread({ ...newThread, message: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={handleCreateThread} disabled={submitting} className="btn btn-accent flex-1">
                                {submitting ? 'Creating...' : 'Create Thread'}
                            </button>
                            <button onClick={() => setShowCreateModal(false)} className="btn flex-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Thread Modal */}
            {showViewModal && selectedThread && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold">{selectedThread.title}</h2>
                                <p className="text-text-secondary text-sm">
                                    Created {new Date(selectedThread.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <select
                                    className="input text-sm"
                                    value={selectedThread.status}
                                    onChange={(e) => handleUpdateStatus(selectedThread.id, e.target.value)}
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <button onClick={() => setShowViewModal(false)} className="text-xl">&times;</button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-background rounded">
                            {messages.length === 0 ? (
                                <p className="text-text-secondary text-center">No messages yet</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className="bg-card-secondary p-3 rounded">
                                        <div className="flex justify-between text-sm text-text-secondary mb-1">
                                            <span className="font-medium">{msg.sender_name || 'Unknown'}</span>
                                            <span>{new Date(msg.created_at).toLocaleString()}</span>
                                        </div>
                                        <p>{msg.message}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Reply Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="input flex-1"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage} disabled={submitting} className="btn btn-accent">
                                {submitting ? '...' : 'Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThreadsPage;
