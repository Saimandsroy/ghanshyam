import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function CreateFAQ() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        question: '',
        answer: '',
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (createAnother = false) => {
        if (!form.question || !form.answer) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('FAQ created successfully!');
                if (createAnother) {
                    setForm({ question: '', answer: '', is_active: true });
                } else {
                    navigate('/admin/more/faqs');
                }
            } else {
                toast.error(data.message || 'Failed to create FAQ');
            }
        } catch (error) {
            toast.error('Failed to create FAQ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted, #888)' }}>
                <Link to="/admin/more/faqs" style={{ color: 'var(--text-muted, #888)', textDecoration: 'none' }}>Faqs</Link>
                {' > '} Create
            </div>

            {/* Header */}
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary, #fff)', margin: '0 0 24px 0' }}>
                Create Faq
            </h1>

            {/* Form Card */}
            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '12px', padding: '24px'
            }}>
                <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-primary, #fff)', fontSize: '16px', fontWeight: '500' }}>
                    Add New Faq
                </h3>

                {/* Form Fields */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                        Question<span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        name="question" value={form.question} onChange={handleChange} rows={3}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '6px',
                            backgroundColor: 'var(--background, #0f0f1a)',
                            border: '1px solid var(--border, #2a2a4a)',
                            color: 'var(--text-primary, #fff)', fontSize: '14px', resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                        Answer<span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                        name="answer" value={form.answer} onChange={handleChange} rows={4}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '6px',
                            backgroundColor: 'var(--background, #0f0f1a)',
                            border: '1px solid var(--border, #2a2a4a)',
                            color: 'var(--text-primary, #fff)', fontSize: '14px', resize: 'vertical'
                        }}
                    />
                </div>

                {/* Active Toggle */}
                <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <div style={{
                            width: '44px', height: '24px', borderRadius: '12px',
                            backgroundColor: form.is_active ? '#f59e0b' : '#444',
                            position: 'relative', transition: 'background-color 0.2s'
                        }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#fff',
                                position: 'absolute', top: '2px',
                                left: form.is_active ? '22px' : '2px',
                                transition: 'left 0.2s'
                            }} />
                        </div>
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} style={{ display: 'none' }} />
                        <span style={{ color: 'var(--text-primary, #fff)', fontSize: '14px' }}>
                            Active<span style={{ color: '#ef4444' }}>*</span>
                        </span>
                    </label>
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
                        to="/admin/more/faqs"
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
