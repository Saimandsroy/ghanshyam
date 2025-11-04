import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Users,
  Users2,
  User,
  BarChart3,
  Filter
} from 'lucide-react';
import { AdminSidebar } from './components/AdminSidebar';
import { ThemeToggle } from '../components/ThemeToggle';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const withdrawalRequests = [
    {
      user: { name: 'mfriedman', email: 'mfriedman@skopenmagazine.com' },
      paymentMethod: { type: 'PayPal', details: 'mfriedman@skopenmagazine.com' },
      amount: '$50',
      requestDate: 'Oct 9, 2025 4:32 PM',
      clearanceDate: 'Oct 9, 2025 8:26 PM'
    },
    {
      user: { name: 'Elevated Magazines', email: 'e-elevated@elevatedmagazines.com' },
      paymentMethod: { type: 'Stripe', details: 'jude@elevatedmagazines.com' },
      amount: '$120',
      requestDate: 'Oct 9, 2025 3:14 PM',
      clearanceDate: 'Oct 9, 2025 8:26 PM'
    },
    {
      user: { name: 'claymansell', email: 'claymansell@theinteriorcourier.net' },
      paymentMethod: { type: 'PayPal', details: 'https://www.paypal.com/invoice/p/#INV2-L...' },
      amount: '$20',
      requestDate: 'Oct 9, 2025 10:26 AM',
      clearanceDate: 'Oct 9, 2025 8:26 PM'
    }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your Link Management dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5" style={{ color: 'var(--primary-cyan)' }} />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 min-w-[300px]"
                  style={{
                    backgroundColor: 'var(--background-dark)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:-translate-y-0.5 transition-all duration-300" style={{
                  backgroundColor: 'var(--background-dark)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary-cyan)'
                }}>
                  <Bell className="h-5 w-5" />
                </button>
                <div className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-semibold border-2" style={{
                  backgroundColor: 'var(--error)',
                  borderColor: 'var(--background-dark)'
                }}>
                  3
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              { label: 'Bloggers', value: '67,341', change: '+8.5% vs last month', icon: Users, color: 'from-[#6BF0FF] to-[#3ED9EB]' },
              { label: 'Managers', value: '3', change: 'No change', icon: Users2, color: 'from-[#4ADE80] to-[#22C55E]' },
              { label: 'Teams', value: '6', change: '+2 new this week', icon: BarChart3, color: 'from-[#FACC15] to-[#F59E0B]' },
              { label: 'Writers', value: '6', change: '+1 new writer', icon: User, color: 'from-[#A78BFA] to-[#8B5CF6]' },
              { label: 'Pending Requests', value: '4', change: '-12% decrease', icon: Bell, color: 'from-[#F87171] to-[#EF4444]' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 transition-all duration-300" style={{
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--border)'
                }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>{stat.label}</h3>
                      <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                      <div className="flex items-center gap-1 text-sm" style={{
                        color: stat.change.includes('+') || stat.change.includes('new') ? 'var(--success)' : 'var(--error)'
                      }}>
                        <span>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6" style={{ color: 'var(--icon-on-gradient)' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Withdrawal Requests Table */}
          <div className="rounded-2xl p-8 shadow-xl" style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--border)'
          }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Withdrawal Requests</h2>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ 
                  backgroundColor: 'var(--primary-cyan)',
                  boxShadow: '0 0 20px rgba(107, 240, 255, 0.6)'
                }}></div>
              </div>
              <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-300" style={{
                color: 'var(--icon-on-gradient)',
                boxShadow: '0 4px 12px rgba(107, 240, 255, 0.3)'
              }}>
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="rounded-lg" style={{ backgroundColor: 'var(--background-dark)' }}>
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>User</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Payment Method</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Amount</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Date & Time</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request, index) => (
                    <tr key={index} className="transition-colors duration-200" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-4 py-5">
                        <div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{request.user.name}</div>
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{request.user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{request.paymentMethod.type}</div>
                          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{request.paymentMethod.details}</div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-bold text-lg" style={{ color: 'var(--success)' }}>{request.amount}</div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="space-y-1">
                          <div>
                            <div className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Request</div>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{request.requestDate}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>Clearance</div>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{request.clearanceDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] px-4 py-2 rounded-lg font-semibold text-sm hover:-translate-y-0.5 transition-all duration-300" style={{
                          color: 'var(--icon-on-gradient)',
                          boxShadow: '0 4px 12px rgba(107, 240, 255, 0.3)'
                        }}>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
