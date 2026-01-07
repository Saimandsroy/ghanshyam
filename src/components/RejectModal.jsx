import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * RejectModal - Reusable rejection modal component
 * Displays a modal with a reason textarea for rejecting items
 */
export function RejectModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Reject Submission',
    description = 'Please provide a reason for rejection.',
    confirmText = 'Confirm Rejection',
    loading = false
}) {
    const [reason, setReason] = useState('');

    // Reset reason when modal opens
    useEffect(() => {
        if (isOpen) {
            setReason('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!reason.trim()) return;
        onConfirm(reason);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="premium-card w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-[var(--background-dark)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-[var(--text-secondary)] text-sm">{description}</p>

                    <div>
                        <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
                            Rejection Reason <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                            rows={4}
                            disabled={loading}
                            className="premium-input w-full resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="premium-btn premium-btn-outline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!reason.trim() || loading}
                        className="premium-btn bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RejectModal;
