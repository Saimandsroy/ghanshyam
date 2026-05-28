import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clientAPI } from '../../lib/api';
import { ShoppingBag, ChevronRight, Clock, CheckCircle, Send, Plus, Package, XCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const STATUS_CONFIG = {
  pending_review: { label: 'Pending Review', color: 'amber', icon: <Clock size={14} /> },
  manager_processing: { label: 'Manager Processing', color: 'blue', icon: <Package size={14} /> },
  pushed_to_blogger: { label: 'With Blogger', color: 'purple', icon: <Send size={14} /> },
  completed: { label: 'Completed', color: 'emerald', icon: <CheckCircle size={14} /> },
  completed_with_rejections: { label: 'Completed (Partial Refund)', color: 'teal', icon: <CheckCircle size={14} /> },
  rejected: { label: 'Rejected', color: 'red', icon: <XCircle size={14} /> },
};

export function ViewOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = { page, limit: 20 };
        if (statusFilter) params.status = statusFilter;
        const data = await clientAPI.getOrders(params);
        setOrders(data.orders || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, statusFilter]);

  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG[status] || { label: status, color: 'gray', icon: null };
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-${cfg.color}-500/10 text-${cfg.color}-400 border border-${cfg.color}-500/20`}>
        {cfg.icon}
        {cfg.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">My Orders</h2>
          <p className="text-sm text-[var(--text-muted)]">Track and manage your link building orders</p>
        </div>
        <button
          onClick={() => navigate('/client/orders/create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-all"
        >
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['', 'pending_review', 'manager_processing', 'pushed_to_blogger', 'completed', 'completed_with_rejections', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === status
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)] hover:border-emerald-500/30'
            }`}
          >
            {status ? STATUS_CONFIG[status]?.label || status : 'All'}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {loading ? (
          [1, 2, 3].map(i => (
            <motion.div key={i} variants={itemVariants} className="premium-card p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 bg-[var(--background-dark)] rounded w-1/3"></div>
                <div className="h-4 bg-[var(--background-dark)] rounded w-1/6"></div>
              </div>
            </motion.div>
          ))
        ) : orders.length === 0 ? (
          <motion.div variants={itemVariants} className="premium-card p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-500"
              >
                <ShoppingBag size={32} />
              </motion.div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">No orders yet</h3>
              <p className="text-[var(--text-muted)] text-lg mb-8 max-w-md mx-auto">Start your link building journey by creating your first order today.</p>
              <button 
                onClick={() => navigate('/client/orders/create')}
                className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold inline-flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                <Plus size={18} /> Create First Order
              </button>
            </div>
          </motion.div>
        ) : (
          orders.map(order => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              onClick={() => navigate(`/client/orders/${order.id}`)}
              className="premium-card p-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold font-mono shadow-inner">
                    #{order.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-bold text-[var(--text-primary)] text-lg">{order.order_type}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <span className="font-medium text-[var(--text-secondary)] bg-[var(--background-dark)] px-2 py-0.5 rounded-md border border-[var(--border)]">{order.site_count || order.no_of_links} Sites</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {order.order_package && <><span>•</span><span className="text-emerald-400 font-medium">{order.order_package}</span></>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--background-dark)] flex items-center justify-center group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                    <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                page === i + 1 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25 border-emerald-500' 
                  : 'bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)] hover:border-emerald-500/30 hover:text-emerald-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
