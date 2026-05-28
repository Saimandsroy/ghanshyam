import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clientAPI } from '../../lib/api';
import { useAuth } from '../../auth/AuthContext.jsx';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export function Transactions() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [typeFilter, setTypeFilter] = useState('All'); // 'All', 'Topup', 'Payment', 'Refund'

  useEffect(() => {
    fetchTransactions();
    refreshUser();
  }, [page, typeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (typeFilter !== 'All') {
        params.type = typeFilter;
      }
      const data = await clientAPI.getTransactions(params);
      console.log('FETCHED TRANSACTIONS:', data);
      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch transactions:', err, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format currency (rupees)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Helper to parse order ID from transaction
  const getOrderId = (tx) => {
    if (tx.client_order_id) {
      return `ORD${tx.client_order_id}`;
    }
    // Parse from remarks e.g., "Payment for Guest Post Order #1024"
    const match = tx.remarks?.match(/#(\d+)/);
    if (match) {
      return `ORD${match[1]}`;
    }
    return null;
  };

  // Helper to determine type labels & colors
  const getTransactionDetails = (tx) => {
    const isCredit = tx.type === 'Credit' || tx.type === 'credit';
    const hasOrderDetail = tx.order_detail_id !== null && tx.order_detail_id !== undefined;
    
    let typeLabel = '';
    let badgeColor = '';
    let amountColor = '';
    let icon = null;
    let typeKey = '';

    if (isCredit) {
      if (hasOrderDetail || tx.remarks?.toLowerCase().includes('refund')) {
        typeLabel = 'Refund';
        badgeColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        amountColor = 'text-emerald-400';
        icon = <ArrowUpRight className="text-emerald-400" size={16} />;
        typeKey = 'Refund';
      } else {
        typeLabel = 'Wallet Topup';
        badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        amountColor = 'text-emerald-400';
        icon = <ArrowUpRight className="text-emerald-400" size={16} />;
        typeKey = 'Topup';
      }
    } else {
      typeLabel = 'Order Payment';
      badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      amountColor = 'text-red-400';
      icon = <ArrowDownLeft className="text-red-400" size={16} />;
      typeKey = 'Payment';
    }

    return { typeLabel, badgeColor, amountColor, icon, isCredit, typeKey };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Wallet & Transactions</h2>
        <p className="text-sm text-[var(--text-muted)]">View your wallet history, topups, and refund transactions</p>
      </div>

      {/* Top Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="premium-card p-8 bg-[var(--card-background)] border border-[var(--border)] relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-1.5">
            <span className="text-[var(--text-muted)] text-sm font-semibold tracking-wide uppercase">Current Wallet Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/client/topup')}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              Add Money / Topup
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Topup', 'Payment', 'Refund'].map((filter) => (
            <button
              key={filter}
              onClick={() => { setTypeFilter(filter); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all border ${
                typeFilter === filter
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-[var(--background-dark)] text-[var(--text-muted)] border-[var(--border)] hover:border-emerald-500/30'
              }`}
            >
              {filter === 'All' ? 'All Transactions' : filter === 'Topup' ? 'Wallet Topups' : filter === 'Payment' ? 'Order Payments' : 'Refunds'}
            </button>
          ))}
        </div>

        <button 
          onClick={fetchTransactions}
          disabled={loading}
          className="p-2.5 rounded-xl bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)] hover:border-emerald-500/30 hover:text-emerald-400 transition-all disabled:opacity-50"
          title="Refresh transaction history"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Transaction History Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="premium-card overflow-hidden"
      >
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-white/[0.02]">
                <th className="p-5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Date & Time</th>
                <th className="p-5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Transaction Type</th>
                <th className="p-5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Details / Description</th>
                <th className="p-5 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-[var(--border)] animate-pulse">
                    <td className="p-5"><div className="h-4 bg-[var(--background-dark)] rounded w-24"></div></td>
                    <td className="p-5"><div className="h-6 bg-[var(--background-dark)] rounded-full w-20"></div></td>
                    <td className="p-5"><div className="h-4 bg-[var(--background-dark)] rounded w-48"></div></td>
                    <td className="p-5 text-right"><div className="h-4 bg-[var(--background-dark)] rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--background-dark)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] mx-auto">
                        <Wallet size={20} />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">No transactions found</h4>
                      <p className="text-xs text-[var(--text-muted)]">No records matching your search or filters were found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const { typeLabel, badgeColor, amountColor, icon } = getTransactionDetails(tx);
                  const orderId = getOrderId(tx);
                  
                  return (
                    <motion.tr
                      key={tx.id}
                      variants={itemVariants}
                      className="border-b border-[var(--border)] hover:bg-white/[0.01] transition-colors"
                    >
                      {/* Date & Time */}
                      <td className="p-5 whitespace-nowrap">
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                          {new Date(tx.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="block text-[10px] text-[var(--text-muted)] mt-0.5">
                          {new Date(tx.created_at).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </td>

                      {/* Transaction Type */}
                      <td className="p-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeColor}`}>
                          {icon}
                          {typeLabel}
                        </span>
                      </td>

                      {/* Details / Description */}
                      <td className="p-5">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {tx.remarks}
                          </p>
                          {orderId && (
                            <button
                              onClick={() => {
                                const match = orderId.match(/ORD(\d+)/);
                                if (match) {
                                  navigate(`/client/orders/${match[1]}`);
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition-all mt-0.5"
                            >
                              <span>View Order: {orderId}</span>
                              <ExternalLink size={10} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-5 text-right whitespace-nowrap">
                        <span className={`font-mono text-sm font-black ${amountColor}`}>
                          {tx.type === 'Debit' || tx.type === 'debit' ? '-' : '+'}
                          {formatCurrency(tx.price)}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 flex-wrap gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            Showing <span className="font-semibold text-[var(--text-primary)]">{(page - 1) * 10 + 1}</span> to{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {Math.min(page * 10, totalItems)}
            </span>{' '}
            of <span className="font-semibold text-[var(--text-primary)]">{totalItems}</span> transactions
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] bg-[var(--background-dark)] hover:border-emerald-500/30 hover:text-emerald-400 transition-all disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  page === i + 1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--background-dark)] text-[var(--text-muted)] border border-[var(--border)] hover:border-emerald-500/30 hover:text-emerald-500'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] bg-[var(--background-dark)] hover:border-emerald-500/30 hover:text-emerald-400 transition-all disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
