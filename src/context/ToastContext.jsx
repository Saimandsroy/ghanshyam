import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

// Toast types and their styling
const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        bgColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: 'rgba(34, 197, 94, 0.4)',
        iconColor: '#22C55E',
        textColor: '#22C55E'
    },
    error: {
        icon: AlertCircle,
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        iconColor: '#EF4444',
        textColor: '#EF4444'
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.4)',
        iconColor: '#F59E0B',
        textColor: '#F59E0B'
    },
    info: {
        icon: Info,
        bgColor: 'rgba(107, 240, 255, 0.15)',
        borderColor: 'rgba(107, 240, 255, 0.4)',
        iconColor: '#6BF0FF',
        textColor: '#6BF0FF'
    }
};

// Individual Toast component
function Toast({ id, message, type = 'info', onDismiss }) {
    const config = TOAST_TYPES[type] || TOAST_TYPES.info;
    const Icon = config.icon;

    return (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm animate-slide-in"
            style={{
                backgroundColor: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                minWidth: '300px',
                maxWidth: '450px'
            }}
        >
            <Icon className="h-5 w-5 flex-shrink-0" style={{ color: config.iconColor }} />
            <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {message}
            </p>
            <button
                onClick={() => onDismiss(id)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
                <X className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </button>
        </div>
    );
}

// Toast Container component
function ToastContainer({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

// Toast Provider component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();

        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const showSuccess = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const showError = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const showWarning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const showInfo = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const value = {
        toasts,
        addToast,
        dismissToast,
        dismissAll,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// CSS for animation (add to index.css)
// @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
// .animate-slide-in { animation: slide-in 0.3s ease-out; }
