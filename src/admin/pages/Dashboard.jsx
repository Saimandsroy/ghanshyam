import React, { useMemo, useState } from 'react';
import { Users, Users2, User, BarChart3, Bell, Filter } from 'lucide-react';
import { ChartCard } from '../components/ChartCard';
import { BarChart } from '../components/BarChart';

export function Dashboard() {
  const [yearOrders, setYearOrders] = useState('2024');
  const [yearPayment, setYearPayment] = useState('2024');
  const [yearBloggers, setYearBloggers] = useState('2024');
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Bloggers', value: '67,341', change: '+8.5% vs last month', icon: Users },
    { label: 'Managers', value: '3', change: 'No change', icon: Users2 },
    { label: 'Teams', value: '6', change: '+2 new this week', icon: BarChart3 },
    { label: 'Writers', value: '6', change: '+1 new writer', icon: User },
    { label: 'Pending Requests', value: '4', change: '-12% decrease', icon: Bell }
  ];

  const withdrawalRequests = [
    { id: 1, user: { name: 'mfriedman', email: 'mfriedman@skopenmagazine.com' }, paymentMethod: { type: 'PayPal', details: 'mfriedman@skopenmagazine.com' }, amount: 50, requestDate: '2025-10-09T16:32:00', clearanceDate: '2025-10-09T20:26:00' },
    { id: 2, user: { name: 'Elevated Magazines', email: 'e-elevated@elevatedmagazines.com' }, paymentMethod: { type: 'Stripe', details: 'jude@elevatedmagazines.com' }, amount: 120, requestDate: '2025-10-09T15:14:00', clearanceDate: '2025-10-09T20:26:00' },
    { id: 3, user: { name: 'claymansell', email: 'claymansell@theinteriorcourier.net' }, paymentMethod: { type: 'PayPal', details: 'invoice INV2' }, amount: 20, requestDate: '2025-10-09T10:26:00', clearanceDate: '2025-10-09T20:26:00' }
  ];

  const filteredRequests = useMemo(() => {
    if (!search) return withdrawalRequests;
    const q = search.toLowerCase();
    return withdrawalRequests.filter(r =>
      r.user.name.toLowerCase().includes(q) ||
      r.user.email.toLowerCase().includes(q) ||
      r.paymentMethod.type.toLowerCase().includes(q)
    );
  }, [search]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: stat.change.includes('+') || stat.change.includes('new') ? 'var(--success)' : 'var(--error)' }}>{stat.change}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-[rgba(107,240,255,0.1)] flex items-center justify-center`}>
                  <Icon className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Withdrawal Requests</h2>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-cyan)' }} />
          </div>
          <button onClick={() => setShowFilter(v => !v)} className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] px-4 py-2 rounded-lg font-semibold" style={{ color: 'var(--icon-on-gradient)' }}>
            <Filter className="inline mr-2" size={16} /> Filter
          </button>
        </div>

        {showFilter && (
          <div className="mb-4 flex gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user, email, method..." className="rounded-xl px-4 py-2 min-w-[280px]" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{request.user.name}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{request.user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{request.paymentMethod.type}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{request.paymentMethod.details}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold" style={{ color: 'var(--success)' }}>${request.amount}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{new Date(request.requestDate).toLocaleString()}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Clearance: {new Date(request.clearanceDate).toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] px-4 py-2 rounded-lg font-semibold text-sm" style={{ color: 'var(--icon-on-gradient)' }}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Orders Chart">
          <BarChart labels={ordersChartData.labels} datasets={ordersChartData.datasets} height={260} />
        </ChartCard>
        <ChartCard title="Monthly Orders Chart" right={(
          <select value={yearOrders} onChange={e => setYearOrders(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            {['2023','2024','2025'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}>
          <BarChart labels={monthlyOrdersData.labels} datasets={monthlyOrdersData.datasets} height={260} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Payment" right={(
          <select value={yearPayment} onChange={e => setYearPayment(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            {['2023','2024','2025'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}>
          <BarChart labels={monthlyPaymentData.labels} datasets={monthlyPaymentData.datasets} height={260} />
        </ChartCard>
        <ChartCard title="Bloggers Joined" right={(
          <select value={yearBloggers} onChange={e => setYearBloggers(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            {['2023','2024','2025'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}>
          <BarChart labels={bloggersJoinedData.labels} datasets={bloggersJoinedData.datasets} height={260} />
        </ChartCard>
      </div>
    </div>
  );
}
