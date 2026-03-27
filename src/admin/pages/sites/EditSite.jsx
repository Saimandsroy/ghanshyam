import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function EditSite() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Initial State matching the design fields
    const [formData, setFormData] = useState({
        // Domain Information
        root_domain: '',
        category: '',
        website_niche: '',
        traffic_source: '',
        spam_score: '',
        sample_url: '',
        website_status: '', // 'Acceptable', etc. Not site_status (Active/Inactive)
        href_url: '',

        // Link Information
        // 'Marked sponsor' dropdown
        // 'Grey niche types' input
        marked_sponsor: '',
        grey_niche_types: '',

        // SEO Metrics
        da: '',
        dr: '',
        traffic: '',
        gp_price: '',
        rd: '',
        niche_edit_price: '',
        deal_cbd_casino: '',
        fc_gp: '',
        fc_ne: '',

        // User Info
        paypal_id: '',
        whatsapp: '',
        skype: '',

        // Extra (hidden or read-only if needed, but likely editable)
        site_status: '1', // Default Active
    });

    useEffect(() => {
        const fetchSite = async () => {
            try {
                const token = localStorage.getItem('authToken');
                // We reuse the list or a get-one endpoint.
                // Assuming we can fetch by ID. Backend endpoint: /api/admin/sites/:id (Not sure if it exists)
                // Let's assume we can fetch it. If not, we might need to filter from list (inefficient) or add endpoint.
                // Looking at Website.js model, findById exists. 
                // Looking at routes/admin.js... is there a get by ID?
                // There is `router.get('/websites/:id', adminController.getWebsiteById);` usually.
                // I will try fetching from `/api/admin/websites/${id}`
                // Previously saw `getAllWebsites` at `/api/admin/websites`.

                // Let's check if there is a get specific site route in a moment. 
                // For now, I'll attempt the standard REST pattern.
                const response = await fetch(`${API_BASE_URL}/admin/websites/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch site details');
                }

                const data = await response.json();

                if (data) {
                    // Map backend fields to frontend state
                    setFormData({
                        root_domain: data.root_domain || '',
                        category: data.niche || '',
                        website_niche: data.website_niche || '',
                        traffic_source: data.country_source || '',
                        spam_score: data.spam_score ?? '',
                        sample_url: data.sample_url || '',
                        website_status: data.website_status || '',
                        href_url: data.href_url || '',

                        marked_sponsor: data.marked_sponsor || '',
                        grey_niche_types: data.grey_niche_types || '',

                        da: data.da ?? '',
                        dr: data.dr ?? '',
                        traffic: data.traffic ?? '',
                        gp_price: data.gp_price ?? '',
                        rd: data.rd ?? '',
                        niche_edit_price: data.niche_edit_price ?? '',
                        deal_cbd_casino: data.deal_cbd_casino || '',
                        fc_gp: data.fc_gp ?? '',
                        fc_ne: data.fc_ne ?? '',

                        paypal_id: data.paypal_id || '',
                        whatsapp: data.whatsapp || '',
                        skype: data.skype || '',

                        site_status: data.site_status || '1'
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchSite();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/websites/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update site');
            }

            // Success
            navigate('/admin/sites');
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-[var(--primary-cyan)]" /></div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/sites')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
                </button>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Site</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Domain Information */}
                <Section title="Domain Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input label="Root domain" name="root_domain" value={formData.root_domain} onChange={handleChange} />
                        <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
                        <Input label="Website niche" name="website_niche" value={formData.website_niche} onChange={handleChange} />
                        <Input label="Traffic source" name="traffic_source" value={formData.traffic_source} onChange={handleChange} />

                        <Input label="Spam score" name="spam_score" value={formData.spam_score} onChange={handleChange} type="number" />
                        <Input label="Sample url" name="sample_url" value={formData.sample_url} onChange={handleChange} />
                        <Input label="Website status" name="website_status" value={formData.website_status} onChange={handleChange} />
                        <Input label="Href url" name="href_url" value={formData.href_url} onChange={handleChange} />

                        {/* Total Time - UI has it. Not strict in DB, maybe calculate or custom field. Omitting or generic placeholder */}
                    </div>
                </Section>

                {/* Link Information */}
                <Section title="Link Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide pl-1">Marked sponsor</label>
                            <select
                                name="marked_sponsor"
                                value={formData.marked_sponsor}
                                onChange={handleChange}
                                className="w-full bg-[var(--background-dark)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:border-[var(--primary-cyan)] outline-none"
                            >
                                <option value="">Select an option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <Input label="Grey niche types" name="grey_niche_types" value={formData.grey_niche_types} onChange={handleChange} />
                    </div>
                </Section>

                {/* SEO Metrics */}
                <Section title="SEO Metrics">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Input label="DA" name="da" value={formData.da} onChange={handleChange} type="number" />
                        <Input label="DR" name="dr" value={formData.dr} onChange={handleChange} type="number" />
                        <Input label="Traffic" name="traffic" value={formData.traffic} onChange={handleChange} type="number" />
                        <Input label="GP Price (USD)" name="gp_price" value={formData.gp_price} onChange={handleChange} type="number" />

                        <Input label="RD" name="rd" value={formData.rd} onChange={handleChange} type="number" />
                        <Input label="Niche Edit Price (USD)" name="niche_edit_price" value={formData.niche_edit_price} onChange={handleChange} type="number" />
                        <Input label="Deal CBD CASINO" name="deal_cbd_casino" value={formData.deal_cbd_casino} onChange={handleChange} />
                        <Input label="FC GP" name="fc_gp" value={formData.fc_gp} onChange={handleChange} />

                        <Input label="FC NE" name="fc_ne" value={formData.fc_ne} onChange={handleChange} />
                    </div>
                </Section>

                {/* User Info */}
                <Section title="User Info">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input label="Paypal Id" name="paypal_id" value={formData.paypal_id} onChange={handleChange} />
                        <Input label="Whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                        <Input label="Skype" name="skype" value={formData.skype} onChange={handleChange} />
                    </div>
                </Section>

                {/* Submit Button - Sticky at bottom */}
                <div className="sticky bottom-0 pt-4 pb-2 bg-[var(--background-app)] border-t border-[var(--border)] mt-6 -mx-6 px-6 md:-mx-8 md:px-8 z-10">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-[var(--text-muted)]">Save all changes to this site</p>
                        <button
                            type="submit"
                            disabled={saving}
                            className="premium-btn premium-btn-primary px-8 py-3 text-base font-bold disabled:opacity-50"
                        >
                            {saving && <Loader2 className="animate-spin h-4 w-4" />}
                            {saving ? 'Saving...' : '✓ Submit Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">{title}</h3>
            {children}
        </div>
    );
}

function Input({ label, name, value, onChange, type = "text", disabled = false }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide pl-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-[var(--background-dark)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm focus:border-[var(--primary-cyan)] outline-none disabled:opacity-50"
            />
        </div>
    );
}
