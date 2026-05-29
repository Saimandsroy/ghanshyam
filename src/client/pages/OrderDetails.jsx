import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../../lib/api';
import { ArrowLeft, Globe, Clock, CheckCircle, Send, Package, Link2, FileText, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const STATUS_CONFIG = {
  pending_review: { label: 'Pending Review', color: 'amber' },
  manager_processing: { label: 'Manager Processing', color: 'blue' },
  pushed_to_blogger: { label: 'With Blogger', color: 'purple' },
  completed: { label: 'Completed', color: 'emerald' },
  completed_with_rejections: { label: 'Completed (Partial Refund)', color: 'teal' },
  rejected: { label: 'Rejected', color: 'red' },
};

const SITE_STATUS_CONFIG = {
  completed: { label: 'Completed / Live', color: 'emerald', icon: <CheckCircle size={12} /> },
  rejected: { label: 'Rejected', color: 'red', icon: <XCircle size={12} /> },
  revision: { label: 'Revision Needed', color: 'amber', icon: <AlertTriangle size={12} /> },
  in_progress: { label: 'In Progress', color: 'blue', icon: <Clock size={12} /> },
  pending: { label: 'Pending', color: 'gray', icon: <Clock size={12} /> },
};

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await clientAPI.getOrderDetails(id);
        setOrder(data.order);
        setDetails(data.details || []);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="premium-card p-8 animate-pulse">
          <div className="h-6 bg-[var(--background-dark)] rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-[var(--background-dark)] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="premium-card p-12 text-center">
        <p className="text-[var(--text-muted)]">Order not found</p>
        <button onClick={() => navigate('/client/orders')} className="mt-4 text-emerald-400 underline">Back to Orders</button>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: 'gray' };
  const isGuestPost = (order.order_type || '').toLowerCase().includes('guest');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/client/orders')} className="p-2 rounded-xl hover:bg-[var(--background-dark)] border border-transparent hover:border-[var(--border)] transition-all">
          <ArrowLeft className="h-5 w-5 text-[var(--text-secondary)]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Order {order.order_number || `#${order.id}`}</h1>
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-${cfg.color}-500/10 text-${cfg.color}-400 border border-${cfg.color}-500/20`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Created {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="premium-card p-6">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Order Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-[var(--background-dark)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Type</p>
            <p className="font-semibold text-[var(--text-primary)]">{order.order_type}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--background-dark)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Sites</p>
            <p className="font-semibold text-[var(--text-primary)]">{order.no_of_links}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--background-dark)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Mode</p>
            <p className="font-semibold text-[var(--text-primary)]">{order.fill_details ? 'Self-Filled' : 'Delegated'}</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--background-dark)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Package</p>
            <p className="font-semibold text-[var(--text-primary)] text-sm">{order.order_package || '-'}</p>
          </div>
        </div>

        {order.notes && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--background-dark)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] mb-1">Notes</p>
            <p className="text-sm text-[var(--text-primary)]">{order.notes}</p>
          </div>
        )}

        {order.manager_notes && (
          <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-blue-400 mb-1 font-medium">Manager Notes</p>
            <p className="text-sm text-[var(--text-primary)]">{order.manager_notes}</p>
          </div>
        )}
      </div>

      {/* Site Details */}
      <div className="premium-card p-6">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Selected Sites ({details.length})</h2>
        <div className="space-y-4">
          {details.map((d, i) => (
            <div key={d.id} className="rounded-xl p-5 bg-[var(--background-dark)] border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[var(--border)]">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 font-bold text-sm">{i + 1}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-400 flex items-center gap-2">
                    <Globe size={14} /> {d.root_domain || `Site #${d.site_id}`}
                  </h3>
                  <div className="text-xs text-[var(--text-muted)] flex gap-3 mt-0.5">
                    <span>DA: {d.da || '-'}</span>
                    <span>DR: {d.dr || '-'}</span>
                    <span>Traffic: {d.traffic?.toLocaleString() || '-'}</span>
                  </div>
                </div>
                {/* Per-site status badge */}
                {d.site_status && (() => {
                  const sCfg = SITE_STATUS_CONFIG[d.site_status] || SITE_STATUS_CONFIG.pending;
                  return (
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-${sCfg.color}-500/10 text-${sCfg.color}-400 border border-${sCfg.color}-500/20`}>
                      {sCfg.icon}
                      {sCfg.label}
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {d.target_url && (
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">Target URL</span>
                    <p className="text-[var(--text-primary)] truncate">{d.target_url}</p>
                  </div>
                )}
                {d.anchor_text && (
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">Anchor Text</span>
                    <p className="text-[var(--text-primary)]">{d.anchor_text}</p>
                  </div>
                )}
                {d.article_title && (
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">Article Title</span>
                    <p className="text-[var(--text-primary)]">{d.article_title}</p>
                  </div>
                )}
                {d.doc_url && (
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">Doc URL</span>
                    <p className="text-[var(--text-primary)] truncate">{d.doc_url}</p>
                  </div>
                )}
                {d.post_url && (
                  <div>
                    <span className="text-xs text-[var(--text-muted)]">Post URL</span>
                    <p className="text-[var(--text-primary)] truncate">{d.post_url}</p>
                  </div>
                )}
                {d.insert_statement && (
                  <div className="md:col-span-2">
                    <span className="text-xs text-[var(--text-muted)]">Insert Statement</span>
                    <p className="text-[var(--text-primary)]">{d.insert_statement}</p>
                  </div>
                )}
                {d.note && (
                  <div className="md:col-span-2">
                    <span className="text-xs text-[var(--text-muted)]">Note</span>
                    <p className="text-[var(--text-primary)]">{d.note}</p>
                  </div>
                )}
              </div>

              {/* Live URL (for completed sites) */}
              {d.site_status === 'completed' && d.live_url && (
                <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mb-1">
                    <ExternalLink size={12} /> Live Link
                  </span>
                  <a href={d.live_url} target="_blank" rel="noopener noreferrer" 
                     className="text-sm text-emerald-400 hover:text-emerald-300 underline break-all">
                    {d.live_url}
                  </a>
                </div>
              )}

              {/* Rejection reason (for rejected sites) */}
              {d.site_status === 'rejected' && d.site_reject_reason && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="text-xs text-red-400 font-medium flex items-center gap-1 mb-1">
                    <XCircle size={12} /> Rejection Reason
                  </span>
                  <p className="text-sm text-[var(--text-primary)]">{d.site_reject_reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
