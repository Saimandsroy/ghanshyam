import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  MessageCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BloggerSidebar } from './components/BloggerSidebar';
import { ThemeToggle } from '../components/ThemeToggle';

export function BloggerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Total Sites', value: '1,245', change: '+12.5% increase', icon: Globe },
    { label: 'Total Orders', value: '845', change: '+8.2% increase', icon: ShoppingBag },
    { label: 'Completed Orders', value: '587', change: '+5.8% increase', icon: CheckCircle },
    { label: 'Pending Orders', value: '124', change: '-2.3% decrease', icon: Clock },
    { label: 'Rejected Orders', value: '34', change: '-10.5% decrease', icon: XCircle },
    { label: 'Total Threads', value: '2,456', change: '+15.7% increase', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      {/* Sidebar */}
      <BloggerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="px-10 py-5" style={{
          backgroundColor: 'var(--card-background)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</div>
            <div className="flex items-center gap-5">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 transition-all duration-300 w-80"
                  style={{
                    backgroundColor: 'var(--background-dark)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--primary-cyan)'
                  }}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--primary-cyan)' }} />
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
                <div className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-semibold" style={{
                  backgroundColor: 'var(--error)',
                  color: 'white',
                  border: '2px solid var(--card-background)'
                }}>
                  3
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Dashboard Overview</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <div key={index} className="rounded-2xl p-7 relative overflow-hidden hover:-translate-y-1 transition-all duration-300" style={{
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--border)'
                }}>
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="text-sm uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{
                      backgroundColor: 'rgba(107, 240, 255, 0.1)',
                      color: 'var(--primary-cyan)'
                    }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  
                  <div className="flex items-center gap-2 text-sm font-medium" style={{
                    color: stat.change.includes('+') ? 'var(--success)' : 'var(--error)'
                  }}>
                    {stat.change.includes('+') ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    <span>
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Container */}
          <div className="rounded-2xl p-9 shadow-xl" style={{
            backgroundColor: 'var(--card-background)',
            border: '1px solid var(--border)'
          }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Orders Performance</h2>
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
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{bar.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Chart Legend */}
              <div className="absolute top-4 right-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--primary-cyan)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--error)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}
