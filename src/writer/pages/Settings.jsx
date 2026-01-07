import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Lock, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Settings() {
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    const [profile, setProfile] = useState({ name: '', email: '' });
    const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({ name: user.username || user.name || '', email: user.email || '' });
        }
    }, [user]);

    const onSaveProfile = async (e) => {
        e.preventDefault();
        if (!profile.name || !profile.email) { showError('Name and email are required'); return; }
        try {
            setSavingProfile(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Profile updated successfully!');
        } catch (err) {
            showError('Failed to update profile: ' + err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const onChangePassword = async (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.newPassword || !passwords.confirm) { showError('All password fields are required'); return; }
        if (passwords.newPassword !== passwords.confirm) { showError('New passwords do not match'); return; }
        if (passwords.newPassword.length < 6) { showError('Password must be at least 6 characters'); return; }
        try {
            setChangingPassword(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Password changed successfully!');
            setPasswords({ current: '', newPassword: '', confirm: '' });
        } catch (err) {
            showError('Failed to change password: ' + err.message);
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
                    <SettingsIcon className="h-6 w-6 text-[var(--primary-cyan)]" />
                    Settings
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* User Profile Summary */}
            <div className="premium-card p-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-cyan)]/70 text-[var(--background-dark)] shadow-lg ring-4 ring-[var(--card-background)]">
                        {(user?.username || user?.name || 'W').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-xl text-[var(--text-primary)]">{user?.username || user?.name || 'Writer Account'}</div>
                        <div className="text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                            {user?.email || 'No email'}
                            <span className="premium-badge bg-[var(--background-dark)] text-[var(--primary-cyan)] uppercase text-xs tracking-wider font-bold border border-[var(--primary-cyan)]/20">
                                {user?.role || 'WRITER'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="premium-card">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--background-dark)] flex items-center gap-2">
                        <User className="h-4 w-4 text-[var(--primary-cyan)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">Profile Information</h3>
                    </div>
                    <div className="p-6">
                        <form onSubmit={onSaveProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Name</label>
                                <input
                                    className="premium-input w-full"
                                    placeholder="Your name"
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email</label>
                                <input
                                    className="premium-input w-full"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="premium-btn premium-btn-primary w-full justify-center"
                                >
                                    {savingProfile ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    {savingProfile ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Password Settings */}
                <div className="premium-card">
                    <div className="p-4 border-b border-[var(--border)] bg-[var(--background-dark)] flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[var(--primary-cyan)]" />
                        <h3 className="font-bold text-[var(--text-primary)]">Change Password</h3>
                    </div>
                    <div className="p-6">
                        <form onSubmit={onChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Current Password</label>
                                <input
                                    className="premium-input w-full"
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">New Password</label>
                                    <input
                                        className="premium-input w-full"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Confirm Password</label>
                                    <input
                                        className="premium-input w-full"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.confirm}
                                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="premium-btn premium-btn-secondary w-full justify-center"
                                >
                                    {changingPassword ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
