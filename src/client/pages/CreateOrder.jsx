import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientAPI } from '../../lib/api';
import { ArrowLeft, Search, Trash2, Send, AlertCircle, ChevronLeft, ChevronRight, X, Globe, CheckCircle, FileText, Link2, Info, Settings } from 'lucide-react';

const CONTENT_TYPE_OPTIONS = ['Guest Post', 'Niche Edit'];
const CATEGORIES = [
  'Business and Entrepreneurship', 'Digital Marketing SEO and Advertising', 'Education',
  'Entertainment Music Movies and Recreation', 'Fashion and Lifestyle', 'Finance and Investing',
  'Health and Fitness', 'Technology', 'Travel', 'General Blog'
];

export function CreateOrder() {
  const navigate = useNavigate();

  // Form state
  const [contentType, setContentType] = useState('Guest Post');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  // Website selection
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;

  // Filters
  const [filters, setFilters] = useState({ domain: '', traffic: '', category: '' });
  const [activeFilters, setActiveFilters] = useState({ domain: '', traffic: '', category: '' });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isGuestPost = contentType === 'Guest Post';

  const fetchSites = useCallback(async () => {
    try {
      setSitesLoading(true);
      const params = { page, limit: pageSize };
      if (activeFilters.domain) params.search_domain = activeFilters.domain;
      if (activeFilters.traffic) { params.filter_traffic_val = activeFilters.traffic; params.filter_traffic_op = '>'; }
      if (activeFilters.category) params.search_category = activeFilters.category;

      const data = await clientAPI.getSites(params);
      setSites(data.sites || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching sites:', err);
    } finally {
      setSitesLoading(false);
    }
  }, [page, activeFilters]);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await clientAPI.getWallet();
      setWalletBalance(data.balance || 0);
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  }, []);

  useEffect(() => { 
    fetchSites(); 
    fetchWallet();
  }, [fetchSites, fetchWallet]);

  const handleApplyFilters = () => { setActiveFilters({ ...filters }); setPage(1); };
  const handleClearFilters = () => {
    setFilters({ domain: '', traffic: '', category: '' });
    setActiveFilters({ domain: '', traffic: '', category: '' });
    setPage(1);
  };

  const hasActiveFilters = activeFilters.domain || activeFilters.traffic || activeFilters.category;

  const isSelected = (siteId) => selectedSites.some(s => s.site.id === siteId);

  const handleToggleSite = (site) => {
    if (isSelected(site.id)) {
      setSelectedSites(selectedSites.filter(s => s.site.id !== site.id));
    } else {
      setSelectedSites([...selectedSites, {
        site,
        target_url: '',
        anchor_text: '',
        article_title: '',
        doc_url: '',
        post_url: '',
        insert_after: '',
        insert_statement: '',
        note: '',
        fill_details: true
      }]);
    }
  };

  const handleUpdateField = (siteId, field, value) => {
    setSelectedSites(selectedSites.map(s =>
      s.site.id === siteId ? { ...s, [field]: value } : s
    ));
  };

  const handleRemoveSite = (siteId) => {
    setSelectedSites(selectedSites.filter(s => s.site.id !== siteId));
  };

  const filteredSites = useMemo(() => {
    if (!searchTerm) return sites;
    const term = searchTerm.toLowerCase();
    return sites.filter(s =>
      (s.root_domain || '').toLowerCase().includes(term) ||
      (s.category || '').toLowerCase().includes(term)
    );
  }, [sites, searchTerm]);

  const orderTotal = useMemo(() => {
    return selectedSites.reduce((sum, item) => {
      const priceStr = isGuestPost ? item.site.gp_price : item.site.niche_edit_price;
      if (!priceStr) return sum;
      const parsed = parseFloat(priceStr.toString().replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? sum : sum + parsed;
    }, 0);
  }, [selectedSites, isGuestPost]);

  const isInsufficientBalance = orderTotal > walletBalance;

  const handleSubmit = async () => {
    if (selectedSites.length === 0) {
      setError('Please select at least one website');
      return;
    }

    // Client-side validations based on per-site fill_details and contentType
    for (const s of selectedSites) {
      if (!s.target_url || !s.target_url.trim()) {
        setError(`Target URL is required for site: ${s.site.root_domain}`);
        return;
      }
      if (!s.anchor_text || !s.anchor_text.trim()) {
        setError(`Anchor Text is required for site: ${s.site.root_domain}`);
        return;
      }

      if (isGuestPost) {
        if (s.fill_details) {
          if (!s.article_title || !s.article_title.trim()) {
            setError(`Article Title is required for site: ${s.site.root_domain}`);
            return;
          }
          if (!s.doc_url || !s.doc_url.trim()) {
            setError(`Doc URL is required for site: ${s.site.root_domain}`);
            return;
          }
        }
      } else {
        if (s.fill_details) {
          if (!s.post_url || !s.post_url.trim()) {
            setError(`Post URL is required for site: ${s.site.root_domain}`);
            return;
          }
          if (!s.insert_after || !s.insert_after.trim()) {
            setError(`Insert After text is required for site: ${s.site.root_domain}`);
            return;
          }
          if (!s.insert_statement || !s.insert_statement.trim()) {
            setError(`Insert Statement is required for site: ${s.site.root_domain}`);
            return;
          }
        }
      }
    }

    try {
      setLoading(true);
      setError('');

      const websitesData = selectedSites.map(s => ({
        site_id: s.site.id,
        target_url: s.target_url ? s.target_url.trim() : null,
        anchor_text: s.anchor_text ? s.anchor_text.trim() : null,
        article_title: (isGuestPost && s.fill_details && s.article_title) ? s.article_title.trim() : null,
        doc_url: (isGuestPost && s.fill_details && s.doc_url) ? s.doc_url.trim() : null,
        post_url: (!isGuestPost && s.fill_details && s.post_url) ? s.post_url.trim() : null,
        insert_after: (!isGuestPost && s.fill_details && s.insert_after) ? s.insert_after.trim() : null,
        insert_statement: (!isGuestPost && s.fill_details && s.insert_statement) ? s.insert_statement.trim() : null,
        note: s.note ? s.note.trim() : null,
        fill_details: s.fill_details
      }));

      const globalFillDetails = selectedSites.every(s => s.fill_details !== false);

      await clientAPI.createOrder({
        order_type: contentType,
        websites: websitesData,
        fill_details: globalFillDetails,
        notes,
        category
      });

      setSuccess('Order created successfully! Manager will review it shortly.');
      setTimeout(() => navigate('/client/orders'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/client')} className="p-2 rounded-xl hover:bg-[var(--background-dark)] border border-transparent hover:border-[var(--border)] transition-all">
          <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Create New Order
          </h1>
          <p className="text-[var(--text-muted)]">Select sites and create a Guest Post or Niche Edit order</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="premium-card p-4 border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="premium-card p-4 border-green-500/20 bg-green-500/10 text-green-400 flex items-center gap-3">
          <CheckCircle className="h-5 w-5" /><span>{success}</span>
        </div>
      )}

      {/* Step 1: Order Configuration */}
      <div className="premium-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">1</div>
          Order Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="premium-label">Content Type</label>
            <select
              className="premium-input disabled:opacity-50 disabled:cursor-not-allowed"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              disabled={selectedSites.length > 0}
            >
              {CONTENT_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {selectedSites.length > 0 && (
              <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5 font-medium animate-fadeIn">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Content type cannot be changed after selecting websites. Remove all selected websites to change the content type.
              </p>
            )}
          </div>
          <div>
            <label className="premium-label">Category</label>
            <select className="premium-input" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              {CATEGORIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Select Websites */}
      <div className="premium-card p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">2</div>
          Select Websites
          <span className="text-[var(--text-muted)] font-normal ml-2">({selectedSites.length} selected)</span>
        </h2>

        {/* Filters */}
        <div className="bg-[var(--background-dark)] rounded-xl p-4 mb-4 border border-[var(--border)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Root Domain</label>
              <input type="text" placeholder="e.g. example.com" className="premium-input w-full" value={filters.domain}
                onChange={(e) => setFilters(f => ({ ...f, domain: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Min Traffic</label>
              <input type="number" placeholder="e.g. 1000" className="premium-input w-full" value={filters.traffic}
                onChange={(e) => setFilters(f => ({ ...f, traffic: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">Category</label>
              <input type="text" placeholder="e.g. Technology" className="premium-input w-full" value={filters.category}
                onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={handleApplyFilters} className="premium-btn bg-emerald-500 text-white h-[42px] px-4">
                <Search className="h-4 w-4" />
              </button>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="premium-btn bg-transparent border border-[var(--border)] h-[42px] px-4">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick filter */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Quick filter loaded sites..." className="premium-input w-full pl-10"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Sites Table */}
        <div className="premium-table-container max-h-[400px]">
          <table className="premium-table">
            <thead className="sticky top-0 z-10 bg-[var(--background-dark)] shadow-sm">
              <tr>
                <th className="w-10"></th>
                <th>Root Domain</th>
                <th>Category</th>
                <th>{isGuestPost ? 'GP Price' : 'Niche Price'}</th>
                <th>DR</th>
                <th>DA</th>
                <th>Traffic</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id}
                  className={`cursor-pointer transition-colors ${isSelected(site.id) ? 'bg-emerald-500/5' : 'hover:bg-white/5'}`}
                  onClick={() => handleToggleSite(site)}>
                  <td className="text-center px-2">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected(site.id) ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--text-muted)]'
                    }`}>
                      {isSelected(site.id) && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                    </div>
                  </td>
                  <td className={`font-medium ${isSelected(site.id) ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                    {site.root_domain}
                  </td>
                  <td className="text-xs max-w-[150px] truncate">{site.category || site.website_niche || '-'}</td>
                  <td className="font-mono text-emerald-400">
                    ${isGuestPost ? (site.gp_price || 0) : (site.niche_edit_price || 0)}
                  </td>
                  <td>{site.dr || '-'}</td>
                  <td>{site.da || '-'}</td>
                  <td>{site.traffic?.toLocaleString() || '-'}</td>
                </tr>
              ))}
              {filteredSites.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-[var(--text-muted)]">No websites found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-[var(--text-muted)]">
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-[var(--background-dark)] disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Fill Details */}
      {selectedSites.length > 0 && (
        <div className="premium-card p-6 border-emerald-500/30">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-[var(--border)] pb-4">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">3</div>
            Fill Order Details
            <span className="text-[var(--text-muted)] font-normal ml-2">({selectedSites.length} sites)</span>
          </h2>

          <div className="space-y-6">
            {selectedSites.map((item, index) => (
              <div key={item.site.id} className="rounded-xl p-5 bg-[var(--background-dark)] border border-emerald-500/20 relative group">
                <button onClick={() => handleRemoveSite(item.site.id)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Site Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold">{index + 1}</div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">{item.site.root_domain}</h3>
                    <div className="text-xs text-[var(--text-muted)] flex gap-3">
                      <span>DR: {item.site.dr || '-'}</span>
                      <span>Traffic: {item.site.traffic?.toLocaleString() || '-'}</span>
                      <span className="text-emerald-400">${isGuestPost ? (item.site.gp_price || 0) : (item.site.niche_edit_price || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Per-Site Fill Details Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-dark)]/50 border border-[var(--border)] mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-[var(--text-muted)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">Order Details Mode</p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {item.fill_details
                          ? "You will fill target URL, anchor text, and content details."
                          : "Manager will fill in content details for this site."}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateField(item.site.id, 'fill_details', true)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        item.fill_details
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)]'
                      }`}
                    >
                      Fill Myself
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateField(item.site.id, 'fill_details', false)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        !item.fill_details
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)]'
                      }`}
                    >
                      Delegate to Manager
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                      Target URL <span className="text-red-400">*</span>
                    </label>
                    <input className="premium-input w-full" placeholder="https://example.com/target-page"
                      value={item.target_url} onChange={(e) => handleUpdateField(item.site.id, 'target_url', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                      Anchor Text <span className="text-red-400">*</span>
                    </label>
                    <input className="premium-input w-full" placeholder="Anchor text for backlink"
                      value={item.anchor_text} onChange={(e) => handleUpdateField(item.site.id, 'anchor_text', e.target.value)} />
                  </div>

                  {isGuestPost ? (
                    item.fill_details && (
                      <>
                        <div className="animate-fadeIn">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            Article Title <span className="text-red-400">*</span>
                          </label>
                          <input className="premium-input w-full" placeholder="Article title"
                            value={item.article_title} onChange={(e) => handleUpdateField(item.site.id, 'article_title', e.target.value)} />
                        </div>
                        <div className="animate-fadeIn">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            <Link2 className="h-3 w-3 inline mr-1" /> Doc URL <span className="text-red-400">*</span>
                          </label>
                          <input className="premium-input w-full" placeholder="https://docs.google.com/..."
                            value={item.doc_url} onChange={(e) => handleUpdateField(item.site.id, 'doc_url', e.target.value)} />
                        </div>
                      </>
                    )
                  ) : (
                    item.fill_details && (
                      <>
                        <div className="animate-fadeIn">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            Post URL <span className="text-red-400">*</span>
                          </label>
                          <input className="premium-input w-full" placeholder="https://blog.com/existing-post"
                            value={item.post_url} onChange={(e) => handleUpdateField(item.site.id, 'post_url', e.target.value)} />
                        </div>
                        <div className="animate-fadeIn">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            Insert After <span className="text-red-400">*</span>
                          </label>
                          <input className="premium-input w-full" placeholder="Insert link after this text..."
                            value={item.insert_after} onChange={(e) => handleUpdateField(item.site.id, 'insert_after', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 animate-fadeIn">
                          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            Insert Statement <span className="text-red-400">*</span>
                          </label>
                          <textarea className="premium-input w-full min-h-[80px]" rows={3} placeholder="The sentence/paragraph to insert..."
                            value={item.insert_statement} onChange={(e) => handleUpdateField(item.site.id, 'insert_statement', e.target.value)} />
                        </div>
                      </>
                    )
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Note (Optional)</label>
                    <textarea className="premium-input w-full" rows={2} placeholder="Any special instructions..."
                      value={item.note} onChange={(e) => handleUpdateField(item.site.id, 'note', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="premium-card p-6">
        <label className="premium-label">Additional Notes (Optional)</label>
        <textarea className="premium-input w-full min-h-[80px]" rows={3} placeholder="Any general notes for the manager..."
          value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {/* Info & Submit */}
      {selectedSites.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 animate-fadeIn">
          <Info className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-200/80">
            {selectedSites.some(s => !s.fill_details)
              ? <><strong>Mixed/Delegate Mode:</strong> Some of your websites are delegated. The Manager will fill in content details for those sites. For self-filled sites, once verified, they will be pushed to the respective bloggers.</>
              : <><strong>Self-Fill Mode:</strong> Your order will go to the Manager for review. Once verified, it will be pushed to the respective bloggers.</>
            }
          </p>
        </div>
      )}

      {/* Order Summary & Submit */}
      <div className="premium-card p-6 border-t-[4px] border-t-[var(--primary-cyan)]">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="w-full md:w-auto flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Order Summary</h3>
            <div className="space-y-2 max-w-sm">
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Selected Sites:</span>
                <span className="font-medium text-[var(--text-primary)]">{selectedSites.length}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                <span>Current Wallet Balance:</span>
                <span className="font-mono text-emerald-400">${walletBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--text-primary)]">Total Order Cost:</span>
                <span className="font-mono text-[var(--primary-cyan)]">${orderTotal.toFixed(2)}</span>
              </div>
              
              {isInsufficientBalance && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Your balance is lower than the order cost. Please add money to your wallet to proceed.</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-auto flex items-center justify-end gap-4 mt-6 md:mt-0">
            <button onClick={() => navigate('/client')} className="premium-btn border border-[var(--border)] hover:bg-[var(--background-dark)] px-6 py-3">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading || selectedSites.length === 0 || isInsufficientBalance}
              className={`premium-btn px-8 py-3 flex items-center gap-2 ${
                selectedSites.length > 0 && !loading && !isInsufficientBalance
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-[var(--background-dark)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]'
              }`}>
              {loading ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/30 border-t-white"></div> Processing...</>
              ) : (
                <><Send className="h-4 w-4" /> Pay & Create Order</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
