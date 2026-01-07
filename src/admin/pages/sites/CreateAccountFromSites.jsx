import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, X, Users, Globe, Mail, Phone, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function CreateAccountFromSites() {
    const [pendingEmails, setPendingEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchPendingAccounts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/sites/pending-accounts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setPendingEmails(data.pending || []);
            } else {
                toast.error(data.message || 'Failed to fetch pending accounts');
            }
        } catch (error) {
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingAccounts();
    }, []);

    const handleCreateAccounts = async () => {
        if (pendingEmails.length === 0) {
            toast.error('No pending accounts to create');
            return;
        }

        setCreating(true);
        try {
            const token = localStorage.getItem('authToken');
            const emails = pendingEmails.map(p => p.email);

            const response = await fetch(`${API_BASE_URL}/admin/sites/create-accounts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ emails })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Created ${data.created} accounts successfully!`, {
                    duration: 5000,
                    position: 'top-right',
                    style: { background: '#22c55e', color: '#fff' }
                });
                if (data.errors && data.errors.length > 0) {
                    toast.error(`${data.failed} accounts failed to create`);
                }
                fetchPendingAccounts();
            } else {
                toast.error(data.message || 'Failed to create accounts');
            }
        } catch (error) {
            toast.error('Failed to create accounts');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '24px',
                color: 'var(--text-primary, #fff)'
            }}>
                Create Account From Sites
            </h2>

            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                {/* Header with Stats and Actions */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--border, #2a2a4a)',
                    background: 'linear-gradient(135deg, rgba(0,188,212,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: 'var(--background, #0f0f1a)',
                            borderRadius: '8px'
                        }}>
                            <Users size={20} style={{ color: 'var(--primary-cyan, #00bcd4)' }} />
                            <span style={{ color: 'var(--text-secondary, #aaa)', fontSize: '14px' }}>
                                Pending: <strong style={{ color: 'var(--primary-cyan, #00bcd4)', fontSize: '18px' }}>{pendingEmails.length}</strong>
                            </span>
                        </div>

                        <button
                            onClick={fetchPendingAccounts}
                            disabled={loading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border, #2a2a4a)',
                                borderRadius: '6px',
                                color: 'var(--text-secondary, #aaa)',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    <button
                        onClick={handleCreateAccounts}
                        disabled={creating || pendingEmails.length === 0}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            backgroundColor: pendingEmails.length > 0 ? '#22c55e' : '#444',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: (creating || pendingEmails.length === 0) ? 'not-allowed' : 'pointer',
                            boxShadow: pendingEmails.length > 0 ? '0 4px 14px rgba(34, 197, 94, 0.3)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <UserPlus size={18} />
                        {creating ? 'Creating...' : 'Create Accounts (default password is 12345678)'}
                    </button>
                </div>

                {/* Table */}
                <div style={{ padding: '0' }}>
                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px',
                            color: 'var(--text-muted, #666)'
                        }}>
                            <RefreshCw size={32} className="animate-spin" style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <div>Loading sites...</div>
                        </div>
                    ) : pendingEmails.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px'
                        }}>
                            <X size={56} style={{
                                color: 'var(--text-muted, #666)',
                                marginBottom: '16px',
                                opacity: 0.5
                            }} />
                            <div style={{
                                color: 'var(--text-secondary, #aaa)',
                                fontSize: '18px',
                                marginBottom: '8px'
                            }}>
                                No new sites
                            </div>
                            <div style={{
                                color: 'var(--text-muted, #666)',
                                fontSize: '14px'
                            }}>
                                Import Excel files with email addresses to create blogger accounts
                            </div>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '14px'
                            }}>
                                <thead>
                                    <tr style={{
                                        backgroundColor: 'var(--background, #0f0f1a)',
                                        borderBottom: '2px solid var(--border, #2a2a4a)'
                                    }}>
                                        <th style={{
                                            padding: '14px 20px',
                                            textAlign: 'left',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Mail size={14} /> Email
                                            </div>
                                        </th>
                                        <th style={{
                                            padding: '14px 16px',
                                            textAlign: 'center',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase'
                                        }}>Sites</th>
                                        <th style={{
                                            padding: '14px 16px',
                                            textAlign: 'left',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Globe size={14} /> Domains
                                            </div>
                                        </th>
                                        <th style={{
                                            padding: '14px 16px',
                                            textAlign: 'center',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase'
                                        }}>DA/DR</th>
                                        <th style={{
                                            padding: '14px 16px',
                                            textAlign: 'left',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <DollarSign size={14} /> GP / NE Price
                                            </div>
                                        </th>
                                        <th style={{
                                            padding: '14px 16px',
                                            textAlign: 'left',
                                            color: 'var(--text-secondary, #aaa)',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            textTransform: 'uppercase'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Phone size={14} /> WhatsApp
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingEmails.map((item, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom: '1px solid var(--border, #2a2a4a)',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,188,212,0.05)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{
                                                padding: '16px 20px',
                                                color: 'var(--text-primary, #fff)',
                                                fontWeight: '500'
                                            }}>
                                                {item.email}
                                            </td>
                                            <td style={{
                                                padding: '16px',
                                                textAlign: 'center'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '4px 12px',
                                                    backgroundColor: 'rgba(0,188,212,0.15)',
                                                    color: 'var(--primary-cyan, #00bcd4)',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    fontSize: '13px'
                                                }}>
                                                    {item.siteCount}
                                                </span>
                                            </td>
                                            <td style={{
                                                padding: '16px',
                                                color: 'var(--text-secondary, #aaa)',
                                                maxWidth: '300px'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '6px'
                                                }}>
                                                    {item.domains.slice(0, 3).map((domain, i) => (
                                                        <span key={i} style={{
                                                            padding: '3px 8px',
                                                            backgroundColor: 'var(--background, #0f0f1a)',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            color: 'var(--text-secondary, #aaa)'
                                                        }}>
                                                            {domain}
                                                        </span>
                                                    ))}
                                                    {item.domains.length > 3 && (
                                                        <span style={{
                                                            padding: '3px 8px',
                                                            backgroundColor: 'rgba(139,92,246,0.2)',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            color: '#8b5cf6'
                                                        }}>
                                                            +{item.domains.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{
                                                padding: '16px',
                                                textAlign: 'center',
                                                color: 'var(--text-secondary, #aaa)'
                                            }}>
                                                <span style={{ color: '#22c55e', fontWeight: '500' }}>{item.da || '-'}</span>
                                                <span style={{ margin: '0 4px', opacity: 0.5 }}>/</span>
                                                <span style={{ color: '#f59e0b', fontWeight: '500' }}>{item.dr || '-'}</span>
                                            </td>
                                            <td style={{
                                                padding: '16px',
                                                color: 'var(--text-secondary, #aaa)'
                                            }}>
                                                {item.gpPrice || item.nicheEditPrice ? (
                                                    <span>
                                                        <span style={{ color: '#22c55e' }}>${item.gpPrice || '-'}</span>
                                                        <span style={{ margin: '0 4px', opacity: 0.5 }}>/</span>
                                                        <span style={{ color: '#8b5cf6' }}>${item.nicheEditPrice || '-'}</span>
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td style={{
                                                padding: '16px',
                                                color: 'var(--text-secondary, #aaa)'
                                            }}>
                                                {item.whatsapp || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                {pendingEmails.length > 0 && (
                    <div style={{
                        padding: '16px 24px',
                        backgroundColor: 'var(--background, #0f0f1a)',
                        borderTop: '1px solid var(--border, #2a2a4a)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div style={{
                            color: 'var(--text-secondary, #aaa)',
                            fontSize: '14px'
                        }}>
                            Total: <strong style={{ color: 'var(--primary-cyan, #00bcd4)' }}>{pendingEmails.length}</strong> unique emails
                            {' • '}
                            <strong style={{ color: '#8b5cf6' }}>{pendingEmails.reduce((sum, e) => sum + e.siteCount, 0)}</strong> sites
                        </div>
                        <div style={{
                            color: 'var(--text-muted, #666)',
                            fontSize: '12px'
                        }}>
                            One email = One blogger account (multiple sites can share same email)
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
