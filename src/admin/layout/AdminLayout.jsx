import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Search, Bell, User, LogOut, LayoutGrid, TrendingUp, Users, ShoppingCart, BarChart3, Users2, Globe, Wallet, Link
} from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const nav = [
    { to: '/admin', icon: LayoutGrid, label: 'Dashboard', end: true },
    { to: '/admin/reporting', icon: TrendingUp, label: 'Reporting' },
    { to: '/admin/bloggers', icon: Users, label: 'Bloggers Lists' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/price-charts', icon: BarChart3, label: 'Price Charts' },
    { to: '/admin/team', icon: Users2, label: 'Team Members' },
    { to: '/admin/sites', icon: Globe, label: 'Sites' },
    { to: '/admin/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/admin/links', icon: Link, label: 'More Links' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1724] flex">
      <aside className="w-64 bg-[#2D1066] border-r border-[#2C3445] p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6BF0FF] to-[#3ED9EB] rounded-lg flex items-center justify-center text-[#1B0642] font-bold text-xl">L</div>
          <div className="text-white text-xl font-bold">LINKS</div>
        </div>
        <nav className="space-y-2">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden border ${isActive ? 'bg-[#4E2C93]/60 text-white border-[#6BF0FF]/50 shadow-lg shadow-[#6BF0FF]/15' : 'text-[#D1D5DB] border-transparent hover:bg-[#4E2C93]/40 hover:text-white hover:border-[#6BF0FF]/30'}`}>
              {({ isActive }) => (<>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6BF0FF] to-[#3ED9EB] rounded-r" />}
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {isActive && <div className="absolute right-4 w-2 h-2 bg-[#6BF0FF] rounded-full shadow-lg shadow-[#6BF0FF]/80" />}
              </>)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-[#1A2233] border-b border-[#2C3445] p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-[#D1D5DB]">Welcome back to your Link Management dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#6BF0FF]" />
                </div>
                <input type="text" placeholder="Search..." className="bg-[#0F1724] border border-[#2C3445] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#9AA4B2] focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent transition-all duration-300 min-w-[300px]" />
              </div>
              <div className="relative">
                <button className="w-12 h-12 bg-[#1A2233] border border-[#2C3445] rounded-xl flex items-center justify-center text-[#6BF0FF] hover:bg-[#4E2C93] hover:border-[#6BF0FF]">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center font-semibold border-2 border-[#0F1724]">3</div>
              </div>
              <button className="w-12 h-12 bg-[#1A2233] border border-[#2C3445] rounded-xl flex items-center justify-center text-[#6BF0FF] hover:bg-[#4E2C93] hover:border-[#6BF0FF]">
                <User className="h-5 w-5" />
              </button>
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-[#F87171] hover:bg-[#EF4444] text-white rounded-lg font-medium">
                <LogOut className="h-4 w-4 inline mr-2" /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
