import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Trash2, DollarSign, Edit2 } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function PriceCharts() {
  const { showSuccess, showError } = useToast();
  const [priceCharts, setPriceCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ q: '' });
  const [form, setForm] = useState({
    rd_min: '', rd_max: '', traffic_min: '', traffic_max: '',
    dr_min: '', dr_max: '', da_min: '', da_max: '',
    niche_price_min: '', niche_price_max: '', gp_price_min: '', gp_price_max: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch price charts from API
  const fetchPriceCharts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getPriceCharts();
      setPriceCharts(response.price_charts || []);
    } catch (err) {
      console.error('Error fetching price charts:', err);
      setError(err.message || 'Failed to load price charts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPriceCharts();
  }, [fetchPriceCharts]);

  // Filter data
  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    if (!q) return priceCharts;
    return priceCharts.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(q))
    );
  }, [priceCharts, filters]);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.rd_min || !form.traffic_min) {
      showError('RD and Traffic ranges are required');
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.createPriceChart({
        rd_min: parseInt(form.rd_min) || 0,
        rd_max: parseInt(form.rd_max) || 0,
        traffic_min: parseInt(form.traffic_min) || 0,
        traffic_max: parseInt(form.traffic_max) || 0,
        dr_min: parseInt(form.dr_min) || 0,
        dr_max: parseInt(form.dr_max) || 0,
        da_min: parseInt(form.da_min) || 0,
        da_max: parseInt(form.da_max) || 0,
        niche_price_min: parseFloat(form.niche_price_min) || 0,
        niche_price_max: parseFloat(form.niche_price_max) || 0,
        gp_price_min: parseFloat(form.gp_price_min) || 0,
        gp_price_max: parseFloat(form.gp_price_max) || 0
      });

      showSuccess('Price chart entry added successfully!');
      setForm({
        rd_min: '', rd_max: '', traffic_min: '', traffic_max: '',
        dr_min: '', dr_max: '', da_min: '', da_max: '',
        niche_price_min: '', niche_price_max: '', gp_price_min: '', gp_price_max: ''
      });
      fetchPriceCharts();
    } catch (err) {
      showError('Failed to add price chart: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await adminAPI.deletePriceChart(id);
      showSuccess('Price chart entry deleted!');
      fetchPriceCharts();
    } catch (err) {
      showError('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Format range display
  const formatRange = (min, max) => {
    if (min === max) return min;
    return `${min}-${max}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <DollarSign className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Price Charts
        </h2>
        <button
          onClick={fetchPriceCharts}
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
          <button onClick={fetchPriceCharts} className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)', color: 'var(--background-dark)' }}>
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search</label>
          <input
            value={filters.q}
            onChange={e => setFilters({ q: e.target.value })}
            placeholder="Filter rows"
            className="rounded-xl px-3 py-2 w-full"
            style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{filtered.length} entries</span>
      </div>

      {/* Loading State */}
      {loading && priceCharts.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading price charts...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>RD</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Traffic</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DR</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DA</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Niche Price</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>GP Price</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatRange(r.rd_min, r.rd_max)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatRange(r.traffic_min, r.traffic_max)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatRange(r.dr_min, r.dr_max)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{formatRange(r.da_min, r.da_max)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--success)' }}>${formatRange(r.niche_price_min, r.niche_price_max)}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--success)' }}>${formatRange(r.gp_price_min, r.gp_price_max)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                      className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className={`h-4 w-4 ${deletingId === r.id ? 'animate-spin' : ''}`} style={{ color: 'var(--error)' }} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No price chart entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Row Form */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Plus className="h-5 w-5" style={{ color: 'var(--primary-cyan)' }} />
          Add New Entry
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <input value={form.rd_min} onChange={e => setForm({ ...form, rd_min: e.target.value })} placeholder="RD Min *" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.rd_max} onChange={e => setForm({ ...form, rd_max: e.target.value })} placeholder="RD Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.traffic_min} onChange={e => setForm({ ...form, traffic_min: e.target.value })} placeholder="Traffic Min *" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.traffic_max} onChange={e => setForm({ ...form, traffic_max: e.target.value })} placeholder="Traffic Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.dr_min} onChange={e => setForm({ ...form, dr_min: e.target.value })} placeholder="DR Min" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.dr_max} onChange={e => setForm({ ...form, dr_max: e.target.value })} placeholder="DR Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <input value={form.da_min} onChange={e => setForm({ ...form, da_min: e.target.value })} placeholder="DA Min" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.da_max} onChange={e => setForm({ ...form, da_max: e.target.value })} placeholder="DA Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.niche_price_min} onChange={e => setForm({ ...form, niche_price_min: e.target.value })} placeholder="Niche $ Min" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.niche_price_max} onChange={e => setForm({ ...form, niche_price_max: e.target.value })} placeholder="Niche $ Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.gp_price_min} onChange={e => setForm({ ...form, gp_price_min: e.target.value })} placeholder="GP $ Min" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <input value={form.gp_price_max} onChange={e => setForm({ ...form, gp_price_max: e.target.value })} placeholder="GP $ Max" className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--icon-on-gradient)' }}
          >
            {submitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
