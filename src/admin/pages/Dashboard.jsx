import { Users, Users2, BarChart3, User, Bell, Filter } from 'lucide-react';
import BarChart from '../components/charts/BarChart';
import { useMemo, useState } from 'react';
import { orders, monthlyOrdersByYear, monthlyPaymentsByYear, bloggersJoinedByYear } from '../../lib/sampleData';

export default function Dashboard() {
  const stats = [
    { label: 'Bloggers', value: '67,341', change: '+8.5% vs last month', icon: Users, color: 'from-[#6BF0FF] to-[#3ED9EB]' },
    { label: 'Managers', value: '3', change: 'No change', icon: Users2, color: 'from-[#4ADE80] to-[#22C55E]' },
    { label: 'Teams', value: '6', change: '+2 new this week', icon: BarChart3, color: 'from-[#FACC15] to-[#F59E0B]' },
    { label: 'Writers', value: '6', change: '+1 new writer', icon: User, color: 'from-[#A78BFA] to-[#8B5CF6]' },
    { label: 'Pending Requests', value: '4', change: '-12% decrease', icon: Bell, color: 'from-[#F87171] to-[#EF4444]' },
  ];

  const withdrawalRequests = [
    {
      user: { name: 'mfriedman', email: 'mfriedman@skopenmagazine.com' },
      paymentMethod: { type: 'PayPal', details: 'mfriedman@skopenmagazine.com' },
      amount: '$50', requestDate: 'Oct 9, 2025 4:32 PM', clearanceDate: 'Oct 9, 2025 8:26 PM'
    },
    {
      user: { name: 'Elevated Magazines', email: 'e-elevated@elevatedmagazines.com' },
      paymentMethod: { type: 'Stripe', details: 'jude@elevatedmagazines.com' },
      amount: '$120', requestDate: 'Oct 9, 2025 3:14 PM', clearanceDate: 'Oct 9, 2025 8:26 PM'
    },
    {
      user: { name: 'claymansell', email: 'claymansell@theinteriorcourier.net' },
      paymentMethod: { type: 'PayPal', details: 'https://www.paypal.com/invoice/p/#INV2-L...' },
      amount: '$20', requestDate: 'Oct 9, 2025 10:26 AM', clearanceDate: 'Oct 9, 2025 8:26 PM'
    },
  ];

  const [yearOrders, setYearOrders] = useState(2025);
  const [yearPayments, setYearPayments] = useState(2025);

  const ordersByStatus = useMemo(() => {
    const counters = { Pending: 0, 'In Process': 0, Completed: 0 };
    orders.forEach(o => { if (counters[o.status] !== undefined) counters[o.status]++; });
    return counters;
  }, []);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:border-[#6BF0FF] hover:shadow-lg hover:shadow-[#6BF0FF]/20 transition-all duration-300">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[#9AA4B2] text-sm font-medium uppercase tracking-wide mb-3">{stat.label}</h3>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className={`${stat.change.includes('+') || stat.change.includes('new') ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-[#1B0642] shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Withdrawal Requests Table */}
      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-8 shadow-xl mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Pending Withdrawal Requests</h2>
            <div className="w-2 h-2 bg-[#6BF0FF] rounded-full animate-pulse shadow-lg shadow-[#6BF0FF]/60"></div>
          </div>
          <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0F1724] rounded-lg">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#9AA4B2] uppercase tracking-wide">User</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#9AA4B2] uppercase tracking-wide">Payment Method</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#9AA4B2] uppercase tracking-wide">Amount</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#9AA4B2] uppercase tracking-wide">Date & Time</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-[#9AA4B2] uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.map((request, index) => (
                <tr key={index} className="border-b border-[#2C3445] hover:bg-[#6BF0FF]/5 transition-colors duration-200">
                  <td className="px-4 py-5">
                    <div>
                      <div className="font-semibold text-white">{request.user.name}</div>
                      <div className="text-sm text-[#9AA4B2]">{request.user.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div>
                      <div className="font-medium text-white">{request.paymentMethod.type}</div>
                      <div className="text-sm text-[#9AA4B2]">{request.paymentMethod.details}</div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="font-bold text-[#4ADE80] text-lg">{request.amount}</div>
                  </td>
                  <td className="px-4 py-5">
                    <div className="space-y-1">
                      <div>
                        <div className="text-xs text-[#9AA4B2] uppercase">Request</div>
                        <div className="text-sm text-[#D1D5DB]">{request.requestDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#9AA4B2] uppercase">Clearance</div>
                        <div className="text-sm text-[#D1D5DB]">{request.clearanceDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-4 py-2 rounded-lg font-semibold text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Orders Chart</h3>
          </div>
          <div style={{ height: 280 }}>
            <BarChart
              labels={Object.keys(ordersByStatus)}
              datasets={[{ label: 'Orders', data: Object.values(ordersByStatus), backgroundColor: ['#f59e0b','#06b6d4','#16a34a'] }]}
            />
          </div>
        </div>
        <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Orders Chart</h3>
            <select value={yearOrders} onChange={e=>setYearOrders(Number(e.target.value))} className="bg-[#0F1724] text-white border border-[#2C3445] rounded px-3 py-1">
              {[2023,2024,2025].map(y=> <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: 280 }}>
            <BarChart
              labels={months}
              datasets={[{ label: 'Payment', data: monthlyOrdersByYear[yearOrders], backgroundColor: '#a21caf' }]}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Monthly Payment</h3>
            <select value={yearPayments} onChange={e=>setYearPayments(Number(e.target.value))} className="bg-[#0F1724] text-white border border-[#2C3445] rounded px-3 py-1">
              {[2023,2024,2025].map(y=> <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: 280 }}>
            <BarChart
              labels={months}
              datasets={[{ label: 'Payment', data: monthlyPaymentsByYear[yearPayments], backgroundColor: '#2563eb' }]}
            />
          </div>
        </div>
        <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Bloggers Joined</h3>
            <select value={yearPayments} onChange={e=>setYearPayments(Number(e.target.value))} className="bg-[#0F1724] text-white border border-[#2C3445] rounded px-3 py-1">
              {[2023,2024,2025].map(y=> <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: 280 }}>
            <BarChart
              labels={months}
              datasets={[{ label: 'Bloggers', data: bloggersJoinedByYear[yearPayments], backgroundColor: '#facc15' }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
