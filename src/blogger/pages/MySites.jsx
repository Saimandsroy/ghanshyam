import React, { useState, useEffect } from 'react';
import { bloggerAPI } from '../../lib/api';
import { Globe, Plus, X, ExternalLink, Edit2, Trash2 } from 'lucide-react';

/**
 * MySites - Blogger Sites Management
 * Use Premium "Canvas & Card" Design System
 */
export const MySites = () => {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        domain_url: '',
        category: '',
        da: '',
        dr: '',
        traffic: '',
        rd: '',
        niche_price: '',
        gp_price: ''
    });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            setLoading(true);
            const data = await bloggerAPI.getSites();
            setSites(data.sites || []);
        } catch (err) {
            setError(err.message || 'Failed to load sites');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            domain_url: '',
            category: '',
            da: '',
            dr: '',
            traffic: '',
            rd: '',
            niche_price: '',
            gp_price: ''
        });
    };

    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const openEditModal = (site) => {
        setSelectedSite(site);
        setFormData({
            domain_url: site.domain_url || '',
            category: site.category || '',
            da: site.da || '',
            dr: site.dr || '',
            traffic: site.traffic || '',
            rd: site.rd || '',
            niche_price: site.niche_price || '',
            gp_price: site.gp_price || ''
        });
        setShowEditModal(true);
    };

    const handleAddSite = async () => {
        if (!formData.domain_url) {
            setError('Domain URL is required');
            return;
        }

        try {
            setSubmitting(true);
            await bloggerAPI.addSite({
                ...formData,
                da: formData.da ? parseInt(formData.da) : null,
                dr: formData.dr ? parseInt(formData.dr) : null,
                traffic: formData.traffic ? parseInt(formData.traffic) : 0,
                rd: formData.rd ? parseInt(formData.rd) : 0,
                niche_price: formData.niche_price ? parseFloat(formData.niche_price) : 0,
                gp_price: formData.gp_price ? parseFloat(formData.gp_price) : 0
            });
            setSuccess('Site added successfully!');
            setShowAddModal(false);
            fetchSites();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add site');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateSite = async () => {
        try {
            setSubmitting(true);
            await bloggerAPI.updateSite(selectedSite.id, {
                category: formData.category,
                da: formData.da ? parseInt(formData.da) : null,
                dr: formData.dr ? parseInt(formData.dr) : null,
                traffic: formData.traffic ? parseInt(formData.traffic) : 0,
                rd: formData.rd ? parseInt(formData.rd) : 0,
                niche_price: formData.niche_price ? parseFloat(formData.niche_price) : 0,
                gp_price: formData.gp_price ? parseFloat(formData.gp_price) : 0
            });
            setSuccess('Site updated successfully!');
            setShowEditModal(false);
            fetchSites();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update site');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSite = async (siteId) => {
        if (!confirm('Are you sure you want to delete this site?')) return;

        try {
            await bloggerAPI.deleteSite(siteId);
            setSuccess('Site deleted successfully!');
            fetchSites();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete site');
        }
    };

    // Modal Component
    const ModalForm = ({ title, onSubmit, onClose, isEdit = false }) => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp custom-scrollbar">
                <div className="p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--card-background)]/95 backdrop-blur z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
                        {isEdit && <p className="text-sm text-[var(--text-secondary)] mt-1 truncate max-w-[300px]">{selectedSite?.domain_url}</p>}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--background-dark)] rounded-full text-[var(--text-secondary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {!isEdit && (
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Domain URL *</label>
                            <input
                                type="url"
                                className="premium-input"
                                placeholder="https://example.com"
                                value={formData.domain_url}
                                onChange={(e) => setFormData({ ...formData, domain_url: e.target.value })}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Category</label>
                        <input
                            className="premium-input"
                            placeholder="e.g., Technology, Health"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">DA (0-100)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="premium-input"
                                value={formData.da}
                                onChange={(e) => setFormData({ ...formData, da: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">DR (0-100)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="premium-input"
                                value={formData.dr}
                                onChange={(e) => setFormData({ ...formData, dr: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Traffic</label>
                            <input
                                type="number"
                                min="0"
                                className="premium-input"
                                value={formData.traffic}
                                onChange={(e) => setFormData({ ...formData, traffic: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">RD</label>
                            <input
                                type="number"
                                min="0"
                                className="premium-input"
                                value={formData.rd}
                                onChange={(e) => setFormData({ ...formData, rd: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Niche Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="premium-input"
                                value={formData.niche_price}
                                onChange={(e) => setFormData({ ...formData, niche_price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">GP Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="premium-input"
                                value={formData.gp_price}
                                onChange={(e) => setFormData({ ...formData, gp_price: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[var(--border)] flex gap-3 sticky bottom-0 bg-[var(--card-background)] z-10 backdrop-blur-md">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={onSubmit} disabled={submitting} className="flex-1 premium-btn premium-btn-accent">
                        {submitting ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" /> : null}
                        {submitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Site' : 'Add Site')}
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-cyan)] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                        <Globe className="h-8 w-8 text-[var(--primary-cyan)]" />
                        My Sites
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage your websites portfolio for guest posting opportunities.</p>
                </div>
                <button onClick={openAddModal} className="premium-btn premium-btn-primary shadow-lg shadow-emerald-500/20">
                    <Plus className="h-5 w-5" /> Add New Site
                </button>
            </div>

            {/* Notifications */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] flex items-center justify-between animate-slideUp">
                    <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[var(--error)]"></div> {error}</span>
                    <button onClick={() => setError('')} className="hover:bg-[var(--error)]/10 p-1 rounded"><X className="h-4 w-4" /></button>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)] flex items-center justify-between animate-slideUp">
                    <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)]"></div> {success}</span>
                </div>
            )}

            {/* Sites Table */}
            {sites.length === 0 ? (
                <div className="premium-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="h-20 w-20 bg-[var(--background-dark)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)]">
                        <Globe className="h-10 w-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No sites available</h3>
                    <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-8">
                        You haven't added any websites yet. Add your first authorized website to start receiving guest post orders.
                    </p>
                    <button onClick={openAddModal} className="premium-btn premium-btn-accent">
                        Add Your First Site
                    </button>
                </div>
            ) : (
                <div className="premium-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Domain</th>
                                    <th>Category</th>
                                    <th className="text-center">Metrics</th>
                                    <th className="text-center">Traffic</th>
                                    <th className="text-right">Niche Price</th>
                                    <th className="text-right">GP Price</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sites.map((site) => (
                                    <tr key={site.id} className="group">
                                        <td>
                                            <a href={site.domain_url} target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--text-primary)] hover:text-[var(--primary-cyan)] transition-colors flex items-center gap-2">
                                                <div className="h-8 w-8 rounded bg-[var(--background-dark)] flex items-center justify-center text-xs font-bold border border-[var(--border)]">
                                                    {site.domain_url.replace(/https?:\/\/(www\.)?/, '').charAt(0).toUpperCase()}
                                                </div>
                                                {site.domain_url.replace(/https?:\/\/(www\.)?/, '')}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </td>
                                        <td>
                                            <span className="premium-badge bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                {site.category || 'General'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold">DA</span>
                                                    <span className="font-mono font-bold text-[var(--text-primary)]">{site.da || '-'}</span>
                                                </div>
                                                <div className="w-px h-8 bg-[var(--border)]"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold">DR</span>
                                                    <span className="font-mono font-bold text-[var(--text-primary)]">{site.dr || '-'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="font-mono text-sm tracking-tight">{site.traffic?.toLocaleString() || '0'}</span>
                                        </td>
                                        <td className="text-right font-medium text-[var(--text-primary)]">
                                            ${site.niche_price || '0.00'}
                                        </td>
                                        <td className="text-right font-medium text-[var(--text-primary)]">
                                            ${site.gp_price || '0.00'}
                                        </td>
                                        <td>
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => openEditModal(site)}
                                                    className="p-2 rounded-lg hover:bg-[var(--primary-cyan)]/10 text-[var(--text-secondary)] hover:text-[var(--primary-cyan)] transition-colors group/edit"
                                                    title="Edit Site"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSite(site.id)}
                                                    className="p-2 rounded-lg hover:bg-[var(--error)]/10 text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors group/delete"
                                                    title="Delete Site"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddModal && <ModalForm title="Add New Site" onSubmit={handleAddSite} onClose={() => setShowAddModal(false)} />}
            {showEditModal && <ModalForm title="Edit Site" onSubmit={handleUpdateSite} onClose={() => setShowEditModal(false)} isEdit />}
        </div>
    );
};

export default MySites;
