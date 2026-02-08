import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ExternalLink, AlertTriangle, ChevronDown, ChevronUp, Package, User, Globe, Link2, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
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
        if (id) fetchOrderDetails();
    }, [fetchOrderDetails, id]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getUrl = (item, field = 'url') => item?.[field] || item?.url || item?.ourl || '';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: 'var(--primary-cyan)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-fadeIn">
                <div className="premium-card p-8 text-center" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--error)' }} />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--error)' }}>Error Loading Order</h3>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                    <button onClick={fetchOrderDetails} className="premium-btn premium-btn-accent">
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data?.order) {
        return <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>Order not found</div>;
    }

    const { order, processes } = data;
    const isGP = order.order_type === 'gp';
    const isNiche = order.order_type === 'niche';

    const teamProcess = processes?.find(p => p.status === 1);
    const teamPushedProcess = processes?.find(p => p.status === 1.5 || p.status_label === 'Team Pushed to Manager');
    const writerAssignedProcess = processes?.find(p => p.status === 2);
    const writerSubmittedProcess = processes?.find(p => p.status === 3);
    const bloggerProcess = processes?.find(p => p.status === 5);

    const assignments = bloggerProcess?.blogger_assignments ||
        writerSubmittedProcess?.blogger_assignments ||
        writerAssignedProcess?.blogger_assignments ||
        teamPushedProcess?.blogger_assignments ||
        teamProcess?.blogger_assignments || [];

    const isCompleted = assignments.some(a => a.status === 8 || a.submit_url);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="premium-btn premium-btn-outline flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Orders</span>
                </button>
                <button
                    onClick={fetchOrderDetails}
                    className="premium-btn premium-btn-outline flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Order ID Header */}
            <div className="premium-card p-6" style={{
                background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.1) 0%, rgba(255, 85, 0, 0.05) 100%)',
                borderColor: 'rgba(255, 140, 66, 0.3)'
            }}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{
                        background: 'var(--gradient-primary)',
                        boxShadow: '0 4px 15px rgba(255, 140, 66, 0.4)'
                    }}>
                        <Package size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Order #{order.order_id || id}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {order.client_name} • {isGP ? 'Guest Post' : 'Niche Edit'}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <span className={`status-badge ${isCompleted ? 'success' : 'info'}`}>
                            {isCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Message Section */}
            {order.message && (
                <div className="premium-card overflow-hidden animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <div className="px-6 py-4 border-b" style={{
                        borderColor: 'var(--border)',
                        background: 'linear-gradient(90deg, rgba(255, 140, 66, 0.1), transparent)'
                    }}>
                        <div className="flex items-center gap-2">
                            <FileText size={18} style={{ color: 'var(--primary-cyan)' }} />
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Message</span>
                        </div>
                    </div>
                    <div className="p-6" style={{ color: 'var(--text-secondary)' }}>
                        <div dangerouslySetInnerHTML={{ __html: order.message }} />
                    </div>
                </div>
            )}

            {/* Order Summary Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <SummaryCard label="Status" value={isCompleted ? 'Completed' : 'In Progress'} icon={<CheckCircle2 size={18} />} accent />
                <SummaryCard label="Order ID" value={order.order_id || '-'} icon={<Package size={18} />} />
                <SummaryCard label="Client" value={order.client_name || '-'} icon={<User size={18} />} />
                <SummaryCard label="Website" value={order.client_website || '-'} icon={<Globe size={18} />} link={order.client_website} />
                <SummaryCard label="Links" value={order.no_of_links || 1} icon={<Link2 size={18} />} />
                <SummaryCard label="Type" value={isGP ? 'Guest Post' : 'Niche Edit'} icon={<FileText size={18} />} />
                <SummaryCard label="Package" value={order.order_package || 'Standard'} icon={<Sparkles size={18} />} />
            </div>

            {/* Workflow Timeline */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock size={20} style={{ color: 'var(--primary-cyan)' }} />
                    Workflow Timeline
                </h2>

                {/* 1. New Order Created */}
                <WorkflowCard
                    step={1}
                    title="New Order Created"
                    date={formatDate(order.created_at)}
                    icon={<Package size={20} />}
                    delay="0.3s"
                >
                    <div className="flex items-center gap-2 p-4" style={{ color: 'var(--text-secondary)' }}>
                        <User size={16} style={{ color: 'var(--primary-cyan)' }} />
                        <span>Order Assigned to Team: </span>
                        <span className="font-semibold" style={{ color: 'var(--primary-cyan)' }}>
                            {teamProcess?.team_name || 'Not Assigned'}
                        </span>
                    </div>
                </WorkflowCard>

                {/* 2. Team Pushed to Manager */}
                {(teamPushedProcess || (teamProcess && assignments.length > 0)) && (
                    <WorkflowCard
                        step={2}
                        title="Team Pushed to Manager"
                        date={formatDate(teamPushedProcess?.created_at || teamProcess?.created_at)}
                        icon={<User size={20} />}
                        delay="0.4s"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full premium-table">
                                <thead>
                                    <tr>
                                        <th>Root Domain</th>
                                        <th>Price</th>
                                        {isGP && <th>URL</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map((item, idx) => (
                                        <tr key={idx}>
                                            <td style={{ color: 'var(--text-primary)' }}>{item.website || '-'}</td>
                                            <td style={{ color: 'var(--success)' }}>${item.price || '0'}</td>
                                            {isGP && (
                                                <td>
                                                    {getUrl(item) && (
                                                        <a href={getUrl(item)} target="_blank" rel="noreferrer"
                                                            className="flex items-center gap-1"
                                                            style={{ color: 'var(--primary-cyan)' }}>
                                                            <ExternalLink size={14} />
                                                            Link
                                                        </a>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {(teamPushedProcess?.note || teamProcess?.note) && (
                            <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                                <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>Note: </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{teamPushedProcess?.note || teamProcess?.note}</span>
                            </div>
                        )}
                    </WorkflowCard>
                )}

                {/* 3. Manager Pushed to Writer */}
                {writerAssignedProcess && (
                    <WorkflowCard
                        step={3}
                        title="Manager Pushed to Writer"
                        date={formatDate(writerAssignedProcess.created_at)}
                        icon={<FileText size={20} />}
                        delay="0.5s"
                    >
                        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                            <User size={16} style={{ color: 'var(--primary-cyan)' }} />
                            <span style={{ color: 'var(--text-muted)' }}>Writer:</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {writerAssignedProcess.writer_name || 'Not Assigned'}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            {assignments.map((item, idx) => (
                                <DetailGrid key={idx} items={[
                                    { label: 'Root Domain', value: item.website || '-' },
                                    { label: 'URL', value: item.ourl || getUrl(item), isLink: true },
                                    { label: 'Anchor', value: item.anchor || '-' },
                                    ...(isGP && item.title ? [{ label: 'Title', value: item.title }] : [])
                                ]} />
                            ))}
                        </div>
                    </WorkflowCard>
                )}

                {/* 4. Writer Pushed to Manager */}
                {writerSubmittedProcess && (
                    <WorkflowCard
                        step={4}
                        title="Writer Pushed to Manager"
                        date={formatDate(writerSubmittedProcess.created_at)}
                        icon={<CheckCircle2 size={20} />}
                        delay="0.6s"
                    >
                        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                            <User size={16} style={{ color: 'var(--primary-cyan)' }} />
                            <span style={{ color: 'var(--text-muted)' }}>Writer:</span>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {writerSubmittedProcess.writer_name || writerAssignedProcess?.writer_name || 'N/A'}
                            </span>
                        </div>
                        {(writerSubmittedProcess.blogger_assignments || assignments).map((item, idx) => (
                            <DetailGrid key={idx} items={[
                                { label: 'Root Domain', value: item.website || '-' },
                                ...(isNiche ? [
                                    { label: 'Type', value: 'replace' },
                                    { label: 'Replace With', value: item.insert_after || '-' },
                                    { label: 'Replace Statement', value: item.statement || '-' }
                                ] : []),
                                ...(isGP && item.doc_urls ? [{ label: 'Doc URLs', value: item.doc_urls, isLink: true }] : []),
                                { label: 'URL', value: item.ourl || getUrl(item), isLink: true },
                                { label: 'Anchor', value: item.anchor || '-' },
                                { label: 'POST URL', value: item.submit_url || item.ourl, isLink: true },
                                { label: 'Note', value: item.note || 'Done.' }
                            ]} />
                        ))}
                    </WorkflowCard>
                )}

                {/* 5. Manager Pushed to Blogger */}
                {bloggerProcess && (
                    <WorkflowCard
                        step={5}
                        title="Manager Pushed to Blogger"
                        date={formatDate(bloggerProcess.created_at)}
                        icon={<Globe size={20} />}
                        completed={isCompleted}
                        delay="0.7s"
                    >
                        {(bloggerProcess.blogger_assignments || assignments).map((item, idx) => (
                            <div key={idx} className="mb-4 last:mb-0">
                                <DetailGrid items={[
                                    { label: 'Root Domain', value: item.website || '-' },
                                    { label: 'Blogger Email', value: item.blogger_email || '-' }
                                ]} />

                                {/* Completion Banner */}
                                {(item.status === 8 || item.submit_url) && (
                                    <div className="mx-4 mb-4 p-4 rounded-xl flex items-center justify-between" style={{
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)'
                                    }}>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                                            <span className="font-semibold" style={{ color: 'var(--success)' }}>
                                                Manager Verified and Complete Order
                                            </span>
                                        </div>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {item.updated_at ? formatDate(item.updated_at) : ''}
                                        </span>
                                    </div>
                                )}

                                <DetailGrid items={[
                                    { label: 'Live URL', value: item.submit_url, isLink: true, highlight: !!item.submit_url }
                                ]} />
                            </div>
                        ))}
                    </WorkflowCard>
                )}
            </div>
        </div>
    );
};

// Premium Summary Card Component
const SummaryCard = ({ label, value, icon, link, accent }) => (
    <div className="premium-card p-4 hover:scale-105 transition-transform duration-300" style={accent ? {
        background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.15) 0%, rgba(255, 85, 0, 0.08) 100%)',
        borderColor: 'rgba(255, 140, 66, 0.3)'
    } : {}}>
        <div className="flex items-center gap-2 mb-2" style={{ color: accent ? 'var(--primary-cyan)' : 'var(--text-muted)' }}>
            {icon}
            <span className="text-xs uppercase tracking-wide">{label}</span>
        </div>
        {link ? (
            <a href={link.startsWith('http') ? link : `https://${link}`}
                target="_blank" rel="noreferrer"
                className="font-semibold text-sm truncate block hover:underline"
                style={{ color: 'var(--primary-cyan)' }}>
                {value}
            </a>
        ) : (
            <p className="font-semibold text-sm truncate" style={{ color: accent ? 'var(--primary-cyan)' : 'var(--text-primary)' }}>
                {value}
            </p>
        )}
    </div>
);

// Premium Workflow Card Component
const WorkflowCard = ({ step, title, date, icon, children, completed, delay = '0s' }) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <div
            className="premium-card overflow-hidden animate-slideUp"
            style={{
                animationDelay: delay,
                ...(completed && {
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)'
                })
            }}
        >
            {/* Card Header */}
            <div
                className="px-6 py-4 cursor-pointer flex items-center justify-between transition-all duration-300"
                style={{
                    background: completed
                        ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.15) 0%, transparent 100%)'
                        : 'linear-gradient(90deg, rgba(255, 140, 66, 0.1) 0%, transparent 100%)',
                    borderBottom: expanded ? '1px solid var(--border)' : 'none'
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                        background: completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 140, 66, 0.2)',
                        color: completed ? 'var(--success)' : 'var(--primary-cyan)'
                    }}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mr-2" style={{
                                background: 'var(--gradient-primary)',
                                color: 'white'
                            }}>{step}</span>
                            {title}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {completed && (
                        <span className="status-badge success">
                            <CheckCircle2 size={12} /> Complete
                        </span>
                    )}
                    {expanded ? <ChevronUp size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                </div>
            </div>

            {/* Card Content */}
            <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

// Detail Grid Component for consistent key-value display
const DetailGrid = ({ items }) => (
    <div className="grid gap-0">
        {items.filter(item => item.value).map((item, idx) => (
            <div key={idx} className="grid grid-cols-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 font-medium text-sm" style={{
                    color: 'var(--text-muted)',
                    background: 'rgba(0,0,0,0.1)'
                }}>
                    {item.label}
                </div>
                <div className="col-span-2 px-4 py-3 text-sm" style={{
                    color: item.highlight ? 'var(--success)' : 'var(--text-primary)'
                }}>
                    {item.isLink && item.value ? (
                        <a href={item.value} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 hover:underline"
                            style={{ color: 'var(--primary-cyan)' }}>
                            <ExternalLink size={14} />
                            <span className="truncate max-w-md">{item.value}</span>
                        </a>
                    ) : (
                        item.value || '-'
                    )}
                </div>
            </div>
        ))}
    </div>
);

export default AdminOrderDetails;
