import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw, Users2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { adminAPI } from '../../lib/api';

const TEAM_ROLES = ['Team', 'Manager', 'Writer'];

export function TeamMembers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: 'all', name: '', email: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUsers();
      // Filter for Team, Manager, Writer roles
      const teamMembers = (response.users || []).filter(u => TEAM_ROLES.includes(u.role));
      setUsers(teamMembers);
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Users2 className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Team Members
        </h2>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400">{error}</p>
          <button onClick={fetchUsers} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <select
            value={filters.role}
            onChange={e => { setFilters({ ...filters, role: e.target.value }); setPage(1); }}
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <option value="all">All Roles</option>
            {TEAM_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input
            value={filters.name}
            onChange={e => { setFilters({ ...filters, name: e.target.value }); setPage(1); }}
            placeholder="Name"
            className="rounded-xl px-3 py-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <input
            value={filters.email}
            onChange={e => { setFilters({ ...filters, email: e.target.value }); setPage(1); }}
            placeholder="Email"
            className="rounded-xl px-3 py-2 lg:col-span-2"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-3 items-center">
            <button onClick={() => { setFilters({ role: 'all', name: '', email: '' }); setPage(1); }} className="text-sm" style={{ color: 'var(--text-muted)' }}>Reset</button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{total} member(s)</span>
          </div>
        </div>
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
                <th className="text-left px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(m => (
                <tr key={m.id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{m.name || 'N/A'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{m.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: 'var(--background-dark)',
                        border: '1px solid var(--border)',
                        color: m.is_active ? 'var(--success)' : 'var(--error)'
                      }}
                    >
                      {m.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No members found</td>
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
    </div>
  );
}
