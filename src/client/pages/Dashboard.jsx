import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clientAPI } from '../../lib/api';
import { PremiumStatsCard } from '../../components/PremiumStatsCard';
import { Wallet, ShoppingBag, TrendingUp, Clock, Plus, Globe, ChevronRight, Package, Send, CheckCircle, ArrowRight } from 'lucide-react';

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

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, ordersData] = await Promise.all([
          clientAPI.getDashboard(),
          clientAPI.getOrders({ page: 1, limit: 3 })
        ]);
        setStats(dashboardData);
        setRecentOrders(ordersData.orders || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Wallet Balance',
      value: `$${stats?.wallet_balance?.toFixed(2) || '0.00'}`,
      icon: <Wallet size={24} />,
      color: '#10B981', // Emerald
      onClick: () => navigate('/client/topup'),
    },
    {
      label: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: <ShoppingBag size={24} />,
      color: '#3B82F6', // Blue
      onClick: () => navigate('/client/orders'),
    },
    {
      label: 'Total Spent',
      value: `$${stats?.total_spent?.toFixed(2) || '0.00'}`,
      icon: <TrendingUp size={24} />,
      color: '#A855F7', // Purple
    },
    {
      label: 'Pending Review',
      value: stats?.orders_by_status?.pending_review || 0,
      icon: <Clock size={24} />,
      color: '#F59E0B', // Amber
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Welcome Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-[var(--background-dark)] to-emerald-900/10 border border-emerald-500/20 shadow-lg">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Globe size={200} className="text-emerald-500 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to Link Management
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mb-8">
            Browse our premium site inventory, create orders, and track your link building campaigns — all in one place.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/client/orders/create')}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              <Plus size={18} /> Create New Order
            </button>
            <button
              onClick={() => navigate('/client/sites')}
              className="px-6 py-3 rounded-xl bg-[var(--background-dark)] border border-[var(--border)] text-[var(--text-primary)] font-semibold flex items-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all hover:-translate-y-0.5"
            >
              <Globe size={18} /> Browse Sites
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid matching manager panel */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div key={index} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <PremiumStatsCard
              icon={stat.icon.type}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              onClick={stat.onClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions in premium cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/client/topup')}
            className="premium-card p-6 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-4 group"
          >
            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-lg group-hover:text-emerald-400 transition-colors">Top Up Wallet</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">Add funds instantly</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/client/sites')}
            className="premium-card p-6 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex items-center gap-4 group"
          >
            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-lg group-hover:text-blue-400 transition-colors">Browse Sites</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">View premium inventory</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/client/orders/create')}
            className="premium-card p-6 cursor-pointer hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all flex items-center gap-4 group"
          >
            <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-lg group-hover:text-purple-400 transition-colors">New Order</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">Start building links</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Orders Section */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Orders</h2>
          <button 
            onClick={() => navigate('/client/orders')}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="premium-card p-8 text-center border border-dashed border-[var(--border)]">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[var(--text-muted)] opacity-50" />
            <p className="text-[var(--text-primary)] font-medium">No recent orders</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Your latest link building orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentOrders.map((order, idx) => (
              <motion.div 
                key={order.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/client/orders/${order.id}`)}
                className="premium-card p-5 cursor-pointer hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 rounded-md bg-[var(--background-dark)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)]">
                    #{order.id}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    order.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">{order.order_type}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">{order.site_count || order.no_of_links} Sites • {order.order_package}</p>
                <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
                  <Clock size={12} className="mr-1.5" />
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
