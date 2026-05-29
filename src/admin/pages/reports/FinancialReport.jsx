import React, { useMemo, useState, useEffect } from 'react';
import { adminAPI } from '../../../lib/api';
import { Pagination } from '../../../components/Pagination.jsx';
import { exportToCSV } from '../../../utils/exportUtils';
import { Calendar, User, Globe, Tag, DollarSign, Download, Percent, RefreshCw, BarChart2 } from 'lucide-react';

export function FinancialReport() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalBloggerCost: 0, totalProfit: 0, averageMargin: 0 });
  const [clients, setClients] = useState([]);
  const [bloggers, setBloggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    clientId: '',
    bloggerId: '',
    contentType: '',
    website: ''
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'blogger' | 'profit'

  // Fetch report data
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getFinancialReport(filters);
      setRecords(data.records || []);
      setSummary(data.summary || { totalRevenue: 0, totalBloggerCost: 0, totalProfit: 0, averageMargin: 0 });
      setClients(data.filters?.clients || []);
      setBloggers(data.filters?.bloggers || []);
    } catch (err) {
      console.error('Error fetching financial report:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      clientId: '',
      bloggerId: '',
      contentType: '',
      website: ''
    });
    setPage(1);
  };

  // Client-side pagination
  const filteredRecords = useMemo(() => {
    if (activeTab === 'blogger') {
      // For Blogger Payout Report, only show rows with assigned blogger
      return records.filter(r => r.blogger_name !== null);
    }
    return records;
  }, [records, activeTab]);

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const total = filteredRecords.length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (val, currency = 'USD') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${parseFloat(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!filteredRecords.length) return;

    let dataToExport = [];
    let filename = '';

    if (activeTab === 'revenue') {
      filename = 'client_revenue_report';
      dataToExport = filteredRecords.map(r => ({
        'Date': formatDate(r.date),
        'Order ID': r.order_number || `ORD${r.order_id}`,
        'Client Name': r.client_name,
        'Website': r.website || 'N/A',
        'Content Type': r.content_type,
        'Client Charged': r.client_charged.toFixed(2),
        'Currency': r.currency || 'USD',
        'Payment Status': r.payment_status === 'completed' ? 'Paid' : r.payment_status
      }));
    } else if (activeTab === 'blogger') {
      filename = 'blogger_payout_report';
      dataToExport = filteredRecords.map(r => ({
        'Date': formatDate(r.date),
        'Order ID': r.order_number || `ORD${r.order_id}`,
        'Blogger Name': r.blogger_name,
        'Website': r.website || 'N/A',
        'Blogger Price': r.blogger_paid.toFixed(2),
        'Currency': r.currency || 'USD',
        'Payment Status': r.blogger_status === 8 ? 'Paid' : 'Pending'
      }));
    } else if (activeTab === 'profit') {
      filename = 'profit_calculation_report';
      dataToExport = filteredRecords.map(r => ({
        'Order ID': r.order_number || `ORD${r.order_id}`,
        'Client Name': r.client_name,
        'Website': r.website || 'N/A',
        'Client Charged': r.client_charged.toFixed(2),
        'Blogger Paid': r.blogger_paid.toFixed(2),
        'Platform Profit': r.profit.toFixed(2),
        'Profit Margin %': `${r.margin.toFixed(1)}%`,
        'Payout Type': r.blogger_paid === 0 ? 'Platform-Owned (No Payout)' : 'External Blogger'
      }));
    }

    exportToCSV(dataToExport, filename);
  };

  // Margin pill color
  const getMarginBadgeClass = (margin) => {
    if (margin >= 30) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (margin >= 15) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Financial Analytics</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monitor platforms revenue, costs, and operational margins</p>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Analytics KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="rounded-2xl p-5 border flex items-center justify-between" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Revenue</span>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(summary.totalRevenue)}
            </div>
            <p className="text-xs text-emerald-400">Paid by clients</p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-xl">
            <DollarSign className="h-6 w-6 text-orange-500" />
          </div>
        </div>

        {/* Blogger Cost */}
        <div className="rounded-2xl p-5 border flex items-center justify-between" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Blogger Payouts</span>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(summary.totalBloggerCost)}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cost of goods sold</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl">
            <DollarSign className="h-6 w-6 text-red-500" />
          </div>
        </div>

        {/* Profit */}
        <div className="rounded-2xl p-5 border flex items-center justify-between" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Net Profit</span>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(summary.totalProfit)}
            </div>
            <p className="text-xs text-emerald-400">Platform earnings</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <BarChart2 className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Profit Margin */}
        <div className="rounded-2xl p-5 border flex items-center justify-between" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Profit Margin</span>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {summary.averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Average markup margin</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Percent className="h-6 w-6 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl p-5 border" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Report Filters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.startDate}
                onChange={e => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm pl-9"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>End Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.endDate}
                onChange={e => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm pl-9"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <Calendar className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Client Filter */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Client</label>
            <div className="relative">
              <select
                value={filters.clientId}
                onChange={e => handleFilterChange('clientId', e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm pl-9 appearance-none"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">All Clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                ))}
              </select>
              <User className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Blogger Filter */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Blogger</label>
            <div className="relative">
              <select
                value={filters.bloggerId}
                onChange={e => handleFilterChange('bloggerId', e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm pl-9 appearance-none"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">All Bloggers</option>
                {bloggers.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.email})</option>
                ))}
              </select>
              <User className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Content Type</label>
            <div className="relative">
              <select
                value={filters.contentType}
                onChange={e => handleFilterChange('contentType', e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm pl-9 appearance-none"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">All Types</option>
                <option value="Guest Post">Guest Post</option>
                <option value="Niche Edit">Niche Edit</option>
              </select>
              <Tag className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Website Domain Search */}
          <div>
            <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Website Domain</label>
            <div className="relative">
              <input
                type="text"
                value={filters.website}
                onChange={e => handleFilterChange('website', e.target.value)}
                placeholder="e.g. example.com"
                className="w-full rounded-xl px-3 py-2 text-sm pl-9"
                style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <Globe className="absolute left-3 top-2.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleResetFilters}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Reports Section with Tabs */}
      <div className="space-y-4">
        {/* Tab Headers and Export Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Tabs switch */}
          <div className="flex gap-1 rounded-xl p-1 w-full md:w-auto border" style={{ backgroundColor: 'var(--background-dark)', borderColor: 'var(--border)' }}>
            <button
              onClick={() => { setActiveTab('revenue'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'revenue' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Client Revenue
            </button>
            <button
              onClick={() => { setActiveTab('blogger'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'blogger' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Blogger Payments
            </button>
            <button
              onClick={() => { setActiveTab('profit'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'profit' ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profit & Margins
            </button>
          </div>

          {/* Export Action */}
          <button
            onClick={handleExportCSV}
            disabled={filteredRecords.length === 0}
            className="flex items-center gap-2 px-4 py-2 w-full md:w-auto justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl border text-sm font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--border)' }}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full border-collapse">
              <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                {activeTab === 'revenue' && (
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Order ID</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Client Name</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Website</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Content Type</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Charged</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Currency</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Payment Status</th>
                  </tr>
                )}
                {activeTab === 'blogger' && (
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Order ID</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Blogger Name</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Website</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Payout Price</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Currency</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Payout Status</th>
                  </tr>
                )}
                {activeTab === 'profit' && (
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Order ID</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Client</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Website</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Client Charged</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Blogger Paid</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Profit</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Margin</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="h-6 w-6 text-orange-500 animate-spin" />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading financial records...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                      No financial records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((row, idx) => (
                    <tr
                      key={`${row.order_id}-${row.website}-${idx}`}
                      className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      {activeTab === 'revenue' && (
                        <>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(row.date)}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{row.order_number || `ORD${row.order_id}`}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.client_name}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.website || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-sm">
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                              {row.content_type === 'Guest Post' ? 'GP' : 'NE'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-emerald-400">{formatCurrency(row.client_charged, row.currency)}</td>
                          <td className="px-4 py-3.5 text-sm uppercase" style={{ color: 'var(--text-muted)' }}>{row.currency || 'USD'}</td>
                          <td className="px-4 py-3.5 text-sm">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Paid
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === 'blogger' && (
                        <>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(row.date)}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{row.order_number || `ORD${row.order_id}`}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.blogger_name || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.website || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-red-400">{formatCurrency(row.blogger_paid, row.currency)}</td>
                          <td className="px-4 py-3.5 text-sm uppercase" style={{ color: 'var(--text-muted)' }}>{row.currency || 'USD'}</td>
                          <td className="px-4 py-3.5 text-sm">
                            {row.blogger_paid === 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                No Payout
                              </span>
                            ) : row.blogger_status === 8 ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Paid
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Pending
                              </span>
                            )}
                          </td>
                        </>
                      )}

                      {activeTab === 'profit' && (
                        <>
                          <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{row.order_number || `ORD${row.order_id}`}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.client_name}</td>
                          <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.website || 'N/A'}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(row.client_charged, row.currency)}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold" style={{ color: row.blogger_paid === 0 ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                            {row.blogger_paid === 0 ? '$0.00' : formatCurrency(row.blogger_paid, row.currency)}
                          </td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-emerald-400">{formatCurrency(row.profit, row.currency)}</td>
                          <td className="px-4 py-3.5 text-sm">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${getMarginBadgeClass(row.margin)}`}>
                              {row.margin.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-sm">
                            {row.blogger_paid === 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                Platform
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                External
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination section */}
        {!loading && filteredRecords.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        )}
      </div>
    </div>
  );
}
