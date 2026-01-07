import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Download, Check, X, RefreshCw, FileSpreadsheet, User, Clock, Filter, Upload, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function PendingBulk() {
    const [requests, setRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const url = filter === 'all'
                ? `${API_BASE_URL}/admin/sites/pending-bulk`
                : `${API_BASE_URL}/admin/sites/pending-bulk?status=${filter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data.requests || []);
            } else {
                toast.error(data.message || 'Failed to fetch requests');
            }
        } catch (error) {
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const fetchAcceptedRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/sites/pending-bulk?status=accepted`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAcceptedRequests(data.requests || []);
            }
        } catch (error) {
            console.error('Failed to fetch accepted requests');
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchAcceptedRequests();
    }, [filter]);

    const handleDownload = (id) => {
        const token = localStorage.getItem('authToken');
        window.location.href = `${API_BASE_URL}/admin/sites/pending-bulk/${id}/download?token=${token}`;
    };

    const handleAccept = async (id) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/sites/pending-bulk/${id}/accept`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Request accepted!', { position: 'top-right' });
                fetchRequests();
                fetchAcceptedRequests();
            } else {
                toast.error(data.message || 'Failed to accept');
            }
        } catch (error) {
            toast.error('Failed to accept request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/sites/pending-bulk/${id}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Request rejected', { position: 'top-right' });
                fetchRequests();
                fetchAcceptedRequests();
            } else {
                toast.error(data.message || 'Failed to reject');
            }
        } catch (error) {
            toast.error('Failed to reject request');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
            accepted: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
            rejected: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }
        };
        const style = styles[status] || styles.pending;
        return (
            <span style={{
                padding: '4px 10px', borderRadius: '12px',
                backgroundColor: style.bg, color: style.color,
                fontSize: '12px', fontWeight: '500', textTransform: 'capitalize'
            }}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <h2 style={{
                fontSize: '24px', fontWeight: 'bold', marginBottom: '24px',
                color: 'var(--text-primary, #fff)'
            }}>
                Pending Bulk Requests
            </h2>

            <div style={{
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '12px', overflow: 'hidden'
            }}>
                {/* Header with Filter */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border, #2a2a4a)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Filter size={18} style={{ color: 'var(--text-secondary, #aaa)' }} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{
                                padding: '8px 12px', borderRadius: '6px',
                                backgroundColor: 'var(--background, #0f0f1a)',
                                border: '1px solid var(--border, #2a2a4a)',
                                color: 'var(--text-primary, #fff)', fontSize: '14px'
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="all">All</option>
                        </select>
                    </div>

                    <button onClick={fetchRequests} disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', backgroundColor: 'transparent',
                            border: '1px solid var(--border, #2a2a4a)',
                            borderRadius: '6px', color: 'var(--text-secondary, #aaa)',
                            cursor: 'pointer', fontSize: '13px'
                        }}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted, #666)' }}>
                        Loading...
                    </div>
                ) : requests.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <FileSpreadsheet size={48} style={{ color: 'var(--text-muted, #666)', marginBottom: '16px' }} />
                        <div style={{ color: 'var(--text-secondary, #aaa)', fontSize: '16px' }}>
                            No {filter !== 'all' ? filter : ''} requests found
                        </div>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--background, #0f0f1a)' }}>
                                    <th style={{ padding: '14px 20px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <User size={14} /> Blogger
                                        </div>
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FileSpreadsheet size={14} /> File
                                        </div>
                                    </th>
                                    <th style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary, #aaa)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px', textTransform: 'uppercase' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Clock size={14} /> Date
                                        </div>
                                    </th>
                                    <th style={{ padding: '14px 20px', textAlign: 'center', color: 'var(--text-secondary, #aaa)', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border, #2a2a4a)' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ color: 'var(--text-primary, #fff)', fontWeight: '500' }}>
                                                {req.blogger_name || 'Unknown'}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary, #aaa)', fontSize: '12px' }}>
                                                {req.blogger_email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-primary, #fff)' }}>
                                            {req.file_name}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            {getStatusBadge(req.status)}
                                        </td>
                                        <td style={{ padding: '16px', color: 'var(--text-secondary, #aaa)', fontSize: '13px' }}>
                                            {new Date(req.created_at).toLocaleDateString()} {new Date(req.created_at).toLocaleTimeString()}
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button onClick={() => handleDownload(req.id)}
                                                    title="Download File"
                                                    style={{
                                                        padding: '8px', borderRadius: '6px',
                                                        backgroundColor: 'rgba(0,188,212,0.1)',
                                                        border: '1px solid var(--primary-cyan, #00bcd4)',
                                                        color: 'var(--primary-cyan, #00bcd4)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <Download size={16} />
                                                </button>
                                                {req.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleAccept(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            title="Accept"
                                                            style={{
                                                                padding: '8px', borderRadius: '6px',
                                                                backgroundColor: 'rgba(34,197,94,0.1)',
                                                                border: '1px solid #22c55e',
                                                                color: '#22c55e', cursor: 'pointer'
                                                            }}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button onClick={() => handleReject(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            title="Reject"
                                                            style={{
                                                                padding: '8px', borderRadius: '6px',
                                                                backgroundColor: 'rgba(239,68,68,0.1)',
                                                                border: '1px solid #ef4444',
                                                                color: '#ef4444', cursor: 'pointer'
                                                            }}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Accepted Files Section */}
            {acceptedRequests.length > 0 && (
                <div style={{
                    marginTop: '24px',
                    backgroundColor: 'var(--card-background, #1a1a2e)',
                    border: '1px solid #22c55e',
                    borderRadius: '12px', overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)',
                        borderBottom: '1px solid rgba(34,197,94,0.3)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={20} style={{ color: '#22c55e' }} />
                            <h3 style={{ margin: 0, color: '#22c55e', fontSize: '16px', fontWeight: '600' }}>
                                Accepted Files - Ready for Import ({acceptedRequests.length})
                            </h3>
                        </div>
                        <Link to="/admin/sites/add-excel" style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px', backgroundColor: '#22c55e',
                            border: 'none', borderRadius: '6px',
                            color: '#fff', fontWeight: '600', fontSize: '14px',
                            textDecoration: 'none', cursor: 'pointer'
                        }}>
                            <Upload size={16} />
                            Go to Add Excel File
                        </Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
                                    <th style={{ padding: '12px 20px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px' }}>Blogger</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px' }}>File</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary, #aaa)', fontSize: '12px' }}>Accepted Date</th>
                                    <th style={{ padding: '12px 20px', textAlign: 'center', color: 'var(--text-secondary, #aaa)', fontSize: '12px' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acceptedRequests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border, #2a2a4a)' }}>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ color: 'var(--text-primary, #fff)', fontWeight: '500' }}>
                                                {req.blogger_name || 'Unknown'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-primary, #fff)' }}>
                                            {req.file_name}
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary, #aaa)', fontSize: '13px' }}>
                                            {req.updated_at ? new Date(req.updated_at).toLocaleDateString() : new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                            <button onClick={() => handleDownload(req.id)}
                                                style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '8px 16px', borderRadius: '6px',
                                                    backgroundColor: 'rgba(0,188,212,0.1)',
                                                    border: '1px solid var(--primary-cyan, #00bcd4)',
                                                    color: 'var(--primary-cyan, #00bcd4)',
                                                    cursor: 'pointer', fontSize: '13px'
                                                }}
                                            >
                                                <Download size={14} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div style={{
                marginTop: '20px', padding: '16px',
                backgroundColor: 'var(--card-background, #1a1a2e)',
                border: '1px solid var(--border, #2a2a4a)',
                borderRadius: '8px'
            }}>
                <h4 style={{ color: 'var(--text-primary, #fff)', marginBottom: '12px' }}>Workflow:</h4>
                <ol style={{ color: 'var(--text-secondary, #aaa)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
                    <li><strong style={{ color: '#f59e0b' }}>Download</strong> the Excel file to review blogger's sites</li>
                    <li><strong style={{ color: '#22c55e' }}>Accept</strong> or <strong style={{ color: '#ef4444' }}>Reject</strong> the request</li>
                    <li>After accepting, go to <Link to="/admin/sites/add-excel" style={{ color: 'var(--primary-cyan, #00bcd4)' }}>Add Excel File</Link> to import the sites</li>
                    <li>Then create blogger accounts from <Link to="/admin/sites/create-account" style={{ color: 'var(--primary-cyan, #00bcd4)' }}>Create Account</Link> page</li>
                </ol>
            </div>
        </div>
    );
}
