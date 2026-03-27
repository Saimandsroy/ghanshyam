import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, BarChart2, User, Calendar, Clock } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { adminAPI } from '../../lib/api';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export function BloggerPerformance() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogger, setBlogger] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBloggerStats = async () => {
        try {
            setLoading(true);
            setError(null);
            // Use the new efficient single blogger endpoint
            const response = await adminAPI.getBloggerPerformance(id);
            if (response.blogger) {
                setBlogger(response.blogger);
            } else {
                setError('Blogger not found');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBloggerStats();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
        </div>
    );

    if (error || !blogger) return (
        <div className="p-8 text-center text-red-400">
            {error || 'Blogger not found'}
            <button onClick={() => navigate('/admin/bloggers')} className="block mx-auto mt-4 text-blue-400 hover:underline">Go Back</button>
        </div>
    );

    // Chart with Pending, Completed, and Rejected Orders
    const chartData = {
        labels: ['Pending Orders', 'Completed Orders', 'Rejected Orders'],
        datasets: [
            {
                data: [blogger.pending_orders, blogger.completed_orders, blogger.rejected_orders || 0],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',   // Red for Pending
                    'rgba(34, 197, 94, 0.8)',   // Green for Completed
                    'rgba(245, 158, 11, 0.8)',  // Amber for Rejected
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(245, 158, 11, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9ca3af',
                    font: { size: 12 },
                    padding: 20
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#fff',
                bodyColor: '#9ca3af',
                borderColor: 'rgba(107, 240, 255, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: (item) => {
                        const value = item.raw;
                        const label = item.label;
                        if (label === 'Pending Orders') {
                            return `Pending: ${value} orders waiting to be completed`;
                        } else if (label === 'Completed Orders') {
                            return `Completed: ${value} orders successfully finished`;
                        } else {
                            return `Rejected: ${value} orders rejected`;
                        }
                    }
                }
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/bloggers')}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Blogger Performance: <span style={{ color: 'var(--primary-cyan)' }}>{blogger.name}</span>
                </h1>
                <button
                    onClick={fetchBloggerStats}
                    className="ml-auto p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={18} style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>

            {/* Blogger Info Card */}
            <div className="card p-4 rounded-2xl flex flex-wrap items-center gap-6"
                style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <User size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{blogger.name}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{blogger.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Joined: {formatDate(blogger.created_at)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Last Login: {formatDate(blogger.last_login)}
                    </span>
                </div>
                <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: blogger.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: blogger.is_active ? 'var(--success)' : 'var(--error)',
                        border: `1px solid ${blogger.is_active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}
                >
                    {blogger.is_active ? 'Active' : 'Blocked'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stats Card */}
                <div className="card p-6 rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <BarChart2 size={20} className="text-purple-400" />
                        Statistics
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <span className="text-gray-400">Total Orders</span>
                            <span className="text-2xl font-bold text-blue-400">{blogger.total_orders}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <span className="text-gray-400">Pending Orders</span>
                            <span className="text-2xl font-bold text-red-400">{blogger.pending_orders}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            <span className="text-gray-400">Completed Orders</span>
                            <span className="text-2xl font-bold text-green-400">{blogger.completed_orders}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, rgba(107, 240, 255, 0.1) 0%, rgba(107, 240, 255, 0.05) 100%)', border: '1px solid rgba(107, 240, 255, 0.2)' }}>
                            <span className="text-gray-400">Wallet Balance</span>
                            <span className="text-2xl font-bold" style={{ color: 'var(--primary-cyan)' }}>{blogger.wallet_balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
                            <span className="text-gray-400">Login Count</span>
                            <span className="text-xl font-bold text-gray-300">{blogger.login_count}</span>
                        </div>
                    </div>
                </div>

                {/* Chart Card */}
                <div className="card p-6 rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Orders Chart</h3>
                    <div className="h-[350px] w-full rounded-xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                    <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                        Hover over bars to see detailed information
                    </p>
                </div>
            </div>
        </div>
    );
}
