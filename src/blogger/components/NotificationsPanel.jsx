import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bloggerAPI } from '../../lib/api';

export function NotificationsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await bloggerAPI.getNotifications();
            setNotifications(response.notifications || []);
            setUnreadCount(response.unread_count || 0);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when panel opens
    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mark single notification as read
    const markAsRead = async (notificationId) => {
        try {
            await bloggerAPI.markNotificationRead(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await bloggerAPI.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    // Handle notification click
    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        if (notification.action_url) {
            navigate(notification.action_url);
            setIsOpen(false);
        }
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-red-500 text-white px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 max-h-[400px] rounded-xl shadow-2xl overflow-hidden z-50"
                    style={{
                        backgroundColor: 'var(--card-background)',
                        border: '1px solid var(--border)'
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
                                style={{ color: 'var(--primary-cyan)' }}
                            >
                                <CheckCheck className="h-3 w-3" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[320px]">
                        {loading && notifications.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }} />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-8 w-8 mb-2" style={{ color: 'var(--text-muted)' }} />
                                <p style={{ color: 'var(--text-muted)' }}>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                                    style={{
                                        borderBottom: '1px solid var(--border)',
                                        backgroundColor: notification.is_read ? 'transparent' : 'rgba(107, 240, 255, 0.05)'
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{
                                                backgroundColor: notification.is_read
                                                    ? 'rgba(107, 240, 255, 0.1)'
                                                    : 'rgba(107, 240, 255, 0.2)'
                                            }}
                                        >
                                            <Bell className="h-4 w-4" style={{ color: 'var(--primary-cyan)' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-medium truncate"
                                                style={{ color: notification.is_read ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                                            >
                                                {notification.title}
                                            </p>
                                            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                                {formatTimeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationsPanel;
