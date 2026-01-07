import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Edit2, Trash2, Search, Users as UsersIcon } from 'lucide-react';
import { adminAPI } from '../../lib/api';

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Blogger' });

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminAPI.getUsers({ role: roleFilter });
            setUsers(response.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filter users
    const filteredUsers = users.filter(u => {
        const matchesSearch = !searchTerm ||
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / pageSize);
    const pageData = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    // Role badge styling
    const getRoleBadge = (role) => {
        const colors = {
            'Admin': { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
            'Manager': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
            'Team': { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
            'Writer': { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
            'Blogger': { bg: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' },
        };
        const style = colors[role] || { bg: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF' };
        return (
            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: style.bg, color: style.color }}>
                {role}
            </span>
        );
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await adminAPI.updateUser(editingUser.id, formData);
            } else {
                await adminAPI.createUser(formData);
            }
            setShowAddModal(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'Blogger' });
            fetchUsers();
        } catch (err) {
            alert(err.message || 'Failed to save user');
        }
    };

    // Handle delete
    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminAPI.deleteUser(userId);
            fetchUsers();
        } catch (err) {
            alert(err.message || 'Failed to delete user');
        }
    };

    // Open edit modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setShowAddModal(true);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <UsersIcon className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
                    User Management
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', role: 'Blogger' }); setShowAddModal(true); }}
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}
                    >
                        <Plus className="h-4 w-4" /> Add User
                    </button>
                    <button onClick={fetchUsers} disabled={loading} className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50">
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <p className="text-red-400">{error}</p>
                    <button onClick={fetchUsers} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)' }}>Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="rounded-2xl p-4 flex flex-wrap gap-3" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full rounded-xl pl-10 pr-3 py-2"
                        style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                    className="rounded-xl px-3 py-2"
                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Team">Team</option>
                    <option value="Writer">Writer</option>
                    <option value="Blogger">Blogger</option>
                </select>
                <span className="text-sm self-center" style={{ color: 'var(--text-muted)' }}>{total} users</span>
            </div>

            {/* Loading */}
            {loading && users.length === 0 && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                    <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading users...</p>
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                            <tr>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>ID</th>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Name</th>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Email</th>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Role</th>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Status</th>
                                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Balance</th>
                                <th className="px-4 py-3 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-white/5">
                                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>#{user.id}</td>
                                    <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{user.name || user.username}</td>
                                    <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                                    <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded text-xs" style={{
                                            backgroundColor: user.is_active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                            color: user.is_active ? '#22C55E' : '#EF4444'
                                        }}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>${user.wallet_balance || 0}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => openEditModal(user)} className="p-1 rounded hover:bg-white/10 mr-1" title="Edit">
                                            <Edit2 className="h-4 w-4" style={{ color: 'var(--primary-cyan)' }} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-1 rounded hover:bg-white/10" title="Delete">
                                            <Trash2 className="h-4 w-4" style={{ color: 'var(--error)' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pageData.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-3">
                    <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="rounded-lg px-3 py-2 text-sm"
                        style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >Previous</button>
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                        >Next</button>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
                    <div className="rounded-2xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
                        onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full rounded-lg px-3 py-2"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full rounded-lg px-3 py-2"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                                    Password {editingUser && <span className="text-xs">(leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                    className="w-full rounded-lg px-3 py-2"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full rounded-lg px-3 py-2"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                >
                                    <option value="Blogger">Blogger</option>
                                    <option value="Writer">Writer</option>
                                    <option value="Team">Team</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm"
                                    style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                >Cancel</button>
                                <button type="submit"
                                    className="px-4 py-2 rounded-lg text-sm font-medium"
                                    style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}
                                >{editingUser ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
