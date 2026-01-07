import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Users2, User, BarChart3, Bell, Filter, Eye } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { PremiumStatsCard } from '../../components/PremiumStatsCard';
import { BarChart } from '../components/BarChart';
import { adminAPI } from '../../lib/api';

export function Dashboard() {
  const navigate = useNavigate();
  const [yearOrders, setYearOrders] = useState('2024');
  const [yearPayment, setYearPayment] = useState('2024');
  const [yearBloggers, setYearBloggers] = useState('2024');
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');

  // State for API data
  const [statsData, setStatsData] = useState(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch admin statistics and withdrawal requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch admin stats and withdrawal requests in parallel
        const [statsResponse, withdrawalsResponse] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getWithdrawalRequests()
        ]);

        setStatsData(statsResponse.statistics);
        setWithdrawalRequests(withdrawalsResponse.withdrawals || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute stats from backend data
  const stats = useMemo(() => {
    if (!statsData) {
      return [
        { label: 'Bloggers', value: '...', change: 'Loading...', icon: Users },
        { label: 'Managers', value: '...', change: 'Loading...', icon: Users2 },
        { label: 'Teams', value: '...', change: 'Loading...', icon: BarChart3 },
        { label: 'Writers', value: '...', change: 'Loading...', icon: User },
        { label: 'Pending Requests', value: '...', change: 'Loading...', icon: Bell }
      ];
    }

    return [
      {
        label: 'Bloggers',
        value: String(statsData.bloggers_count || 0),
        change: statsData.bloggers_count > 0 ? 'Active' : 'No bloggers',
        icon: Users
      },
      {
        label: 'Managers',
        value: String(statsData.managers_count || 0),
        change: 'Active managers',
        icon: Users2
      },
      {
        label: 'Teams',
        value: String(statsData.team_count || 0),
        change: 'Team members',
        icon: BarChart3
      },
      {
        label: 'Writers',
        value: String(statsData.writers_count || 0),
        change: 'Active writers',
        icon: User
      },
      {
        label: 'Pending Requests',
        value: String(withdrawalRequests.filter(w => w.status === 'Requested').length),
        change: 'Awaiting approval',
        icon: Bell
      }
    ];
  }, [statsData, withdrawalRequests]);

  const filteredRequests = useMemo(() => {
    // Filter to show only pending (status null or 'pending' typically means pending)
    const pending = withdrawalRequests.filter(r =>
      !r.status || r.status === 'pending' || r.status === 'Requested'
    );
    if (!search) return pending;
    const q = search.toLowerCase();
    return pending.filter(r =>
      r.user_name?.toLowerCase().includes(q) ||
      r.user_email?.toLowerCase().includes(q)
    );
  }, [search, withdrawalRequests]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const datasetsByYear = {
    orders: {
      '2023': [42, 61, 39, 55, 72, 63, 70, 86, 95, 81, 77, 80],
      '2024': [55, 108, 72, 84, 65, 58, 52, 145, 164, 158, 142, 150],
      '2025': [60, 95, 88, 92, 101, 76, 84, 120, 180, 170, 165, 175]
    },
    payment: {
      '2023': [1200, 5800, 1900, 5600, 6000, 4200, 5000, 7600, 7400, 7100, 7200, 7800],
      '2024': [900, 5900, 1800, 5800, 6200, 4000, 4800, 7500, 7900, 7200, 7400, 7900],
      '2025': [1500, 6100, 2200, 6000, 6500, 4300, 5200, 7800, 8100, 7600, 7800, 8200]
    },
    bloggers: {
      '2023': [300, 500, 200, 400, 600, 500, 13000, 4200, 6800, 7200, 2100, 7300],
      '2024': [500, 600, 300, 450, 700, 550, 12800, 4300, 7000, 7600, 2200, 7600],
      '2025': [600, 700, 350, 500, 800, 600, 13500, 4500, 7200, 7800, 2400, 7800]
    }
  };

  const ordersChartData = {
    labels: ['Pending', 'In Process', 'Completed'],
    datasets: [
      {
        label: 'Orders',
        data: [5, 85, 2750],
        backgroundColor: ['#6BF0FF', '#C17F2A', '#15803D'],
        borderRadius: 6,
      }
    ]
  };

  const monthlyOrdersData = {
    labels: months,
    datasets: [
      {
        label: 'Payment',
        data: datasetsByYear.orders[yearOrders],
        backgroundColor: '#A020F0',
        borderRadius: 6,
      }
    ]
  };

  const monthlyPaymentData = {
    labels: months,
    datasets: [
      {
        label: 'Payment',
        data: datasetsByYear.payment[yearPayment],
        backgroundColor: '#2563EB',
        borderRadius: 6,
      }
    ]
  };

  const bloggersJoinedData = {
    labels: months,
    datasets: [
      {
        label: 'Bloggers',
        data: datasetsByYear.bloggers[yearBloggers],
        backgroundColor: '#FACC15',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
          <p className="mt-4" style={{ color: 'var(--text-muted)' }}>Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-400">Error loading dashboard: {error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => {
              // Assign distinct colors based on index or label
              const colors = ['#06b6d4', '#8b5cf6', '#3b82f6', '#ec4899', '#f97316'];
              const color = colors[index % colors.length];

              // Determine trend direction
              let trend = 'neutral';
              if (stat.change.includes('+') || stat.change.toLocaleLowerCase().includes('new') || stat.change.toLocaleLowerCase().includes('active')) trend = 'up';
              else if (stat.change.includes('-')) trend = 'down';

              return (
                <PremiumStatsCard
                  key={index}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  trendValue={stat.change}
                  trend={trend}
                  color={color}
                  onClick={() => {
                    // Navigate based on label if needed
                    if (stat.label === 'Bloggers') navigate('/admin/bloggers');
                    if (stat.label === 'Orders') navigate('/admin/orders');
                    if (stat.label === 'Pending Requests') navigate('/admin/wallet/withdrawal-requests');
                  }}
                />
              );
            })}
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Withdrawal Requests</h2>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-cyan)' }} />
              </div>
              <button onClick={() => setShowFilter(v => !v)} className="premium-btn premium-btn-accent text-sm py-2 px-4">
                <Filter className="h-4 w-4" />Filter
              </button>
            </div>

            {showFilter && (
              <div className="mb-4 flex gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, email..." className="rounded-xl px-4 py-2 min-w-[280px]" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={() => setSearch('')} className="px-3 rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Reset</button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="rounded-lg" style={{ backgroundColor: 'var(--background-dark)' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Payment Method</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        No pending withdrawal requests
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.slice(0, 10).map((request) => (
                      <tr key={request.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-4">
                          <div>
                            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{request.user_name || 'N/A'}</div>
                            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{request.user_email || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {request.payment_method === 'bank' || request.beneficiary_account_number ? (
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'rgb(249, 115, 22)', border: '1px solid rgb(249, 115, 22)' }}>Bank Transfer</span>
                          ) : request.payment_method === 'upi' || request.upi_id ? (
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'rgb(168, 85, 247)', border: '1px solid rgb(168, 85, 247)' }}>UPI</span>
                          ) : request.payment_method === 'qr' || request.qr_code_image ? (
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', border: '1px solid rgb(34, 197, 94)' }}>QR Code</span>
                          ) : request.payment_method === 'paypal' || request.paypal_email ? (
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', border: '1px solid rgb(59, 130, 246)' }}>PayPal</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold" style={{ color: 'var(--success)' }}>${request.amount || 0}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {request.datetime ? new Date(request.datetime).toLocaleString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => navigate(`/admin/wallet/withdrawal-requests/${request.id}`)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                            style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredRequests.length > 10 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/admin/wallet/withdrawal-requests')}
                  className="text-sm hover:underline"
                  style={{ color: 'var(--primary-cyan)' }}
                >
                  View all {filteredRequests.length} pending requests
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Orders Chart">
              <BarChart labels={ordersChartData.labels} datasets={ordersChartData.datasets} height={260} />
            </ChartCard>
            <ChartCard title="Monthly Orders Chart" right={(
              <select value={yearOrders} onChange={e => setYearOrders(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {['2023', '2024', '2025'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            )}>
              <BarChart labels={monthlyOrdersData.labels} datasets={monthlyOrdersData.datasets} height={260} />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Monthly Payment" right={(
              <select value={yearPayment} onChange={e => setYearPayment(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {['2023', '2024', '2025'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            )}>
              <BarChart labels={monthlyPaymentData.labels} datasets={monthlyPaymentData.datasets} height={260} />
            </ChartCard>
            <ChartCard title="Bloggers Joined" right={(
              <select value={yearBloggers} onChange={e => setYearBloggers(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                {['2023', '2024', '2025'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            )}>
              <BarChart labels={bloggersJoinedData.labels} datasets={bloggersJoinedData.datasets} height={260} />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
