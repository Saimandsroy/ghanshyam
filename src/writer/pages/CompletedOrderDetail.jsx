import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Download, FileText } from 'lucide-react';
import { writerAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

/**
 * Writer Completed Order Detail Page
 * Dark theme with grouped tables:
 * - Header: Status & Order ID
 * - Section 1: Manager Pushed to Writer (ALL websites in one table)
 * - Section 2: Writer Pushed to Manager (ALL submissions in one table)
 */
export function CompletedOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await writerAPI.getCompletedOrderDetail(id);
                setOrder(response.order);
            } catch (err) {
                console.error('Error fetching order details:', err);
                showError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrderDetails();
        }
    }, [id, showError]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
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

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--background-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
                <p className="text-[var(--text-muted)] font-medium">Order not found</p>
                <button
                    onClick={() => navigate('/writer/completed-orders')}
                    className="mt-4 premium-btn premium-btn-primary"
                >
                    Back to Completed Orders
                </button>
            </div>
        );
    }

    const details = order.details || [];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <Link to="/writer/completed-orders" className="hover:text-[var(--primary-cyan)] transition-colors">
                    Completed Orders
                </Link>
                <span>›</span>
                <span className="text-[var(--text-secondary)]">Order Detail</span>
            </div>

            {/* Page Title */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-3 text-[var(--text-primary)]">
                    Order Detail
                </h1>
                <button
                    onClick={() => navigate('/writer/completed-orders')}
                    className="premium-btn premium-btn-ghost text-sm"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </button>
            </div>

            {/* Status & Order ID Card */}
            <div className="premium-card p-6">
                <div className="grid grid-cols-2 divide-x divide-[var(--border)]">
                    <div className="px-6 text-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Status</div>
                        <span
                            className="premium-badge inline-flex"
                            style={{
                                backgroundColor: order.status === 'Completed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: order.status === 'Completed' ? '#22C55E' : '#3B82F6'
                            }}
                        >
                            {order.status || 'Submitted'}
                        </span>
                    </div>
                    <div className="px-6 text-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Order ID</div>
                        <div className="text-lg font-bold text-[var(--primary-cyan)]">{order.manual_order_id}</div>
                    </div>
                </div>
            </div>

            {/* Section 1: Manager Pushed to Writer */}
            <div className="premium-card overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background-dark)]">
                    <span className="font-bold text-[var(--text-primary)]">Manager Pushed to Writer</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{formatDate(order.manager_pushed_date)}</span>
                </div>

                <div className="premium-table-container rounded-none border-0">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="w-12">#</th>
                                <th>Root Domain</th>
                                <th>URL</th>
                                <th>Anchor</th>
                                <th>Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={detail.id || index} className="group">
                                    <td className="text-[var(--text-muted)]">{index + 1}</td>
                                    <td className="font-medium text-[var(--text-primary)]">{detail.root_domain || '-'}</td>
                                    <td>
                                        {detail.url ? (
                                            <a
                                                href={detail.url.startsWith('http') ? detail.url : `https://${detail.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:text-[var(--primary-cyan)] transition-colors text-[var(--text-secondary)]"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                <span className="max-w-xs truncate">{detail.url}</span>
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="text-[var(--text-secondary)]">{detail.anchor || '-'}</td>
                                    <td>
                                        {detail.title ? (
                                            detail.title.startsWith('http') ? (
                                                <a
                                                    href={detail.title}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-[var(--primary-cyan)] transition-colors text-[var(--text-secondary)]"
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    <span className="max-w-xs truncate">View Doc</span>
                                                </a>
                                            ) : (
                                                <span className="text-[var(--text-secondary)]">{detail.title}</span>
                                            )
                                        ) : '-'}
                                    </td>
                                </tr>
                            ))}
                            {details.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">
                                        No websites assigned details found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Section 2: Writer Pushed to Manager */}
            <div className="premium-card overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background-dark)]">
                    <span className="font-bold text-[var(--text-primary)]">Writer Pushed to Manager</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">{formatDate(order.writer_pushed_date)}</span>
                </div>

                <div className="premium-table-container rounded-none border-0">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th className="w-12">#</th>
                                <th>Root Domain</th>
                                <th>Doc URLs</th>
                                <th>Upload Doc</th>
                                <th>Insert After</th>
                                <th>Statement</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={detail.id || index} className="group">
                                    <td className="text-[var(--text-muted)]">{index + 1}</td>
                                    <td className="font-medium text-[var(--text-primary)]">{detail.root_domain || '-'}</td>
                                    <td>
                                        {detail.doc_urls ? (
                                            <a
                                                href={detail.doc_urls.startsWith('http') ? detail.doc_urls : `https://${detail.doc_urls}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:text-[var(--primary-cyan)] transition-colors text-[var(--text-secondary)]"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                <span className="max-w-xs truncate">View Doc</span>
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        {detail.upload_doc_file ? (
                                            <a
                                                href={detail.upload_doc_file}
                                                download
                                                className="flex items-center gap-1 hover:text-[var(--primary-cyan)] transition-colors text-[var(--text-secondary)]"
                                            >
                                                <Download className="h-3 w-3" />
                                                Download
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="text-[var(--text-secondary)] max-w-xs truncate" title={detail.insert_after}>
                                        {detail.insert_after || '-'}
                                    </td>
                                    <td className="text-[var(--text-secondary)] max-w-xs truncate" title={detail.statement}>
                                        {detail.statement || '-'}
                                    </td>
                                    <td className="text-[var(--text-secondary)] max-w-xs truncate" title={detail.note}>
                                        {detail.note || '-'}
                                    </td>
                                </tr>
                            ))}
                            {details.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)]">
                                        No submission details found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
