import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw, Globe, Eye, X, ExternalLink, Search, Filter } from 'lucide-react';
import { managerAPI } from '../../lib/api';
import { Layout } from '../components/layout/Layout';

export function Sites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '', domain: '', status: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedSite, setSelectedSite] = useState(null);

  // Fetch websites from manager API
  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await managerAPI.getWebsites({ page, limit: pageSize });
      setWebsites(response.sites || []);
      setPagination(response.pagination || { total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Error fetching websites:', err);
      setError(err.message || 'Failed to load websites');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchWebsites();
  }, [fetchWebsites]);

  // Filter websites (client-side for search)
  const rows = useMemo(() => {
    let r = websites;
    if (filters.category) {
      r = r.filter(x => (x.category || '').toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.domain) {
      r = r.filter(x => (x.root_domain || '').toLowerCase().includes(filters.domain.toLowerCase()));
    }
    if (filters.status) {
      r = r.filter(x => String(x.site_status) === filters.status);
    }
    return r;
  }, [websites, filters]);

  // Calculate showing range
  const showingFrom = (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, pagination.total);

  return (
    <Layout>
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[var(--text-secondary)]">View All Sites {'>'} List</div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              View All Sites
            </h1>
            <p className="text-[var(--text-muted)] mt-1">Manage and monitor all registered websites</p>
          </div>
          <button
            onClick={fetchWebsites}
            disabled={loading}
            className="premium-btn premium-btn-primary"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between">
            <p>{error}</p>
            <button onClick={fetchWebsites} className="text-sm font-medium hover:text-red-300">
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="premium-card p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Search Domain</label>
              <div className="relative">
                <input
                  placeholder="e.g. example.com..."
                  value={filters.domain}
                  onChange={(e) => { setFilters({ ...filters, domain: e.target.value }); }}
                  className="premium-input w-full pl-10"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Category</label>
              <input
                placeholder="e.g. Tech, Fashion..."
                value={filters.category}
                onChange={(e) => { setFilters({ ...filters, category: e.target.value }); }}
                className="premium-input w-full"
              />
            </div>

            <div className="w-full md:w-48 relative">
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1.5 block">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => { setFilters({ ...filters, status: e.target.value }); }}
                  className="premium-input w-full appearance-none cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">▼</div>
              </div>
            </div>

            <button
              onClick={() => { setFilters({ category: '', domain: '', status: '' }); }}
              className="premium-btn hover:bg-white/5 border border-transparent hover:border-white/10 px-4 mb-[1px]"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && websites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
            <RefreshCw className="h-10 w-10 animate-spin mb-4 text-[var(--primary-cyan)]" />
            <p>Loading websites data...</p>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="premium-table-container">
            <table className="premium-table w-full min-w-[1500px]">
              <thead>
                <tr>
                  <th>Root Domain</th>
                  <th className="text-center">Added on</th>
                  <th className="text-center">Metrics (DA/DR/RD)</th>
                  <th className="text-center">Traffic</th>
                  <th className="text-center">Spam</th>
                  <th className="text-center">GP Price</th>
                  <th className="text-center">Niche Price</th>
                  <th className="text-center">Status</th>
                  <th>Email</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-[var(--text-muted)]">
                      No websites found matching your filters
                    </td>
                  </tr>
                ) : (
                  rows.map((site) => (
                    <tr key={site.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${site.root_domain}&sz=32`}
                            alt=""
                            className="w-8 h-8 rounded bg-white/5 p-1"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div>
                            <div className="font-medium text-[var(--text-primary)]">{site.root_domain}</div>
                            <div className="text-xs text-[var(--text-muted)]">{site.category || 'General'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center text-xs text-[var(--text-secondary)]">
                        {site.created_at ? new Date(site.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="premium-metric-pill bg-blue-500/10 text-blue-400 border-blue-500/20" title="DA">
                            {site.da || '-'}
                          </div>
                          <div className="premium-metric-pill bg-purple-500/10 text-purple-400 border-purple-500/20" title="DR">
                            {site.dr || '-'}
                          </div>
                          <div className="premium-metric-pill bg-orange-500/10 text-orange-400 border-orange-500/20" title="RD">
                            {site.rd || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="text-center font-medium text-[var(--text-primary)]">
                        {site.traffic ? parseInt(site.traffic).toLocaleString() : '-'}
                      </td>
                      <td className="text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${parseInt(site.spam_score) > 10 ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                          {site.spam_score || '0'}%
                        </span>
                      </td>
                      <td className="text-center font-medium text-emerald-400">${site.gp_price || '0'}</td>
                      <td className="text-center font-medium text-emerald-400">${site.niche_edit_price || '0'}</td>
                      <td className="text-center">
                        {site.site_status === '1' || site.site_status === 1 ? (
                          <span className="premium-badge bg-green-500/10 text-green-400 border-green-500/20">
                            <span className="premium-badge-dot bg-green-500"></span> Active
                          </span>
                        ) : (
                          <span className="premium-badge bg-red-500/10 text-red-400 border-red-500/20">
                            <span className="premium-badge-dot bg-red-500"></span> Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-sm text-[var(--text-secondary)]">
                        {site.email || '-'}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedSite(site)}
                          className="premium-btn p-2 min-w-0"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 px-1">
          <div className="text-sm text-[var(--text-muted)]">
            Showing <span className="text-[var(--text-primary)]">{showingFrom}</span> to <span className="text-[var(--text-primary)]">{showingTo}</span> of <span className="text-[var(--text-primary)]">{pagination.total}</span> results
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-3">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="premium-input py-1 px-3 text-sm h-9"
              >
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="premium-btn py-1.5 px-3 text-sm h-9 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="flex items-center px-2 text-sm text-[var(--text-secondary)]">
                  Page {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="premium-btn py-1.5 px-3 text-sm h-9 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Site Details Modal */}
        {selectedSite && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="premium-card w-full max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Globe size={20} className="text-[var(--primary-cyan)]" />
                    {selectedSite.root_domain}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">{selectedSite.category}</p>
                </div>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-[var(--text-muted)] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailRow label="Website Niche" value={selectedSite.website_niche} />
                    <DetailRow label="Country Source" value={selectedSite.country_source} />
                    <DetailRow label="Paypal ID" value={selectedSite.paypal_id} />
                    <DetailRow label="Skype" value={selectedSite.skype} />
                    <DetailRow label="WhatsApp" value={selectedSite.whatsapp} />
                    <DetailRow label="Added On" value={selectedSite.created_at ? new Date(selectedSite.created_at).toLocaleDateString() : '-'} />
                  </div>

                  <div className="bg-[var(--background-dark)] rounded-xl p-4 border border-[var(--border)]">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Links</h4>
                    <div className="space-y-2">
                      <DetailRow label="Sample URL" value={selectedSite.sample_url} isLink />
                      <DetailRow label="Href URL" value={selectedSite.href_url} isLink />
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-6">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Site Metrics & Pricing</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricCard label="DA" value={selectedSite.da} />
                      <MetricCard label="DR" value={selectedSite.dr} />
                      <MetricCard label="RD" value={selectedSite.rd} />
                      <MetricCard label="Traffic" value={selectedSite.traffic} />
                      <MetricCard label="Spam Score" value={selectedSite.spam_score} color={parseInt(selectedSite.spam_score) > 10 ? 'text-red-400' : 'text-green-400'} />
                      <MetricCard label="GP Price" value={`$${selectedSite.gp_price || 0}`} color="text-emerald-400" />
                      <MetricCard label="Niche Price" value={`$${selectedSite.niche_edit_price || 0}`} color="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--background-dark)]/50 shrink-0">
                <button
                  onClick={() => setSelectedSite(null)}
                  className="w-full premium-btn py-2.5"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Helper Components
function DetailRow({ label, value, isLink }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="sm:w-32 flex-shrink-0 text-sm md:text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] pt-0.5">
        {label}
      </span>
      {isLink && value && value !== 'N/A' ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1.5 text-[var(--primary-cyan)] hover:underline break-all"
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-sm text-[var(--text-primary)] break-words">
          {value || 'N/A'}
        </span>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="rounded-xl p-3 bg-[var(--background-dark)] border border-[var(--border)] text-center hover:border-[var(--primary-cyan)]/30 transition-colors">
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</div>
      <div className={`font-bold text-lg ${color || 'text-[var(--text-primary)]'}`}>{value || '-'}</div>
    </div>
  );
}

export default Sites;
