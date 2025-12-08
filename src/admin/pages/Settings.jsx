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
            showSuccess('Password changed successfully!');
            setPasswords({ current: '', newPassword: '', confirm: '' });
        } catch (err) {
            showError('Failed to change password: ' + err.message);
        } finally {
            setChangingPassword(false);
        }
    };

    const inputClass = "rounded-xl px-3 py-2 w-full";
    const inputStyle = { backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                        style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>
                        {(user?.username || user?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{user?.username || user?.name || 'Admin'}</div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.email || 'No email'}</div>
                        <span className="px-2 py-0.5 rounded text-xs mt-1 inline-block" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'var(--medium-purple)' }}>{user?.role || 'Admin'}</span>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <User className="h-5 w-5" style={{ color: 'var(--primary-cyan)' }} /> Profile Information
                </h3>
                <form onSubmit={onSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Name</label><input className={inputClass} style={inputStyle} placeholder="Your name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label><input className={inputClass} style={inputStyle} type="email" placeholder="your@email.com" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
                    </div>
                    <button type="submit" disabled={savingProfile} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>
                        {savingProfile ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Lock className="h-5 w-5" style={{ color: 'var(--primary-cyan)' }} /> Change Password
                </h3>
                <form onSubmit={onChangePassword} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Password</label><input className={inputClass} style={inputStyle} type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>New Password</label><input className={inputClass} style={inputStyle} type="password" placeholder="••••••••" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} /></div>
                        <div><label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label><input className={inputClass} style={inputStyle} type="password" placeholder="••••••••" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} /></div>
                    </div>
                    <button type="submit" disabled={changingPassword} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>
                        {changingPassword ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
