import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ExternalLink, User, Users, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Link2, Edit3, Send, Eye, Wifi, WifiOff } from 'lucide-react';
import { managerAPI } from '../../../lib/api';
import { useSocket } from '../../../context/SocketContext.jsx';
import { Layout } from '../../components/layout/Layout';

export const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { socket, isConnected, joinOrderRoom, leaveOrderRoom } = useSocket();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await managerAPI.getOrderDetails(id);
            setData(response);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(err.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    // Join order room for real-time updates
    useEffect(() => {
        if (socket && isConnected && id) {
            joinOrderRoom(id);

            // Listen for order detail updates
            socket.on('order-detail-updated', (data) => {
                console.log('📡 Real-time: Order detail updated', data);
                fetchOrderDetails();
            });

            // Listen for workflow changes
            socket.on('workflow-changed', (data) => {
                console.log('📡 Real-time: Workflow changed', data);
                if (String(data.orderId) === String(id)) {
                    fetchOrderDetails();
                }
            });

            // Listen for URL submissions
            socket.on('url-submitted', (data) => {
                console.log('📡 Real-time: URL submitted', data);
                if (String(data.orderId) === String(id)) {
                    fetchOrderDetails();
                }
            });
        }

        return () => {
            if (socket && id) {
                leaveOrderRoom(id);
                socket.off('order-detail-updated');
                socket.off('workflow-changed');
                socket.off('url-submitted');
            }
        };
    }, [socket, isConnected, id, joinOrderRoom, leaveOrderRoom, fetchOrderDetails]);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const style = {
            'Team Assigned': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
            'Team Submitted': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
            'Writer Assigned': 'border-purple-500/30 bg-purple-500/10 text-purple-300',
            'Writer Submitted': 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
            'Completed': 'border-green-500/30 bg-green-500/10 text-green-300',
            'Blogger Submitted': 'border-teal-500/30 bg-teal-500/10 text-teal-300',
            'In Review': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
            'Rejected': 'border-red-500/30 bg-red-500/10 text-red-300',
            'Archived': 'border-gray-600/30 bg-gray-600/10 text-gray-400',
            'Pending': 'border-orange-500/30 bg-orange-500/10 text-orange-300',
            'Manager Review': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
            'Blogger Pushed': 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        };
        return style[status] || 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin text-[var(--primary-cyan)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={fetchOrderDetails} className="premium-btn premium-btn-accent">Retry</button>
                </div>
            </div>
        );
    }

    if (!data?.order) {
        return (
            <div className="p-6">
                <div className="text-center text-[var(--text-muted)] py-12">Order not found</div>
            </div>
        );
    }

    const { order, processes } = data;
    const isGuestPost = order.order_type === 'gp';
    const isNicheEdit = order.order_type === 'niche';

    // Find processes by status
    const teamAssignedProcess = processes.find(p => p.status === 1);
    const writerAssignedProcess = processes.find(p => p.status === 2);
    const writerSubmittedProcess = processes.find(p => p.status === 3);
    const managerReviewProcess = processes.find(p => p.status === 4);
    const bloggerPushedProcess = processes.find(p => p.status === 5);

    return (
        <Layout>
            <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/manager/orders/view')} className="p-2.5 rounded-xl hover:bg-white/10 text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border)]">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Order #{order.order_id}</h1>
                                <span className={`premium-badge rounded-md border ${isGuestPost ? 'border-purple-500/30 bg-purple-500/10 text-purple-300' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'}`}>
                                    {isGuestPost ? 'Guest Post' : 'Niche Edit'}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-2">
                                <span>ID: {order.id}</span>
                                <span>•</span>
                                <Clock size={12} /> {formatDate(order.created_at)}
                            </p>
                        </div>
                    </div>
                    <button onClick={fetchOrderDetails} className="premium-btn border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>

                {/* Order Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="premium-card p-5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Order Type</div>
                        <div className="font-semibold text-lg text-[var(--text-primary)]">
                            {isGuestPost ? 'Guest Post' : isNicheEdit ? 'Niche Edit' : order.order_type || 'N/A'}
                        </div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Package</div>
                        <div className="font-medium text-[var(--text-primary)] text-sm">{order.order_package || 'Standard'}</div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Client</div>
                        <div className="font-medium text-[var(--text-primary)]">{order.client_name || 'N/A'}</div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Category</div>
                        <div className="font-medium text-[var(--text-primary)]">{order.category || 'General'}</div>
                    </div>
                    <div className="premium-card p-5">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Links</div>
                        <div className="font-bold text-2xl text-[var(--primary-cyan)]">{order.no_of_links || 0}</div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="premium-card p-6">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Client Website</div>
                        {order.client_website ? (
                            <a href={order.client_website.startsWith('http') ? order.client_website : `https://${order.client_website}`} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline flex items-center gap-2 text-lg font-medium">
                                <img src={`https://www.google.com/s2/favicons?domain=${order.client_website}&sz=32`} className="w-5 h-5 rounded-sm" alt="" />
                                {order.client_website}
                                <ExternalLink size={16} />
                            </a>
                        ) : (
                            <span className="text-gray-500">Not specified</span>
                        )}
                    </div>
                    <div className="premium-card p-6">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Manager</div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--background-dark)] flex items-center justify-center border border-[var(--border)]">
                                <User size={20} className="text-[var(--text-secondary)]" />
                            </div>
                            <div>
                                <div className="font-medium text-[var(--text-primary)]">{order.manager_name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{order.manager_email}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Instructions */}
                {order.message && (
                    <div className="premium-card p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                            <FileText size={18} className="text-[var(--text-secondary)]" />
                            Order Instructions
                        </h3>
                        <div
                            className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)] bg-[var(--background-dark)] p-5 rounded-xl border border-[var(--border)]"
                            dangerouslySetInnerHTML={{ __html: order.message }}
                        />
                    </div>
                )}

                {/* ==================== STEP 1: TEAM ASSIGNED TO ORDER ==================== */}
                {teamAssignedProcess && (
                    <div className="premium-card">
                        <div className="bg-gradient-to-r from-blue-500/10 to-transparent border-b border-blue-500/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">1</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                                            Team Assigned To Order
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">Team selected websites for this order</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`premium-badge ${getStatusBadge('Team Assigned')}`}>Completed</span>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{formatDate(teamAssignedProcess.created_at)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-[var(--background-dark)] rounded-xl border border-[var(--border)]">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Team Name</div>
                                    <div className="text-[var(--text-primary)] font-medium flex items-center gap-2">
                                        <Users size={14} className="text-blue-400" />
                                        {teamAssignedProcess.team_name || 'Not assigned'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Team Email</div>
                                    <div className="text-[var(--text-secondary)]">{teamAssignedProcess.team_email || 'N/A'}</div>
                                </div>
                            </div>

                            {teamAssignedProcess.blogger_assignments?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Submitted Websites ({teamAssignedProcess.blogger_assignments.length})</h4>
                                    <div className="premium-table-container">
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-12">#</th>
                                                    <th>Root Domain</th>
                                                    <th>DA</th>
                                                    <th>DR</th>
                                                    <th className="text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teamAssignedProcess.blogger_assignments.map((item, idx) => (
                                                    <tr key={item.id}>
                                                        <td className="text-[var(--text-muted)]">{idx + 1}</td>
                                                        <td>
                                                            <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline font-medium">
                                                                {item.website}
                                                            </a>
                                                        </td>
                                                        <td className="text-blue-400 font-semibold">{item.da || '-'}</td>
                                                        <td className="text-green-400 font-semibold">{item.dr || '-'}</td>
                                                        <td className="text-right text-[var(--text-primary)] font-mono">${item.price || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== STEP 2: MANAGER PUSHED TO WRITER ==================== */}
                {writerAssignedProcess && (
                    <div className="premium-card">
                        <div className="bg-gradient-to-r from-purple-500/10 to-transparent border-b border-purple-500/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl shadow-[0_0_15px_rgba(168,85,247,0.2)]">2</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                                            Manager Pushed To Writer
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {isGuestPost ? 'Writer creates content with anchor text' : 'Writer identifies link insertion points'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`premium-badge ${getStatusBadge('Writer Assigned')}`}>Completed</span>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{formatDate(writerAssignedProcess.created_at)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-[var(--background-dark)] rounded-xl border border-[var(--border)]">
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Writer Name</div>
                                    <div className="text-[var(--text-primary)] font-medium flex items-center gap-2">
                                        <Edit3 size={14} className="text-purple-400" />
                                        {writerAssignedProcess.writer_name || 'Not assigned'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-[var(--text-muted)] uppercase mb-1">Writer Email</div>
                                    <div className="text-[var(--text-secondary)]">{writerAssignedProcess.writer_email || 'N/A'}</div>
                                </div>
                            </div>

                            {writerAssignedProcess.blogger_assignments?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Assigned Work ({writerAssignedProcess.blogger_assignments.length})</h4>
                                    <div className="premium-table-container">
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-12">#</th>
                                                    <th>Root Domain</th>
                                                    <th>Anchor</th>
                                                    <th>Client URL</th>
                                                    <th className="text-right">Content Doc</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {writerAssignedProcess.blogger_assignments.map((item, idx) => (
                                                    <tr key={item.id}>
                                                        <td className="text-[var(--text-muted)]">{idx + 1}</td>
                                                        <td>
                                                            <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline font-medium">
                                                                {item.website}
                                                            </a>
                                                        </td>
                                                        <td className="text-[var(--text-primary)]">{item.anchor || '-'}</td>
                                                        <td>
                                                            {item.ourl ? (
                                                                <a href={item.ourl} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline text-xs">
                                                                    {item.ourl.length > 40 ? item.ourl.substring(0, 40) + '...' : item.ourl}
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                        <td className="text-right">
                                                            {item.title ? (
                                                                <a href={item.title} target="_blank" rel="noreferrer" className="premium-badge border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors">
                                                                    <FileText size={12} /> View Doc
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== STEP 3: WRITER SUBMITTED WORK ==================== */}
                {writerSubmittedProcess && (
                    <div className="premium-card">
                        <div className="bg-gradient-to-r from-indigo-500/10 to-transparent border-b border-indigo-500/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">3</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                                            Writer Submitted Work
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {isGuestPost ? 'Writer submitted articles for review' : 'Writer submitted insertion points'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`premium-badge ${getStatusBadge('Writer Submitted')}`}>Completed</span>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{formatDate(writerSubmittedProcess.created_at)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {writerSubmittedProcess.blogger_assignments?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Submitted Work ({writerSubmittedProcess.blogger_assignments.length})</h4>
                                    <div className="premium-table-container">
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-12">#</th>
                                                    <th>Root Domain</th>
                                                    <th>Anchor</th>
                                                    <th>Client URL</th>
                                                    <th>Content Doc</th>
                                                    {isNicheEdit && <th>Insert After</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {writerSubmittedProcess.blogger_assignments.map((item, idx) => (
                                                    <tr key={item.id}>
                                                        <td className="text-[var(--text-muted)]">{idx + 1}</td>
                                                        <td>
                                                            <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline font-medium">
                                                                {item.website}
                                                            </a>
                                                        </td>
                                                        <td className="text-[var(--text-primary)]">{item.anchor || '-'}</td>
                                                        <td>
                                                            {item.ourl ? (
                                                                <a href={item.ourl} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline text-xs">
                                                                    {item.ourl.length > 40 ? item.ourl.substring(0, 40) + '...' : item.ourl}
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                        <td>
                                                            {item.doc_urls ? (
                                                                <a href={item.doc_urls} target="_blank" rel="noreferrer" className="premium-badge border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors">
                                                                    <FileText size={12} /> View Doc
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                        {isNicheEdit && (
                                                            <td className="text-[var(--text-secondary)]">
                                                                {item.insert_after ? (
                                                                    <div className="truncate max-w-[200px]" title={item.insert_after}>
                                                                        {item.insert_after}
                                                                    </div>
                                                                ) : '-'}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== STEP 4: MANAGER PUSHED TO BLOGGER ==================== */}
                {bloggerPushedProcess && (
                    <div className="premium-card">
                        <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border-b border-emerald-500/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">4</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                                            Manager Pushed To Blogger
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">Bloggers assigned to publish content and submit live URLs</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`premium-badge ${getStatusBadge('Blogger Pushed')}`}>In Progress</span>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{formatDate(bloggerPushedProcess.created_at)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {bloggerPushedProcess.blogger_assignments?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Blogger Assignments ({bloggerPushedProcess.blogger_assignments.length})</h4>
                                    <div className="premium-table-container">
                                        <table className="premium-table">
                                            <thead>
                                                <tr>
                                                    <th className="w-12">#</th>
                                                    <th>Root Domain</th>
                                                    <th>Blogger</th>
                                                    <th>Anchor</th>
                                                    <th>Client URL</th>
                                                    <th>Content</th>
                                                    <th>Status</th>
                                                    <th className="text-right">Submit URL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bloggerPushedProcess.blogger_assignments.map((item, idx) => (
                                                    <tr key={item.id}>
                                                        <td className="text-[var(--text-muted)]">{idx + 1}</td>
                                                        <td>
                                                            <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline font-medium">
                                                                {item.website}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <div className="text-[var(--text-primary)] font-medium">{item.blogger_name || 'Not assigned'}</div>
                                                            {item.blogger_email && <div className="text-xs text-[var(--text-muted)]">{item.blogger_email}</div>}
                                                        </td>
                                                        <td className="text-[var(--text-primary)]">{item.anchor || '-'}</td>
                                                        <td>
                                                            {item.ourl ? (
                                                                <a href={item.ourl} target="_blank" rel="noreferrer" className="text-[var(--primary-cyan)] hover:underline text-xs">
                                                                    {item.ourl.length > 30 ? item.ourl.substring(0, 30) + '...' : item.ourl}
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                        <td>
                                                            {item.doc_urls ? (
                                                                <a href={item.doc_urls} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
                                                                    <FileText size={16} />
                                                                </a>
                                                            ) : <span className="text-gray-500">-</span>}
                                                        </td>
                                                        <td>
                                                            <span className={`premium-badge ${getStatusBadge(item.status_label)}`}>
                                                                {item.status_label}
                                                            </span>
                                                        </td>
                                                        <td className="text-right">
                                                            {item.submit_url ? (
                                                                <a href={item.submit_url} target="_blank" rel="noreferrer" className="premium-badge border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors">
                                                                    <CheckCircle size={12} /> View Live
                                                                </a>
                                                            ) : (
                                                                <span className="text-orange-400 flex items-center justify-end gap-1 text-xs">
                                                                    <Clock size={12} /> Pending
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ==================== STEP 5: MANAGER VERIFIED (if applicable) ==================== */}
                {bloggerPushedProcess?.blogger_assignments?.some(a => a.status === 8 || a.submit_url) && (
                    <div className="premium-card">
                        <div className="bg-gradient-to-r from-green-500/10 to-transparent border-b border-green-500/10 p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.2)]">5</div>
                                    <div>
                                        <h3 className="font-bold text-[var(--text-primary)] text-lg flex items-center gap-2">
                                            Manager Verified & Completed
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">Links verified and order marked complete</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="premium-table-container">
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th className="w-12">#</th>
                                            <th>Root Domain</th>
                                            <th>Live URL</th>
                                            <th className="text-right">Completed At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bloggerPushedProcess.blogger_assignments
                                            .filter(a => a.submit_url)
                                            .map((item, idx) => (
                                                <tr key={item.id}>
                                                    <td className="text-[var(--text-muted)]">{idx + 1}</td>
                                                    <td className="text-[var(--text-primary)] font-medium">{item.website}</td>
                                                    <td>
                                                        <a href={item.submit_url} target="_blank" rel="noreferrer" className="text-green-400 hover:underline flex items-center gap-1.5 font-medium">
                                                            <CheckCircle size={14} />
                                                            {item.submit_url.substring(0, 50)}...
                                                        </a>
                                                    </td>
                                                    <td className="text-right text-[var(--text-muted)]">{formatDate(item.updated_at)}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Workflow Started */}
                {(!processes || processes.length === 0) && (
                    <div className="premium-card p-12 text-center border-dashed">
                        <div className="w-20 h-20 rounded-full bg-[var(--background-dark)] flex items-center justify-center mx-auto mb-4 border border-[var(--border)]">
                            <Clock className="h-10 w-10 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Activity Yet</h3>
                        <p className="text-[var(--text-muted)]">No workflow processes have started for this order.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default OrderDetails;
