import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { adminAPI } from '../../lib/api';

// Default permissions list based on team dashboard features
const PERMISSION_KEYS = [
    { key: 'profile', label: 'Profile' },
    { key: 'rejected_links', label: 'Rejected Links' },
    { key: 'create_new_thread', label: 'Create New Thread' },
    { key: 'order_added_notification', label: 'Order Added Notification' },
    { key: 'completed_orders', label: 'Completed Orders' },
    { key: 'view_threads', label: 'View Threads' },
];

export function UserPermissions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user permissions
    const fetchPermissions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminAPI.getUserPermissions(id);
            setUserName(response.user_name || 'User');
            setPermissions(response.permissions || {});
        } catch (err) {
            console.error('Error fetching permissions:', err);
            setError(err.message || 'Failed to load permissions');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // Auto-hide success message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Toggle permission
    const togglePermission = (key) => {
        setPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Save permissions
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            await adminAPI.updateUserPermissions(id, permissions);
            setSuccessMessage('Permissions updated successfully!');
        } catch (err) {
            console.error('Error saving permissions:', err);
            setError(err.message || 'Failed to save permissions');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/team-members')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Shield className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
                        User Permissions
                    </h2>
                    {userName && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Managing permissions for <strong>{userName}</strong>
                        </p>
                    )}
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                    <span className="text-green-400">✓</span>
                    <p className="text-green-400">{successMessage}</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                    <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading permissions...</p>
                </div>
            )}

            {/* Permissions Grid */}
            {!loading && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        Dashboard Permissions
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                        Control what this team member can access in their dashboard
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PERMISSION_KEYS.map(({ key, label }) => (
                            <label
                                key={key}
                                className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)' }}
                            >
                                <input
                                    type="checkbox"
                                    checked={permissions[key] ?? true}
                                    onChange={() => togglePermission(key)}
                                    className="w-5 h-5 rounded"
                                    style={{ accentColor: 'var(--primary-orange)' }}
                                />
                                <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                            </label>
                        ))}
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                            style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Permissions
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/admin/team-members')}
                            className="px-6 py-2 rounded-xl font-medium transition-colors hover:bg-white/10"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
