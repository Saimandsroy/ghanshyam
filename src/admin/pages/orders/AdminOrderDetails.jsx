import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ExternalLink, User, Users, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Link2, Edit3, Send, Eye } from 'lucide-react';
import { adminAPI } from '../../../lib/api';

export const AdminOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrderDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await adminAPI.getOrderDetails(id);
            setData(response);
        } catch (err) {
            console.error('Error fetching order details:', err);
            setError(err.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchOrderDetails();
        }
    }, [fetchOrderDetails, id]);

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
        const styles = {
            'Team Assigned': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' },
            'Team Submitted': { bg: 'rgba(107, 240, 255, 0.2)', color: '#6BF0FF' },
            'Writer Assigned': { bg: 'rgba(168, 85, 247, 0.2)', color: '#A855F7' },
            'Writer Submitted': { bg: 'rgba(99, 102, 241, 0.2)', color: '#6366F1' },
            'Completed': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' },
            'Blogger Submitted': { bg: 'rgba(20, 184, 166, 0.2)', color: '#14B8A6' },
            'In Review': { bg: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' },
            'Rejected': { bg: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' },
            'Archived': { bg: 'rgba(107, 114, 128, 0.2)', color: '#6B7280' },
            'Pending': { bg: 'rgba(251, 146, 60, 0.2)', color: '#FB923C' },
            'Manager Review': { bg: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' },
            'Blogger Pushed': { bg: 'rgba(16, 185, 129, 0.2)', color: '#10B981' },
        };
        return styles[status] || { bg: 'rgba(107, 114, 128, 0.2)', color: '#6B7280' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="h-8 w-8 animate-spin" style={{ color: 'var(--primary-cyan)' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" style={{ color: '#EF4444' }} />
                    <p className="mb-4" style={{ color: '#EF4444' }}>{error}</p>
                    <button
                        onClick={fetchOrderDetails}
                        className="px-4 py-2 rounded-lg font-medium"
                        style={{ background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)', color: 'var(--background-dark)' }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data?.order) {
        return (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Order not found</div>
        );
    }

    const { order, processes } = data;
    const isGuestPost = order.order_type === 'gp';
    const isNicheEdit = order.order_type === 'niche';

    // Find processes by status
    const teamAssignedProcess = processes.find(p => p.status === 1);
    const writerAssignedProcess = processes.find(p => p.status === 2);
    const writerSubmittedProcess = processes.find(p => p.status === 3);
    const bloggerPushedProcess = processes.find(p => p.status === 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Order: {order.order_id}</h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ID: {order.id} • Created: {formatDate(order.created_at)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                            backgroundColor: isGuestPost ? 'rgba(168, 85, 247, 0.2)' : 'rgba(107, 240, 255, 0.2)',
                            color: isGuestPost ? '#A855F7' : '#6BF0FF'
                        }}
                    >
                        {isGuestPost ? 'Guest Post' : 'Niche Edit'}
                    </span>
                    <button onClick={fetchOrderDetails} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
                    </button>
                </div>
            </div>

            {/* Order Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Order Type', value: isGuestPost ? 'Guest Post' : isNicheEdit ? 'Niche Edit' : order.order_type || 'N/A' },
                    { label: 'Package', value: order.order_package || 'Standard' },
                    { label: 'Client', value: order.client_name || 'N/A' },
                    { label: 'Category', value: order.category || 'General' },
                    { label: 'No of Links', value: order.no_of_links || 0, highlight: true }
                ].map((item, idx) => (
                    <div key={idx} className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                        <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                        <div className="font-medium text-lg" style={{ color: item.highlight ? 'var(--primary-cyan)' : 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Client Website</div>
                    {order.client_website ? (
                        <a
                            href={order.client_website.startsWith('http') ? order.client_website : `https://${order.client_website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 hover:underline"
                            style={{ color: 'var(--primary-cyan)' }}
                        >
                            {order.client_website}
                            <ExternalLink size={14} />
                        </a>
                    ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Not specified</span>
                    )}
                </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Manager</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.manager_name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.manager_email}</div>
                </div>
            </div>

            {/* Order Instructions */}
            {order.message && (
                <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <FileText size={18} />
                        Order Instructions
                    </h3>
                    <div
                        className="prose prose-invert prose-sm max-w-none p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--background-dark)', color: 'var(--text-primary)' }}
                        dangerouslySetInnerHTML={{ __html: order.message }}
                    />
                </div>
            )}

            {/* Step 1: Team Assigned */}
            {teamAssignedProcess && (
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="p-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)', color: '#93C5FD' }}>1</div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Users size={18} style={{ color: '#3B82F6' }} />
                                        Team Assigned To Order
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Team selected websites for this order</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>Completed</span>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(teamAssignedProcess.created_at)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Team Name</div>
                                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{teamAssignedProcess.team_name || 'Not assigned'}</div>
                            </div>
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Team Email</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{teamAssignedProcess.team_email || 'N/A'}</div>
                            </div>
                        </div>
                        {teamAssignedProcess.blogger_assignments?.length > 0 && (
                            <div>
                                <h4 className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Submitted Websites ({teamAssignedProcess.blogger_assignments.length})</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                                            <tr>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>#</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Root Domain</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>DA</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>DR</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teamAssignedProcess.blogger_assignments.map((item, idx) => (
                                                <tr key={item.id} className="hover:bg-white/5" style={{ borderTop: '1px solid var(--border)' }}>
                                                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: 'var(--primary-cyan)' }}>
                                                            {item.website}
                                                        </a>
                                                    </td>
                                                    <td className="px-4 py-3" style={{ color: '#3B82F6' }}>{item.da || '-'}</td>
                                                    <td className="px-4 py-3" style={{ color: '#22C55E' }}>{item.dr || '-'}</td>
                                                    <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>${item.price || 0}</td>
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

            {/* Step 2: Writer Assigned */}
            {writerAssignedProcess && (
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="p-4" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderBottom: '1px solid rgba(168, 85, 247, 0.2)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(168, 85, 247, 0.3)', color: '#C4B5FD' }}>2</div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Send size={18} style={{ color: '#A855F7' }} />
                                        Manager Pushed To Writer
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {isGuestPost ? 'Writer creates content with anchor text' : 'Writer identifies link insertion points'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>Completed</span>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(writerAssignedProcess.created_at)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Writer Name</div>
                                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{writerAssignedProcess.writer_name || 'Not assigned'}</div>
                            </div>
                            <div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Writer Email</div>
                                <div style={{ color: 'var(--text-secondary)' }}>{writerAssignedProcess.writer_email || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Writer Submitted */}
            {writerSubmittedProcess && (
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="p-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)', color: '#A5B4FC' }}>3</div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Edit3 size={18} style={{ color: '#6366F1' }} />
                                        Writer Submitted Work
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        {isGuestPost ? 'Writer submitted articles for review' : 'Writer submitted insertion points'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>Completed</span>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(writerSubmittedProcess.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Blogger Pushed */}
            {bloggerPushedProcess && (
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <div className="p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)', color: '#6EE7B7' }}>4</div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Link2 size={18} style={{ color: '#10B981' }} />
                                        Manager Pushed To Blogger
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Bloggers assigned to publish content and submit live URLs</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' }}>In Progress</span>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatDate(bloggerPushedProcess.created_at)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        {bloggerPushedProcess.blogger_assignments?.length > 0 && (
                            <div>
                                <h4 className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Blogger Assignments ({bloggerPushedProcess.blogger_assignments.length})</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead style={{ backgroundColor: 'var(--background-dark)' }}>
                                            <tr>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>#</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Root Domain</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Blogger</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Status</th>
                                                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-muted)' }}>Submit URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bloggerPushedProcess.blogger_assignments.map((item, idx) => {
                                                const statusStyle = getStatusBadge(item.status_label);
                                                return (
                                                    <tr key={item.id} className="hover:bg-white/5" style={{ borderTop: '1px solid var(--border)' }}>
                                                        <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                                                        <td className="px-4 py-3">
                                                            <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: 'var(--primary-cyan)' }}>
                                                                {item.website}
                                                            </a>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div style={{ color: 'var(--text-primary)' }}>{item.blogger_name || 'Not assigned'}</div>
                                                            {item.blogger_email && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.blogger_email}</div>}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                                                                {item.status_label}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.submit_url ? (
                                                                <a href={item.submit_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: '#22C55E' }}>
                                                                    <CheckCircle size={14} />
                                                                    View Live
                                                                </a>
                                                            ) : (
                                                                <span className="flex items-center gap-1" style={{ color: '#FB923C' }}>
                                                                    <Clock size={14} />
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* No Workflow Started */}
            {(!processes || processes.length === 0) && (
                <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No workflow processes started yet</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrderDetails;
