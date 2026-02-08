import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Users2, Filter, RotateCcw, Shield, Key, X, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { adminAPI } from '../../lib/api';

const TEAM_ROLES = ['Team', 'Manager', 'Writer'];
const CREATE_ROLES = ['Manager', 'Writer', 'Blogger'];

export function TeamMembers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: 'all', name: '', email: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Password Modal State
  const [passwordModal, setPasswordModal] = useState({ open: false, userId: null, userName: '' });
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ role: '', name: '', email: '', password: '' });
  const [createLoading, setCreateLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all three roles separately and combine
      // Backend pagination returns only 50 records, so we need to filter by role on the server side
      const [teamRes, managerRes, writerRes] = await Promise.all([
        adminAPI.getUsers({ role: 'Team', limit: 100 }),
        adminAPI.getUsers({ role: 'Manager', limit: 100 }),
        adminAPI.getUsers({ role: 'Writer', limit: 100 })
      ]);

      const allTeamMembers = [
        ...(teamRes.users || []),
        ...(managerRes.users || []),
        ...(writerRes.users || [])
      ];

      setUsers(allTeamMembers);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter users
  const rows = useMemo(() => {
    let r = users;
    if (filters.role !== 'all') r = r.filter(m => m.role === filters.role);
    if (filters.name) r = r.filter(m => (m.name || '').toLowerCase().includes(filters.name.toLowerCase()));
    if (filters.email) r = r.filter(m => (m.email || '').toLowerCase().includes(filters.email.toLowerCase()));
    return r;
  }, [users, filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  // Reset filters
  const resetFilters = () => {
    setFilters({ role: 'all', name: '', email: '' });
    setPage(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Action: Reset password to default
  const handleResetPassword = async (userId, userName) => {
    if (actionLoading) return;
    setActionLoading(userId);
    try {
      await adminAPI.resetUserPassword(userId);
      setSuccessMessage(`Password for ${userName} reset to 12345678`);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setActionLoading(null);
    }
  };

  // Action: Change password (custom)
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setActionLoading(passwordModal.userId);
    try {
      await adminAPI.changeUserPassword(passwordModal.userId, newPassword);
      setSuccessMessage(`Password for ${passwordModal.userName} changed successfully`);
      setPasswordModal({ open: false, userId: null, userName: '' });
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setActionLoading(null);
    }
  };

  // Action: Navigate to permissions page
  const handleOpenPermissions = (userId) => {
    navigate(`/admin/users/${userId}/permissions`);
  };

  // Action: Toggle account status (Active/Blocked)
  const handleToggleStatus = async (userId, userName, currentStatus) => {
    if (actionLoading) return;
    setActionLoading(`status-${userId}`);
    const newStatus = currentStatus ? 0 : 1; // Toggle: 1 = Active, 0 = Blocked
    try {
      await adminAPI.updateUser(userId, { status: newStatus });
      setSuccessMessage(`${userName} is now ${newStatus === 1 ? 'Active' : 'Blocked'}`);
      // Update local state
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_active: newStatus === 1, status: newStatus } : u
      ));
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // Action: Create new user
  const handleCreateUser = async (createAnother = false) => {
    if (!createForm.role) {
      setError('Please select a role');
      return;
    }
    if (!createForm.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!createForm.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!createForm.password || createForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setCreateLoading(true);
    try {
      await adminAPI.createUser({
        name: createForm.name,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role
      });
      setSuccessMessage(`Team member ${createForm.name} created successfully!`);
      if (createAnother) {
        setCreateForm({ role: '', name: '', email: '', password: '' });
      } else {
        setShowCreateModal(false);
        setCreateForm({ role: '', name: '', email: '', password: '' });
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Users2 className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Team Members
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/team-members/add')}
            className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm"
            style={{ backgroundColor: '#22c55e', color: 'white' }}
          >
            <UserPlus className="h-4 w-4" />
            Add Team Member
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </button>
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
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters Section */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        {/* Filter Header */}
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" style={{ color: 'var(--primary-cyan)' }} />
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</span>
            {(filters.role !== 'all' || filters.name || filters.email) && (
              <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--primary-cyan)', color: 'var(--background-dark)' }}>
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} member(s)</span>
            {filtersExpanded ? (
              <ChevronUp className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
        </button>

        {/* Filter Content */}
        {filtersExpanded && (
          <div className="p-4 pt-0 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Role</label>
                <select
                  value={filters.role}
                  onChange={e => { setFilters({ ...filters, role: e.target.value }); setPage(1); }}
                  className="w-full rounded-xl px-3 py-2"
                  style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  <option value="all">All Roles</option>
                  {TEAM_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Name</label>
                <input
                  value={filters.name}
                  onChange={e => { setFilters({ ...filters, name: e.target.value }); setPage(1); }}
                  placeholder="Search name..."
                  className="w-full rounded-xl px-3 py-2"
                  style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                <input
                  value={filters.email}
                  onChange={e => { setFilters({ ...filters, email: e.target.value }); setPage(1); }}
                  placeholder="Search email..."
                  className="w-full rounded-xl px-3 py-2"
                  style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
                  style={{ color: 'var(--error)' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && users.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading team members...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Name</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Email</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Role</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Last Login</th>
                <th className="text-center px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Login Counts</th>
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Account Status</th>
                <th className="text-center px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(m => (
                <tr key={m.id}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{m.name || 'N/A'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(m.last_login)}
                  </td>
                  <td className="px-4 py-3 text-center" style={{ color: 'var(--text-primary)' }}>
                    <span className="font-medium">{m.login_count || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Toggle Switch for Account Status */}
                    <button
                      onClick={() => handleToggleStatus(m.id, m.name, m.is_active)}
                      disabled={actionLoading === `status-${m.id}`}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                      style={{
                        backgroundColor: m.is_active ? '#22c55e' : '#475569'
                      }}
                      title={m.is_active ? 'Click to block' : 'Click to activate'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${m.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                    <span
                      className="ml-2 text-xs"
                      style={{ color: m.is_active ? 'var(--success)' : 'var(--error)' }}
                    >
                      {m.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Reset Password Icon */}
                      <button
                        onClick={() => handleResetPassword(m.id, m.name)}
                        disabled={actionLoading === m.id}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors group relative"
                        title="Reset password to 12345678"
                      >
                        <RotateCcw
                          className={`h-4 w-4 ${actionLoading === m.id ? 'animate-spin' : ''}`}
                          style={{ color: 'var(--primary-orange)' }}
                        />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-black/80 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Reset password to 12345678
                        </span>
                      </button>

                      {/* Permissions Icon */}
                      <button
                        onClick={() => handleOpenPermissions(m.id)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Manage permissions"
                      >
                        <Shield className="h-4 w-4" style={{ color: 'var(--primary-cyan)' }} />
                      </button>

                      {/* Change Password Icon */}
                      <button
                        onClick={() => setPasswordModal({ open: true, userId: m.id, userName: m.name })}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Change password"
                      >
                        <Key className="h-4 w-4" style={{ color: 'var(--success)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No members found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          pageSizeOptions={[20, 50]}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      )}

      {/* Password Change Modal */}
      {passwordModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Change Password
              </h3>
              <button
                onClick={() => { setPasswordModal({ open: false, userId: null, userName: '' }); setNewPassword(''); }}
                className="p-1 rounded hover:bg-white/10"
              >
                <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Set a new password for <strong>{passwordModal.userName}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                className="w-full rounded-xl px-3 py-2"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--primary-orange)', color: 'var(--text-primary)' }}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                disabled={actionLoading === passwordModal.userId}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
              >
                {actionLoading === passwordModal.userId ? 'Saving...' : 'Submit'}
              </button>
              <button
                onClick={() => { setPasswordModal({ open: false, userId: null, userName: '' }); setNewPassword(''); }}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
                style={{ color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 w-full max-w-3xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Users › Create</p>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Add Team Member
                </h3>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); setCreateForm({ role: '', name: '', email: '', password: '' }); }}
                className="p-1 rounded hover:bg-white/10"
              >
                <X className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            {/* Form Section */}
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Team Member</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Role<span className="text-red-400">*</span></label>
                  <select
                    value={createForm.role}
                    onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full rounded-lg px-3 py-2"
                    style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'black' }}
                  >
                    <option value="">Select an option</option>
                    {CREATE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Name<span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full rounded-lg px-3 py-2"
                    style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'black' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Email<span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full rounded-lg px-3 py-2"
                    style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'black' }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Password<span className="text-red-400">*</span></label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full rounded-lg px-3 py-2"
                    style={{ backgroundColor: 'white', border: '1px solid var(--border)', color: 'black' }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCreateUser(false)}
                disabled={createLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}
              >
                {createLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => handleCreateUser(true)}
                disabled={createLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Create & create another
              </button>
              <button
                onClick={() => { setShowCreateModal(false); setCreateForm({ role: '', name: '', email: '', password: '' }); }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
