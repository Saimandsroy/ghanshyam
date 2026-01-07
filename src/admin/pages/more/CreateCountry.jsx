import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function CreateCountry() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        bank: false,
        paypal: false,
        qr_code: false,
        upi_id: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (createAnother = false) => {
        if (!form.name) {
            toast.error('Please enter a country name');
            return;
        }

        const paymentMethods = [];
        if (form.bank) paymentMethods.push('bank');
        if (form.paypal) paymentMethods.push('paypal');
        if (form.qr_code) paymentMethods.push('qr_code');
        if (form.upi_id) paymentMethods.push('upi_id');

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/countries`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: form.name,
                    payment_methods: paymentMethods.join(', ')
                })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Country created successfully!');
                if (createAnother) {
                    setForm({ name: '', bank: false, paypal: false, qr_code: false, upi_id: false });
                } else {
                    navigate('/admin/more/countries');
                }
            } else {
                toast.error(data.message || 'Failed to create country');
            }
        } catch (error) {
            toast.error('Failed to create country');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted, #888)' }}>
                <Link to="/admin/more/countries" style={{ color: 'var(--text-muted, #888)', textDecoration: 'none' }}>Countries Lists</Link>
                {' > '} Create
            </div>

            {/* Header */}
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary, #fff)', margin: '0 0 24px 0' }}>
                Create Countries List
            </h1>

            {/* Form Card */}
            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '12px', padding: '24px'
            }}>
                <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-primary, #fff)', fontSize: '16px', fontWeight: '500' }}>
                    Add New Country
                </h3>

                {/* Name Field */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                        Name
                    </label>
                    <input
                        type="text" name="name" value={form.name} onChange={handleChange}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '6px',
                            backgroundColor: 'var(--background, #0f0f1a)',
                            border: '1px solid var(--border, #2a2a4a)',
                            color: 'var(--text-primary, #fff)', fontSize: '14px'
                        }}
                    />
                </div>

                {/* Payment Methods */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', marginBottom: '16px', color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                        Payment methods
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" name="bank" checked={form.bank} onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                            <span style={{ color: 'var(--text-primary, #fff)', fontSize: '14px' }}>Bank</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" name="paypal" checked={form.paypal} onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                            <span style={{ color: 'var(--text-primary, #fff)', fontSize: '14px' }}>Paypal ID</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" name="qr_code" checked={form.qr_code} onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                            <span style={{ color: 'var(--text-primary, #fff)', fontSize: '14px' }}>QR Code</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input type="checkbox" name="upi_id" checked={form.upi_id} onChange={handleChange}
                                style={{ width: '18px', height: '18px', accentColor: '#f59e0b' }} />
                            <span style={{ color: 'var(--text-primary, #fff)', fontSize: '14px' }}>UPI ID</span>
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        style={{
                            padding: '10px 20px', backgroundColor: '#3b82f6',
                            color: '#fff', border: 'none', borderRadius: '6px',
                            fontWeight: '500', cursor: 'pointer', fontSize: '14px'
                        }}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        style={{
                            padding: '10px 20px', backgroundColor: 'var(--background, #0f0f1a)',
                            color: 'var(--text-primary, #fff)', border: '1px solid var(--border, #2a2a4a)',
                            borderRadius: '6px', fontWeight: '500', cursor: 'pointer', fontSize: '14px'
                        }}
                    >
                        Create & create another
                    </button>
                    <Link
                        to="/admin/more/countries"
                        style={{
                            padding: '10px 20px', backgroundColor: 'var(--background, #0f0f1a)',
                            color: 'var(--text-primary, #fff)', border: '1px solid var(--border, #2a2a4a)',
                            borderRadius: '6px', fontWeight: '500', textDecoration: 'none', fontSize: '14px'
                        }}
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}
