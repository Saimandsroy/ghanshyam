import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';

/**
 * ApproveModal - Modal for approving tasks
 */
export function ApproveModal({ task, isOpen, onClose, onSubmit, submitting }) {
    const [notes, setNotes] = useState('');

    if (!isOpen || !task) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task.id, notes);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative w-full max-w-md rounded-2xl p-6"
                style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                        <CheckCircle className="h-6 w-6" style={{ color: '#22C55E' }} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Approve Task</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Task #{task.id}</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/10" disabled={submitting}>
                        <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes for this approval..."
                            rows={3}
                            className="w-full rounded-xl px-3 py-2 resize-none"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            disabled={submitting}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }} disabled={submitting}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            style={{ backgroundColor: '#22C55E', color: 'white' }}
                        >
                            {submitting ? 'Processing...' : <><CheckCircle className="h-4 w-4" /> Approve</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/**
 * RejectModal - Modal for rejecting tasks with reason
 */
export function RejectModal({ task, isOpen, onClose, onSubmit, submitting }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !task) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }
        onSubmit(task.id, reason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative w-full max-w-md rounded-2xl p-6"
                style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                        <XCircle className="h-6 w-6" style={{ color: '#EF4444' }} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Reject Task</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Task #{task.id}</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/10" disabled={submitting}>
                        <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Rejection Reason *</label>
                        <textarea
                            value={reason}
                            onChange={(e) => { setReason(e.target.value); setError(''); }}
                            placeholder="Explain why this task is being rejected..."
                            rows={4}
                            className="w-full rounded-xl px-3 py-2 resize-none"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: error ? '1px solid var(--error)' : '1px solid var(--border)',
                                color: 'var(--text-primary)'
                            }}
                            disabled={submitting}
                        />
                        {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
                    </div>

                    <div className="p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <AlertTriangle className="h-4 w-4 mt-0.5" style={{ color: '#F59E0B' }} />
                            <span>The assigned user will be notified of this rejection.</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }} disabled={submitting}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            style={{ backgroundColor: '#EF4444', color: 'white' }}
                        >
                            {submitting ? 'Processing...' : <><XCircle className="h-4 w-4" /> Reject Task</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/**
 * AssignWriterModal - Modal for assigning task to a writer
 */
export function AssignWriterModal({ task, writers, isOpen, onClose, onSubmit, submitting }) {
    const [writerId, setWriterId] = useState('');
    const [instructions, setInstructions] = useState('');
    const [error, setError] = useState('');

    if (!isOpen || !task) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!writerId) {
            setError('Please select a writer');
            return;
        }
        onSubmit(task.id, writerId, instructions);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div
                className="relative w-full max-w-md rounded-2xl p-6"
                style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <Send className="h-6 w-6" style={{ color: '#3B82F6' }} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Assign to Writer</h2>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Task #{task.id}</p>
                    </div>
                    <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/10" disabled={submitting}>
                        <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Select Writer *</label>
                        <select
                            value={writerId}
                            onChange={(e) => { setWriterId(e.target.value); setError(''); }}
                            className="w-full rounded-xl px-3 py-2"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: error ? '1px solid var(--error)' : '1px solid var(--border)',
                                color: 'var(--text-primary)'
                            }}
                            disabled={submitting}
                        >
                            <option value="">Choose a writer...</option>
                            {(writers || []).map(w => (
                                <option key={w.id} value={w.id}>{w.name || `Writer #${w.id}`}</option>
                            ))}
                        </select>
                        {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Instructions (optional)</label>
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Add writing instructions..."
                            rows={3}
                            className="w-full rounded-xl px-3 py-2 resize-none"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                            disabled={submitting}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--text-secondary)' }} disabled={submitting}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                            style={{ backgroundColor: '#3B82F6', color: 'white' }}
                        >
                            {submitting ? 'Assigning...' : <><Send className="h-4 w-4" /> Assign Writer</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
