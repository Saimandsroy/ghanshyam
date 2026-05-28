import React, { useState, useEffect, useCallback } from 'react';
import { clientAPI } from '../../lib/api';
import { Search, X, ChevronLeft, ChevronRight, Globe, ExternalLink, Filter } from 'lucide-react';

export function ViewSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // Filters
  const [filters, setFilters] = useState({ domain: '', category: '', traffic: '' });
  const [activeFilters, setActiveFilters] = useState({ domain: '', category: '', traffic: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: pageSize };
      if (activeFilters.domain) params.search_domain = activeFilters.domain;
      if (activeFilters.category) params.search_category = activeFilters.category;
      if (activeFilters.traffic) {
        params.filter_traffic_val = activeFilters.traffic;
        params.filter_traffic_op = '>';
      }

      const data = await clientAPI.getSites(params);
      setSites(data.sites || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to load sites:', err);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilters]);

  useEffect(() => { fetchSites(); }, [fetchSites]);

  const handleApplyFilters = () => {
    setActiveFilters({ ...filters });
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ domain: '', category: '', traffic: '' });
    setActiveFilters({ domain: '', category: '', traffic: '' });
    setPage(1);
  };

  const hasActiveFilters = activeFilters.domain || activeFilters.category || activeFilters.traffic;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Available Sites</h2>
          <p className="text-sm text-[var(--text-muted)]">{total} approved sites available for ordering</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
            showFilters || hasActiveFilters
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
          }`}
        >
          <Filter size={16} />
          Filters {hasActiveFilters && `(${[activeFilters.domain, activeFilters.category, activeFilters.traffic].filter(Boolean).length})`}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="premium-card p-5 border-emerald-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1.5 uppercase tracking-wider font-medium">Domain</label>
              <input type="text" placeholder="e.g. example.com" className="premium-input w-full"
                value={filters.domain} onChange={(e) => setFilters(f => ({ ...f, domain: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1.5 uppercase tracking-wider font-medium">Category</label>
              <input type="text" placeholder="e.g. Technology" className="premium-input w-full"
                value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1.5 uppercase tracking-wider font-medium">Min Traffic</label>
              <input type="number" placeholder="e.g. 1000" className="premium-input w-full"
                value={filters.traffic} onChange={(e) => setFilters(f => ({ ...f, traffic: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={handleApplyFilters} className="premium-btn bg-emerald-500 text-white h-[42px] px-6 font-medium">
                <Search className="h-4 w-4 mr-1.5 inline" /> Search
              </button>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="premium-btn bg-transparent border border-[var(--border)] h-[42px] px-3">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sites Table */}
      <div className="premium-card overflow-hidden">
        <div className="premium-table-container">
          <table className="premium-table">
            <thead className="sticky top-0 z-10 bg-[var(--background-dark)] shadow-sm">
              <tr>
                <th>Root Domain</th>
                <th>Category</th>
                <th>DA</th>
                <th>DR</th>
                <th>Traffic</th>
                <th>RD</th>
                <th>Spam Score</th>
                <th>GP Price</th>
                <th>Niche Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j}><div className="h-4 bg-[var(--background-dark)] rounded w-full"></div></td>
                    ))}
                  </tr>
                ))
              ) : sites.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-[var(--text-muted)]">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No sites found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                sites.map((site) => (
                  <tr key={site.id} className="hover:bg-white/5 transition-colors">
                    <td className="font-medium text-[var(--text-primary)]">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-emerald-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{site.root_domain}</span>
                      </div>
                    </td>
                    <td className="text-xs max-w-[150px] truncate" title={site.category || site.website_niche}>
                      {site.category || site.website_niche || '-'}
                    </td>
                    <td>{site.da || '-'}</td>
                    <td>{site.dr || '-'}</td>
                    <td className="font-mono">{site.traffic?.toLocaleString() || '-'}</td>
                    <td>{site.rd || '-'}</td>
                    <td>{site.spam_score || '-'}</td>
                    <td className="font-mono text-emerald-400 font-medium">{site.gp_price ? `$${site.gp_price}` : '-'}</td>
                    <td className="font-mono text-blue-400 font-medium">{site.niche_edit_price ? `$${site.niche_edit_price}` : '-'}</td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {site.website_status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && sites.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
            <span className="text-sm text-[var(--text-muted)]">
              Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total} sites
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30 transition-all">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 text-sm font-medium">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30 transition-all">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
