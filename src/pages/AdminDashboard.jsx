import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  LayoutGrid,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Users2,
  Globe,
  Wallet,
  Link,
  Filter
} from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'reporting', icon: TrendingUp, label: 'Reporting' },
    { id: 'bloggers', icon: Users, label: 'Bloggers Lists' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'charts', icon: BarChart3, label: 'Price Charts' },
    { id: 'team', icon: Users2, label: 'Team Members' },
    { id: 'sites', icon: Globe, label: 'Sites' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'links', icon: Link, label: 'More Links' }
  ];

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
    <div className="min-h-screen bg-[#0F1724] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#2D1066] border-r border-[#2C3445] p-8 relative">
        <div className="relative">
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[#6BF0FF]/10 to-transparent pointer-events-none"></div>
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6BF0FF] to-[#3ED9EB] rounded-lg flex items-center justify-center text-[#1B0642] font-bold text-xl shadow-lg shadow-[#6BF0FF]/40">
              L
            </div>
            <div className="text-white text-xl font-bold">LINKS</div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 relative z-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${
                    isActive
                      ? 'bg-[#4E2C93]/60 text-white border-[#6BF0FF]/50 shadow-lg shadow-[#6BF0FF]/15'
                      : 'text-[#D1D5DB] border-transparent hover:bg-[#4E2C93]/40 hover:text-white hover:border-[#6BF0FF]/30 hover:translate-x-1'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6BF0FF] to-[#3ED9EB] rounded-r"></div>
                  )}
                  
                  {/* Gradient overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6BF0FF]/10 to-transparent"></div>
                  )}
                  
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 font-medium">{item.label}</span>
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute right-4 w-2 h-2 bg-[#6BF0FF] rounded-full shadow-lg shadow-[#6BF0FF]/80 animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#1A2233] border-b border-[#2C3445] p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-[#D1D5DB]">Welcome back to your Link Management dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#6BF0FF]" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#0F1724] border border-[#2C3445] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#9AA4B2] focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent transition-all duration-300 min-w-[300px]"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="w-12 h-12 bg-[#1A2233] border border-[#2C3445] rounded-xl flex items-center justify-center text-[#6BF0FF] hover:bg-[#4E2C93] hover:border-[#6BF0FF] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6BF0FF]/30 transition-all duration-300">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center font-semibold border-2 border-[#0F1724]">
                  3
                </div>
              </div>

              {/* Profile */}
              <button className="w-12 h-12 bg-[#1A2233] border border-[#2C3445] rounded-xl flex items-center justify-center text-[#6BF0FF] hover:bg-[#4E2C93] hover:border-[#6BF0FF] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6BF0FF]/30 transition-all duration-300">
                <User className="h-5 w-5" />
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#F87171]/30"
              >
                <LogOut className="h-4 w-4 inline mr-2" />
                Logout
              </button>
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
                <div key={index} className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:border-[#6BF0FF] hover:shadow-lg hover:shadow-[#6BF0FF]/20 transition-all duration-300">
                  {/* Top border gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[#9AA4B2] text-sm font-medium uppercase tracking-wide mb-3">{stat.label}</h3>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className={`${stat.change.includes('+') || stat.change.includes('new') ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                          {stat.change}
                        </span>
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
          <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Pending Withdrawal Requests</h2>
                <div className="w-2 h-2 bg-[#6BF0FF] rounded-full animate-pulse shadow-lg shadow-[#6BF0FF]/60"></div>
              </div>
              <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6BF0FF]/30 transition-all duration-300">
                <Filter className="h-4 w-4" />
                Filter
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
                        <button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-4 py-2 rounded-lg font-semibold text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#6BF0FF]/30 transition-all duration-300">
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
    </div>
  );
}
