import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { adminAPI } from '../../lib/api';

// ====== Role-specific permission keys ======
// Each role maps to the sidebar sections that Admin can toggle on/off.
// The `key` must match the `permissionKey` used in the respective Layout/Sidebar component.

const ROLE_PERMISSIONS_MAP = {
    Team: [
        { key: 'order_added_notification', label: 'Order Notifications' },
        { key: 'completed_orders', label: 'Completed Orders' },
        { key: 'rejected_links', label: 'Rejected Links' },
        { key: 'view_threads', label: 'Threads' },
        { key: 'profile', label: 'Profile' },
    ],
    Writer: [
        { key: 'completed_orders', label: 'Completed Orders' },
        { key: 'order_notifications', label: 'Order Notifications' },
        { key: 'rejected_notifications', label: 'Rejected Notifications' },
        { key: 'threads', label: 'Threads' },
        { key: 'profile', label: 'Profile' },
    ],
    Manager: [
        { key: 'orders', label: 'Orders' },
        { key: 'pending_approval', label: 'Pending Approval' },
        { key: 'rejected_orders', label: 'Rejected Orders' },
        { key: 'threads', label: 'Threads' },
        { key: 'sites', label: 'Sites' },
        { key: 'profile', label: 'Profile' },
    ],
    Blogger: [
        { key: 'payments', label: 'Payments' },
        { key: 'sites', label: 'Sites' },
        { key: 'bulk_sites', label: 'Bulk Sites' },
        { key: 'orders', label: 'Orders' },
        { key: 'threads', label: 'Threads' },
    ],
    Accountant: [
        { key: 'wallet_bloggers', label: 'Bloggers Wallet' },
        { key: 'payment_history', label: 'Payment History' },
        { key: 'withdrawal_requests', label: 'Withdrawal Requests' },
    ],
};

// Map DB role names to App role names for lookup
const DB_ROLE_TO_APP = {
    team: 'Team',
    writer: 'Writer',
    manager: 'Manager',
    vendor: 'Blogger',
    blogger: 'Blogger',
    accountant: 'Accountant',
    admin: 'Admin',
};

export function UserPermissions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
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
            setUserName(response.user?.name || response.user_name || 'User');

            // Determine application role
            const rawRole = response.user?.role || response.permissions?.role || '';
            const appRole = DB_ROLE_TO_APP[rawRole.toLowerCase()] || rawRole;
            setUserRole(appRole);

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

    // Get the permission toggles for this user's role
    const permissionKeys = ROLE_PERMISSIONS_MAP[userRole] || [];

    // Role color badge
    const roleColors = {
        Team: { bg: 'rgba(107, 240, 255, 0.15)', color: '#6bf0ff' },
        Writer: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' },
        Manager: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' },
        Blogger: { bg: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' },
        Accountant: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
    };
    const roleBadge = roleColors[userRole] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' };

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
                        <p className="text-sm mt-1 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            Managing permissions for <strong>{userName}</strong>
                            {userRole && (
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: roleBadge.bg, color: roleBadge.color }}
                                >
                                    {userRole}
                                </span>
                            )}
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
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Dashboard Permissions
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                        Toggle which sidebar sections are visible for this {userRole || 'user'}'s dashboard
                    </p>

                    {permissionKeys.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {permissionKeys.map(({ key, label }) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)' }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={permissions[key] !== false}
                                        onChange={() => togglePermission(key)}
                                        className="w-5 h-5 rounded"
                                        style={{ accentColor: 'var(--primary-cyan)' }}
                                    />
                                    <span style={{ color: 'var(--text-primary)' }}>{label}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>
                            {userRole === 'Admin'
                                ? 'Admin users have full access. No dashboard permissions to configure.'
                                : 'No configurable permissions found for this role.'}
                        </p>
                    )}

                    {/* Save Button */}
                    {permissionKeys.length > 0 && (
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                style={{ backgroundColor: 'var(--primary-cyan)', color: 'white' }}
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
                    )}
                </div>
            )}
        </div>
    );
}
