import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Globe, Eye, X, ExternalLink, Search, SlidersHorizontal, ChevronDown, Settings, Check } from 'lucide-react';
import { managerAPI } from '../../lib/api';
import { Layout } from '../components/layout/Layout';

export function Sites() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Advanced Filter State (Matching Admin)
  const [filters, setFilters] = useState({
    domain: '', category: '', website_niche: '', email: '',
    status: '', website_status: '', fc_gp: '', fc_ne: '', new_arrival: '', added_on: '',
    da: { val: '', op: '' }, dr: { val: '', op: '' }, rd: { val: '', op: '' },
    traffic: { val: '', op: '' }, gp_price: { val: '', op: '' }, niche_edit_price: { val: '', op: '' }
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedSite, setSelectedSite] = useState(null);

  // Column Visibility State (Persisted)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('manager_sites_columns');
    return saved ? JSON.parse(saved) : {
      root_domain: true,
      added_on: true,
      metrics: true,
      traffic: true,
      spam: true,
      price: true,
      status: true,
      email: true,
      action: true
    };
  });

  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Toggle Column Handler
  const toggleColumn = (key) => {
    const newColumns = { ...visibleColumns, [key]: !visibleColumns[key] };
    setVisibleColumns(newColumns);
    localStorage.setItem('manager_sites_columns', JSON.stringify(newColumns));
  };

  // Fetch websites from manager API
  const fetchWebsites = useCallback(async () => {
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
      if (filters.email) params.search_email = filters.email;
      if (filters.status) params.filter_status = filters.status;
      if (filters.website_status) params.filter_website_status = filters.website_status;
      if (filters.fc_gp) params.filter_fc_gp = filters.fc_gp;
      if (filters.fc_ne) params.filter_fc_ne = filters.fc_ne;
      if (filters.new_arrival) params.filter_new_arrival = filters.new_arrival.toLowerCase();
      if (filters.added_on) params.filter_added_on = filters.added_on;

      const appendRange = (key, stateKey) => {
        const { val, op } = filters[stateKey];
        if (val !== '' && op !== '') {
          params[`filter_${key}_val`] = val;
          params[`filter_${key}_op`] = op;
        }
      };
      appendRange('da', 'da'); appendRange('dr', 'dr'); appendRange('rd', 'rd');
      appendRange('traffic', 'traffic'); appendRange('gp_price', 'gp_price'); appendRange('niche_price', 'niche_edit_price');

      const response = await managerAPI.getWebsites(params);
      setWebsites(response.sites || []);
      setPagination(response.pagination || { total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Error fetching websites:', err);
      setError(err.message || 'Failed to load websites');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchWebsites();
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
      domain: '', category: '', website_niche: '', email: '',
      status: '', website_status: '', fc_gp: '', fc_ne: '', new_arrival: '', added_on: '',
      da: { val: '', op: '' }, dr: { val: '', op: '' }, rd: { val: '', op: '' },
      traffic: { val: '', op: '' }, gp_price: { val: '', op: '' }, niche_edit_price: { val: '', op: '' }
    });
    setPage(1);
  };

  // Calculate showing range
  const showingFrom = (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, pagination.total);

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Top Header */}
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                View All Sites
              </h1>
              <p className="text-[var(--text-muted)] mt-1 text-sm">Manage and monitor all registered websites ({pagination.total})</p>
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

              {/* Column Toggle Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="premium-btn px-3 py-2 flex items-center gap-2"
                  title="Manage Columns"
                >
                  <Settings size={18} />
                  <span className="hidden sm:inline">Columns</span>
                </button>

                {showColumnMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--card-background)] border border-[var(--border)] rounded-xl shadow-xl z-20 p-2">
                      <div className="text-xs font-bold text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider mb-1">Visible Columns</div>
                      <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
                        {[
                          { key: 'root_domain', label: 'Root Domain' },
                          { key: 'added_on', label: 'Added On' },
                          { key: 'metrics', label: 'Metrics (DA/DR)' },
                          { key: 'traffic', label: 'Traffic' },
                          { key: 'spam', label: 'Spam Score' },
                          { key: 'price', label: 'Prices' },
                          { key: 'status', label: 'Status' },
                          { key: 'email', label: 'Email' },
                        ].map(col => (
                          <button
                            key={col.key}
                            onClick={() => toggleColumn(col.key)}
                            className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg hover:bg-white/5 transition-colors text-left"
                          >
                            <span className={visibleColumns[col.key] ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}>
                              {col.label}
                            </span>
                            {visibleColumns[col.key] && <Check size={14} className="text-[var(--primary-cyan)]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={fetchWebsites}
                disabled={loading}
                className="premium-btn premium-btn-primary px-3 py-2"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content (Sidebar + List) */}
        <div className="flex flex-1 overflow-hidden px-6 pb-6 gap-6">

          {/* Sidebar Filters */}
          <aside className="w-72 flex-shrink-0 bg-[var(--card-background)] border border-[var(--border)] rounded-xl overflow-y-auto custom-scrollbar p-4 hidden lg:block">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h3>
                <button onClick={resetFilters} className="text-xs hover:underline text-[var(--primary-cyan)]">Reset All</button>
              </div>

              {/* Status Group */}
              <FilterSection title="Status">
                <select value={filters.website_status} onChange={(e) => updateFilter(null, 'website_status', e.target.value)} className="w-full premium-input text-sm px-3 py-2">
                  <option value="">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </FilterSection>

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

              <FilterSection title="Metrics">
                <div className="space-y-4">
                  <RangeInput label="DA (Domain Authority)" state={filters.da} onChange={(k, v) => updateFilter('da', k, v)} />
                  <RangeInput label="DR (Domain Rating)" state={filters.dr} onChange={(k, v) => updateFilter('dr', k, v)} />
                  <RangeInput label="Traffic" state={filters.traffic} onChange={(k, v) => updateFilter('traffic', k, v)} />
                </div>
              </FilterSection>

              <FilterSection title="Budget (USD)">
                <div className="space-y-4">
                  <RangeInput label="GP Price" state={filters.gp_price} onChange={(k, v) => updateFilter('gp_price', k, v)} />
                  <RangeInput label="Niche Edit Price" state={filters.niche_edit_price} onChange={(k, v) => updateFilter('niche_edit_price', k, v)} />
                </div>
              </FilterSection>

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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">New Arrival</span>
                    <select value={filters.new_arrival} onChange={(e) => updateFilter(null, 'new_arrival', e.target.value)} className="bg-[var(--background-dark)] border border-[var(--border)] rounded px-2 py-1 text-xs outline-none focus:border-[var(--primary-cyan)]">
                      <option value="">Any</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Main List Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[var(--card-background)] border border-[var(--border)] rounded-xl overflow-hidden">

            {/* Error Banner */}
            {error && (
              <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 flex items-center justify-between">
                <p>{error}</p>
                <button onClick={fetchWebsites} className="text-sm font-medium hover:text-red-300">Retry</button>
              </div>
            )}

            {/* Table Header/Controls */}
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

            {/* Table Content */}
            <div className="flex-1 overflow-auto custom-scrollbar">
              {loading && websites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
                  <RefreshCw className="h-10 w-10 animate-spin mb-4 text-[var(--primary-cyan)]" />
                  <p>Loading websites...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[var(--background-dark)] sticky top-0 z-10 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    <tr>
                      {visibleColumns.root_domain && <th className="p-4">Root Domain</th>}
                      {visibleColumns.added_on && <th className="p-4 text-center">Added</th>}
                      {visibleColumns.metrics && <th className="p-4 text-center">Metrics</th>}
                      {visibleColumns.traffic && <th className="p-4 text-center">Traffic</th>}
                      {visibleColumns.spam && <th className="p-4 text-center">Spam</th>}
                      {visibleColumns.price && <th className="p-4 text-center">Price</th>}
                      {visibleColumns.status && <th className="p-4 text-center">Status</th>}
                      {visibleColumns.email && <th className="p-4">Email</th>}
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {websites.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-12 text-center text-[var(--text-muted)]">
                          <div className="text-4xl mb-4">🔍</div>
                          <p className="text-lg font-medium text-[var(--text-primary)]">No websites found</p>
                          <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
                          <button onClick={resetFilters} className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary-cyan)] text-black hover:opacity-90">Clear Filters</button>
                        </td>
                      </tr>
                    ) : (
                      websites.map((site) => (
                        <tr key={site.id} className="hover:bg-white/5 transition-colors group">

                          {/* ROOT DOMAIN */}
                          {visibleColumns.root_domain && (
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-[var(--primary-cyan)] font-bold text-xs border border-white/10">
                                  {site.root_domain.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                                    {site.root_domain}
                                    {site.new_arrival && <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-orange-500 text-white uppercase tracking-wider">NEW</span>}
                                  </div>
                                  <div className="text-xs text-[var(--text-secondary)]">{site.category || 'General'}</div>
                                </div>
                              </div>
                            </td>
                          )}

                          {/* ADDED ON */}
                          {visibleColumns.added_on && (
                            <td className="p-4 text-center text-xs text-[var(--text-secondary)]">
                              {site.created_at ? new Date(site.created_at).toLocaleDateString() : '-'}
                            </td>
                          )}

                          {/* METRICS */}
                          {visibleColumns.metrics && (
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <MetricBadge label="DA" value={site.da} color="blue" />
                                <MetricBadge label="DR" value={site.dr} color="purple" />
                                <MetricBadge label="RD" value={site.rd} color="orange" />
                              </div>
                            </td>
                          )}

                          {/* TRAFFIC */}
                          {visibleColumns.traffic && (
                            <td className="p-4 text-center font-medium text-[var(--text-primary)] text-sm">
                              {site.traffic ? parseInt(site.traffic).toLocaleString() : '-'}
                            </td>
                          )}

                          {/* SPAM */}
                          {visibleColumns.spam && (
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs ${parseInt(site.spam_score) > 10 ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                                {site.spam_score || '0'}%
                              </span>
                            </td>
                          )}

                          {/* PRICE */}
                          {visibleColumns.price && (
                            <td className="p-4 text-center">
                              <div className="mb-1">
                                <div className="text-emerald-400 font-medium text-xs">${site.gp_price || 0}</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase">GP</div>
                              </div>
                              <div>
                                <div className="text-blue-400 font-medium text-xs">${site.niche_edit_price || 0}</div>
                                <div className="text-[10px] text-[var(--text-muted)] uppercase">Niche</div>
                              </div>
                            </td>
                          )}

                          {/* STATUS */}
                          {visibleColumns.status && (
                            <td className="p-4 text-center">
                              <span className="premium-badge bg-green-500/10 text-green-400 border-green-500/20 uppercase text-[10px] px-2 py-0.5">
                                Active
                              </span>
                            </td>
                          )}

                          {/* EMAIL */}
                          {visibleColumns.email && (
                            <td className="p-4 text-sm text-[var(--text-secondary)]">
                              {site.email || '-'}
                            </td>
                          )}

                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedSite(site)}
                              className="p-2 rounded-lg hover:bg-white/10 text-[var(--primary-cyan)] hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>

        {/* Site Details Modal */}
        {selectedSite && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="premium-card w-full max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-[#18181b] border border-[var(--border)] shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--background-dark)]">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Globe size={20} className="text-[var(--primary-cyan)]" />
                    {selectedSite.root_domain}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-[var(--primary-cyan)]/10 text-[var(--primary-cyan)] rounded border border-[var(--primary-cyan)]/20">{selectedSite.category}</span>
                    <span className="text-xs px-2 py-0.5 bg-white/5 text-[var(--text-secondary)] rounded border border-white/5">ID: #{selectedSite.id}</span>
                  </div>
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
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailRow label="Website Niche" value={selectedSite.website_niche} />
                    <DetailRow label="Country Source" value={selectedSite.country_source} />
                    <DetailRow label="Paypal ID" value={selectedSite.paypal_id} />
                    <DetailRow label="Skype" value={selectedSite.skype} />
                    <DetailRow label="WhatsApp" value={selectedSite.whatsapp} />
                    <DetailRow label="Added On" value={selectedSite.created_at ? new Date(selectedSite.created_at).toLocaleDateString() : '-'} />
                  </div>

                  <div className="bg-[var(--background-dark)] rounded-xl p-4 border border-[var(--border)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Links</h4>
                    <div className="space-y-2">
                      <DetailRow label="Sample URL" value={selectedSite.sample_url} isLink />
                      <DetailRow label="Href URL" value={selectedSite.href_url} isLink />
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">SEO Metrics & Pricing</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <MetricCard label="DA" value={selectedSite.da} color="text-blue-400" />
                      <MetricCard label="DR" value={selectedSite.dr} color="text-purple-400" />
                      <MetricCard label="RD" value={selectedSite.rd} color="text-orange-400" />
                      <MetricCard label="Traffic" value={selectedSite.traffic} color="text-yellow-400" />
                      <MetricCard label="Spam Score" value={selectedSite.spam_score} color={parseInt(selectedSite.spam_score) > 10 ? 'text-red-400' : 'text-green-400'} />
                      <MetricCard label="GP Price" value={`$${selectedSite.gp_price || 0}`} color="text-emerald-400" />
                      <MetricCard label="Niche Price" value={`$${selectedSite.niche_edit_price || 0}`} color="text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--background-dark)] shrink-0">
                <button onClick={() => setSelectedSite(null)} className="w-full premium-btn py-2.5">Close Details</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// --- Sub Components ---

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-[var(--border)] pb-5 last:border-0">
      <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>{title}</h4>
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
          className="w-1/3 bg-black/20 rounded px-1 py-1 text-xs border border-[var(--border)] outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)]"
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
          className="w-2/3 bg-black/20 rounded px-2 py-1 text-xs border border-[var(--border)] outline-none focus:border-[var(--primary-cyan)] text-[var(--text-primary)]"
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
          <ChevronDown className="h-4 w-4 rotate-90" />
        </button>
        <div className="text-sm font-medium w-6 text-center text-[var(--text-primary)]">{page}</div>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors text-[var(--text-primary)]"
        >
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </button>
      </div>
    </div>
  );
}

function MetricBadge({ label, value, color }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  };
  return (
    <div className={`flex flex-col items-center justify-center p-1 rounded min-w-[32px] border ${colors[color] || colors.blue}`}>
      <span className="text-[10px] uppercase font-bold opacity-70">{label}</span>
      <span className="font-bold text-xs">{value || '-'}</span>
    </div>
  );
}

function DetailRow({ label, value, isLink }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-white/5 pb-2 last:border-0">
      <span className="sm:w-32 flex-shrink-0 text-xs uppercase tracking-wider font-bold text-[var(--text-muted)]">
        {label}
      </span>
      {isLink && value && value !== 'N/A' ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1.5 text-[var(--primary-cyan)] hover:underline break-all font-medium"
        >
          {value}
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-sm text-[var(--text-primary)] break-words font-medium">
          {value || 'N/A'}
        </span>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="rounded-xl p-3 bg-[var(--background-dark)] border border-[var(--border)] text-center">
      <div className={`font-bold text-xl mb-1 ${color || 'text-[var(--text-primary)]'}`}>{value || '-'}</div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">{label}</div>
    </div>
  );
}

export default Sites;
