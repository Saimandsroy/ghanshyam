import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function FAQs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setFaqs(data.faqs || []);
            }
        } catch (error) {
            console.error('Failed to fetch faqs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const filteredFaqs = faqs.filter(f =>
        f.question?.toLowerCase().includes(search.toLowerCase()) ||
        f.answer?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '24px' }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted, #888)' }}>
                Faqs {'>'} List
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary, #fff)', margin: 0 }}>
                    FAQs
                </h1>
                <Link to="/admin/more/faqs/create" style={{
                    padding: '10px 20px', backgroundColor: '#f59e0b',
                    color: '#fff', borderRadius: '6px', fontWeight: '600',
                    textDecoration: 'none', fontSize: '14px'
                }}>
                    New FAQ
                </Link>
            </div>

            {/* Card */}
            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '12px', overflow: 'hidden'
            }}>
                {/* Search */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border, #2a2a4a)', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #666)' }} />
                        <input
                            type="text" placeholder="Search"
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '8px 12px 8px 36px', borderRadius: '6px',
                                backgroundColor: 'var(--background, #0f0f1a)',
                                border: '1px solid var(--border, #2a2a4a)',
                                color: 'var(--text-primary, #fff)', fontSize: '14px', width: '200px'
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #666)' }}>
                        Loading...
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--background, #0f0f1a)' }}>
                                <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '13px', fontWeight: '500' }}>Question</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '13px', fontWeight: '500' }}>Answer</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary, #aaa)', fontSize: '13px', fontWeight: '500' }}>Status</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-secondary, #aaa)', fontSize: '13px', fontWeight: '500' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaqs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted, #666)' }}>
                                        No FAQs found
                                    </td>
                                </tr>
                            ) : (
                                filteredFaqs.map(faq => (
                                    <tr key={faq.id} style={{ borderBottom: '1px solid var(--border, #2a2a4a)' }}>
                                        <td style={{ padding: '16px 20px', color: 'var(--text-primary, #fff)', maxWidth: '300px' }}>
                                            {faq.question?.length > 80 ? faq.question.substring(0, 80) + '...' : faq.question}
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary, #aaa)', maxWidth: '400px' }}>
                                            {faq.answer?.length > 100 ? faq.answer.substring(0, 100) + '...' : faq.answer}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            {faq.is_active || faq.active ? (
                                                <CheckCircle size={20} style={{ color: '#22c55e' }} />
                                            ) : (
                                                <XCircle size={20} style={{ color: '#ef4444' }} />
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <Link to={`/admin/more/faqs/edit/${faq.id}`} style={{ color: '#f59e0b' }}>
                                                <Edit size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
