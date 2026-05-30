import React, { useState, useEffect, useCallback } from 'react';
import { clientAPI } from '../../lib/api';
import { RefreshCw, Globe, X, Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export function ViewSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Advanced Filter State (Matching Admin/Manager)
  const [filters, setFilters] = useState({
    domain: '', category: '', website_niche: '',
    fc_gp: '', fc_ne: '', new_arrival: '',
    da: { val: '', op: '' }, dr: { val: '', op: '' }, rd: { val: '', op: '' },
    traffic: { val: '', op: '' }, gp_price: { val: '', op: '' }, niche_edit_price: { val: '', op: '' }
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  // Fetch websites from client API
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pageSize === 'all' ? 100000 : pageSize
      };

      // Map filters to API params
      if (filters.domain) params.search_domain = filters.domain;
      if (filters.category) params.search_category = filters.category;
      if (filters.website_niche) params.search_niche = filters.website_niche;
      if (filters.fc_gp) params.filter_fc_gp = filters.fc_gp;
      if (filters.fc_ne) params.filter_fc_ne = filters.fc_ne;
      if (filters.new_arrival) params.filter_new_arrival = filters.new_arrival.toLowerCase();

      const appendRange = (key, stateKey) => {
        const { val, op } = filters[stateKey];
        if (val !== '' && op !== '') {
          params[`filter_${key}_val`] = val;
          params[`filter_${key}_op`] = op;
        }
      };
      appendRange('da', 'da');
      appendRange('dr', 'dr');
      appendRange('rd', 'rd');
      appendRange('traffic', 'traffic');
      appendRange('gp_price', 'gp_price');
      appendRange('niche_price', 'niche_edit_price');

      const response = await clientAPI.getSites(params);
      setSites(response.sites || []);
      setPagination(response.pagination || { total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Error fetching websites:', err);
      setError(err.message || 'Failed to load websites');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchSites();
  }, [page, pageSize, filters]);

  const updateFilter = (section, key, value) => {
    setPage(1);
    if (section) {
      setFilters(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const resetFilters = () => {
    setFilters({
      domain: '', category: '', website_niche: '',
      fc_gp: '', fc_ne: '', new_arrival: '',
      da: { val: '', op: '' }, dr: { val: '', op: '' }, rd: { val: '', op: '' },
      traffic: { val: '', op: '' }, gp_price: { val: '', op: '' }, niche_edit_price: { val: '', op: '' }
    });
    setPage(1);
  };

  // Check if a site is "NEW" (added within the last 30 days)
  const isSiteNew = (createdAt) => {
    if (!createdAt) return false;
    const addedDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return addedDate >= thirtyDaysAgo;
  };

  const showingFrom = (page - 1) * (pageSize === 'all' ? pagination.total : pageSize) + 1;
  const showingTo = pageSize === 'all' ? pagination.total : Math.min(page * pageSize, pagination.total);

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <Globe className="h-6 w-6 text-[var(--primary-cyan)]" />
            Available Sites
          </h2>
          <p className="text-sm mt-1 text-[var(--text-secondary)]">
            Browse {pagination.total} approved sites available for ordering
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
            </div>
            <input
              type="text"
              placeholder="Search domain..."
              value={filters.domain}
              onChange={(e) => updateFilter(null, 'domain', e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-[var(--primary-cyan)] focus:border-transparent outline-none transition-all w-64 premium-input"
            />
          </div>
          <button
            onClick={fetchSites}
            disabled={loading}
            className="premium-btn premium-btn-primary px-3 py-2 flex items-center"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-between">
          <p>{error}</p>
          <button onClick={fetchSites} className="text-sm font-medium hover:text-red-300">Retry</button>
        </div>
      )}

      {/* Main Layout: Sidebar + Table */}
      <div className="flex items-start gap-6 relative w-full">
        {/* 1. Filter Sidebar */}
        <aside className="group w-16 hover:w-72 transition-all duration-300 ease-in-out flex-shrink-0 bg-[var(--card-background)] border border-[var(--border)] rounded-xl overflow-hidden hidden lg:flex flex-col z-30 ring-1 ring-black/5 hover:ring-[var(--primary-cyan)]/30 hover:shadow-xl hover:shadow-[var(--primary-cyan)]/5 sticky top-4 h-[calc(100vh-120px)]">
          {/* Collapsed View Header */}
          <div className="h-16 flex items-center justify-center border-b border-[var(--border)] shrink-0 group-hover:justify-start group-hover:px-6 transition-all duration-300 w-72">
            <SlidersHorizontal className="h-5 w-5 text-[var(--primary-cyan)] shrink-0" />
            <h3 className="font-semibold text-[var(--text-primary)] ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 truncate">
              Filters
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 w-72 custom-scrollbar">
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={resetFilters} className="text-xs hover:underline text-[var(--primary-cyan)]">Reset All</button>
              </div>

              {/* Category Group */}
              <FilterSection title="Category / Niche">
                <input
                  placeholder="e.g. Technology"
                  value={filters.category}
                  onChange={(e) => updateFilter(null, 'category', e.target.value)}
                  className="w-full premium-input text-sm px-3 py-2 mb-2"
                />
                <input
                  placeholder="Sub-niche"
                  value={filters.website_niche}
                  onChange={(e) => updateFilter(null, 'website_niche', e.target.value)}
                  className="w-full premium-input text-sm px-3 py-2"
                />
              </FilterSection>

              {/* Metrics Group */}
              <FilterSection title="Metrics">
                <div className="space-y-4">
                  <RangeInput label="DA (Domain Authority)" state={filters.da} onChange={(k, v) => updateFilter('da', k, v)} />
                  <RangeInput label="DR (Domain Rating)" state={filters.dr} onChange={(k, v) => updateFilter('dr', k, v)} />
                  <RangeInput label="RD" state={filters.rd} onChange={(k, v) => updateFilter('rd', k, v)} />
                  <RangeInput label="Traffic" state={filters.traffic} onChange={(k, v) => updateFilter('traffic', k, v)} />
                </div>
              </FilterSection>

              {/* Price Group */}
              <FilterSection title="Budget (USD)">
                <div className="space-y-4">
                  <RangeInput label="GP Price" state={filters.gp_price} onChange={(k, v) => updateFilter('gp_price', k, v)} />
                  <RangeInput label="Niche Edit Price" state={filters.niche_edit_price} onChange={(k, v) => updateFilter('niche_edit_price', k, v)} />
                </div>
              </FilterSection>

              {/* Extra Attributes */}
              <FilterSection title="Attributes">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">FC GP Comp.</span>
                    <select value={filters.fc_gp} onChange={(e) => updateFilter(null, 'fc_gp', e.target.value)} className="bg-[var(--background-dark)] border border-[var(--border)] rounded px-2 py-1 text-xs outline-none focus:border-[var(--primary-cyan)]">
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">FC NE Comp.</span>
                    <select value={filters.fc_ne} onChange={(e) => updateFilter(null, 'fc_ne', e.target.value)} className="bg-[var(--background-dark)] border border-[var(--border)] rounded px-2 py-1 text-xs outline-none focus:border-[var(--primary-cyan)]">
                      <option value="">Any</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </FilterSection>
            </div>
          </div>
        </aside>

        {/* 2. Table Area */}
        <main className="flex-1 min-w-0 bg-[var(--card-background)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
          {/* Header/Controls */}
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="text-sm text-[var(--text-secondary)]">
              Showing <span className="text-[var(--primary-cyan)] font-medium">{showingFrom}-{showingTo}</span> of {pagination.total}
            </div>
            <PaginationControls
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto premium-table-container">
            <table className="premium-table w-full">
              <thead className="bg-[var(--background-dark)] sticky top-0 z-10 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                <tr>
                  <th className="p-4 text-left">Root Domain</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-center">DA</th>
                  <th className="p-4 text-center">DR</th>
                  <th className="p-4 text-center">RD</th>
                  <th className="p-4 text-center">Traffic</th>
                  <th className="p-4 text-center">Spam Score</th>
                  <th className="p-4 text-center">GP Price</th>
                  <th className="p-4 text-center">Niche Price</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {loading && sites.length === 0 ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <td key={j} className="p-4"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                      ))}
                    </tr>
                  ))
                ) : sites.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-[var(--text-muted)]">
                      <Globe className="h-12 w-12 mx-auto mb-3 opacity-30 animate-pulse text-[var(--primary-cyan)]" />
                      <p className="font-medium text-[var(--text-primary)]">No sites found</p>
                      <p className="text-xs mt-1">Try adjusting your filters</p>
                      <button onClick={resetFilters} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary-cyan)] text-black hover:opacity-90">Clear Filters</button>
                    </td>
                  </tr>
                ) : (
                  sites.map((site) => (
                    <tr key={site.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-emerald-400 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{site.root_domain}</span>
                          {isSiteNew(site.created_at) && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-orange-500 text-white uppercase tracking-wider shrink-0">NEW</span>}
                        </div>
                      </td>
                      <td className="p-4 text-xs max-w-[150px] truncate" title={site.category || site.website_niche}>
                        {site.category || site.website_niche || '-'}
                      </td>
                      <td className="p-4 text-center">{site.da || '-'}</td>
                      <td className="p-4 text-center">{site.dr || '-'}</td>
                      <td className="p-4 text-center">{site.rd || '-'}</td>
                      <td className="p-4 text-center font-mono">{site.traffic ? parseInt(site.traffic).toLocaleString() : '-'}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${parseInt(site.spam_score) > 10 ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                          {site.spam_score || '0'}%
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-emerald-400 font-medium">{site.gp_price ? `$${site.gp_price}` : '-'}</td>
                      <td className="p-4 text-center font-mono text-blue-400 font-medium">{site.niche_edit_price ? `$${site.niche_edit_price}` : '-'}</td>
                      <td className="p-4 text-center">
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

          {/* Bottom Pagination */}
          {sites.length > 0 && (
            <div className="p-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-sm text-[var(--text-muted)]">
                Showing {showingFrom}-{showingTo} of {pagination.total} sites
              </span>
              <PaginationControls
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-[var(--border)] pb-5 last:border-0">
      <h4 className="text-xs font-bold uppercase tracking-wide mb-3 text-[var(--text-secondary)]">{title}</h4>
      {children}
    </div>
  );
}

function RangeInput({ label, state, onChange }) {
  return (
    <div className="bg-[var(--background-dark)] rounded-lg p-2 border border-[var(--border)]">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="text-[var(--primary-cyan)]">{state.op} {state.val}</span>
      </div>
      <div className="flex gap-1">
        <select
          value={state.op}
          onChange={(e) => onChange('op', e.target.value)}
          className="w-1/3 bg-black/25 rounded px-1 py-1 text-xs border border-[var(--border)] outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)]"
        >
          <option value="">Op</option>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
        </select>
        <input
          type="number"
          placeholder="Val"
          value={state.val}
          onChange={(e) => onChange('val', e.target.value)}
          className="w-2/3 bg-black/25 rounded px-2 py-1 text-xs border border-[var(--border)] outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)]"
        />
      </div>
    </div>
  );
}

function PaginationControls({ page, totalPages, onPageChange, pageSize, onPageSizeChange }) {
  return (
    <div className="flex items-center gap-4">
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        className="bg-[var(--background-dark)] border border-[var(--border)] text-xs rounded-lg px-2 py-1.5 focus:outline-none text-[var(--text-primary)]"
      >
        <option value={50}>50 / page</option>
        <option value={100}>100 / page</option>
        <option value={200}>200 / page</option>
        <option value="all">View All</option>
      </select>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors text-[var(--text-primary)]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium w-6 text-center text-[var(--text-primary)]">{page}</div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors text-[var(--text-primary)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
