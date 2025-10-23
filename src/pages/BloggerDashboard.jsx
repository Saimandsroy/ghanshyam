import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  LogOut,
  LayoutGrid,
  Wallet,
  ShoppingBag,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronLeft,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export function BloggerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'orders', icon: ShoppingBag, label: 'Today Orders' },
    { id: 'threads', icon: MessageCircle, label: 'Threads' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const stats = [
    { label: 'Total Sites', value: '1,245', change: '+12.5% increase', icon: Globe, color: 'default' },
    { label: 'Total Orders', value: '845', change: '+8.2% increase', icon: ShoppingBag, color: 'success' },
    { label: 'Completed Orders', value: '587', change: '+5.8% increase', icon: CheckCircle, color: 'success' },
    { label: 'Pending Orders', value: '124', change: '-2.3% decrease', icon: Clock, color: 'warning' },
    { label: 'Rejected Orders', value: '34', change: '-10.5% decrease', icon: XCircle, color: 'error' },
    { label: 'Total Threads', value: '2,456', change: '+15.7% increase', icon: MessageCircle, color: 'default' }
  ];

  return (
    <div className="min-h-screen bg-[#0F1724] flex">
      {/* Sidebar */}
      <div className="w-72 bg-[#2D1066] border-r border-[#2C3445] p-8 relative">
        <div className="relative">
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[#6BF0FF]/8 to-transparent pointer-events-none"></div>
          
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="text-white text-2xl font-bold tracking-tight">Blogger</div>
            <button className="w-9 h-9 bg-[#6BF0FF]/10 border border-[#6BF0FF]/20 rounded-lg flex items-center justify-center text-[#6BF0FF] hover:bg-[#6BF0FF]/20 hover:scale-105 transition-all duration-300">
              <ChevronLeft className="h-4 w-4" />
            </button>
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
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden border hover:translate-x-1 ${
                    isActive
                      ? 'bg-[#4E2C93]/60 text-white border-[#6BF0FF]/50 shadow-lg shadow-[#6BF0FF]/15'
                      : 'text-[#D1D5DB] border-transparent hover:bg-[#4E2C93]/40 hover:text-white hover:border-[#6BF0FF]/30'
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
                  
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#6BF0FF]/25 border-[#6BF0FF]/50 shadow-lg shadow-[#6BF0FF]/40' 
                      : 'bg-[#6BF0FF]/10 border-[#6BF0FF]/20 hover:bg-[#6BF0FF]/20 hover:border-[#6BF0FF]/40 hover:scale-105'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1 text-left font-medium relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[#1A2233] border-b border-[#2C3445] px-10 py-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Dashboard</div>
            <div className="flex items-center gap-5">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#0F1724] border border-[#2C3445] rounded-xl pl-4 pr-12 py-3 text-white placeholder-[#9AA4B2] focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent transition-all duration-300 w-80"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6BF0FF]" />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="w-12 h-12 bg-[#0F1724] border border-[#2C3445] rounded-xl flex items-center justify-center text-[#6BF0FF] hover:bg-[#4E2C93] hover:border-[#6BF0FF] hover:-translate-y-0.5 transition-all duration-300">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center font-semibold border-2 border-[#1A2233]">
                  3
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#6BF0FF]/10 transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6BF0FF] to-[#3ED9EB] rounded-lg flex items-center justify-center text-[#1B0642] font-semibold text-sm">
                  JD
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">John Doe</div>
                  <div className="text-xs text-[#9AA4B2]">Admin</div>
                </div>
              </div>

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

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const getColorClasses = (color) => {
                switch (color) {
                  case 'success':
                    return {
                      border: 'border-b-[#4ADE80]',
                      iconBg: 'bg-[#4ADE80]/10',
                      iconColor: 'text-[#4ADE80]'
                    };
                  case 'warning':
                    return {
                      border: 'border-b-[#FACC15]',
                      iconBg: 'bg-[#FACC15]/10',
                      iconColor: 'text-[#FACC15]'
                    };
                  case 'error':
                    return {
                      border: 'border-b-[#F87171]',
                      iconBg: 'bg-[#F87171]/10',
                      iconColor: 'text-[#F87171]'
                    };
                  default:
                    return {
                      border: 'border-b-[#6BF0FF]',
                      iconBg: 'bg-[#6BF0FF]/10',
                      iconColor: 'text-[#6BF0FF]'
                    };
                }
              };
              
              const colors = getColorClasses(stat.color);
              
              return (
                <div key={index} className={`bg-[#1A2233] border border-[#2C3445] rounded-2xl p-7 relative overflow-hidden hover:-translate-y-1 hover:border-[#6BF0FF] hover:shadow-lg hover:shadow-[#6BF0FF]/20 transition-all duration-300`}>
                  {/* Bottom border gradient */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.border}`}></div>
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-sm text-[#9AA4B2] uppercase tracking-wide font-medium">{stat.label}</div>
                    <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-white mb-3">{stat.value}</div>
                  
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {stat.change.includes('+') ? (
                      <ArrowUp className="h-3 w-3 text-[#4ADE80]" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-[#F87171]" />
                    )}
                    <span className={stat.change.includes('+') ? 'text-[#4ADE80]' : 'text-[#F87171]'}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Container */}
          <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-9 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Orders Performance</h2>
            </div>
            
            <div className="relative h-96">
              {/* Mock Chart */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {[
                  { height: 'h-12', label: 'Jan', completed: 65, pending: 28, rejected: 8 },
                  { height: 'h-24', label: 'Feb', completed: 78, pending: 32, rejected: 12 },
                  { height: 'h-16', label: 'Mar', completed: 85, pending: 25, rejected: 15 },
                  { height: 'h-28', label: 'Apr', completed: 72, pending: 35, rejected: 18 },
                  { height: 'h-36', label: 'May', completed: 95, pending: 30, rejected: 16 },
                  { height: 'h-20', label: 'Jun', completed: 105, pending: 28, rejected: 12 },
                  { height: 'h-32', label: 'Jul', completed: 115, pending: 32, rejected: 14 }
                ].map((bar, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      {/* Completed */}
                      <div className="w-8 bg-gradient-to-t from-[#4ADE80]/20 to-[#4ADE80]/60 rounded-t h-12 mb-1"></div>
                      {/* Pending */}
                      <div className="w-8 bg-gradient-to-t from-[#6BF0FF]/20 to-[#6BF0FF]/60 h-16 mb-1"></div>
                      {/* Rejected */}
                      <div className="w-8 bg-gradient-to-t from-[#F87171]/20 to-[#F87171]/60 rounded-b h-6"></div>
                    </div>
                    <div className="text-xs text-[#9AA4B2]">{bar.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Chart Legend */}
              <div className="absolute top-4 right-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#4ADE80] rounded-full"></div>
                  <span className="text-sm text-[#D1D5DB]">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#6BF0FF] rounded-full"></div>
                  <span className="text-sm text-[#D1D5DB]">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#F87171] rounded-full"></div>
                  <span className="text-sm text-[#D1D5DB]">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
