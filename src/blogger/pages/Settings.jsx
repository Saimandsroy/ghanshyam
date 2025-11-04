import React, { useState } from 'react';

export function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ old: '', next: '', confirm: '' });

  const onSaveProfile = (e) => { e.preventDefault(); alert('Profile saved (demo)'); };
  const onChangePassword = (e) => { e.preventDefault(); if (passwords.next !== passwords.confirm) { alert('Passwords do not match'); return; } alert('Password changed (demo)'); };

  const inputClass = "rounded-xl px-3 py-2 w-full";
  const inputStyle = { backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h2>

      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Profile</h3>
        <form onSubmit={onSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className={inputClass} style={inputStyle} placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
          <div className="md:col-span-2">
            <button className="px-4 py-2 rounded-md" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>Save</button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
        <form onSubmit={onChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className={inputClass} style={inputStyle} placeholder="Old Password" type="password" value={passwords.old} onChange={e => setPasswords({ ...passwords, old: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="New Password" type="password" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} />
          <input className={inputClass} style={inputStyle} placeholder="Confirm Password" type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
          <div className="md:col-span-3">
            <button className="px-4 py-2 rounded-md" style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}>Change</button>
          </div>
        </form>
      </div>
    </div>
  );
}
