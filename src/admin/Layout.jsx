import React from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, TrendingUp, ShoppingCart, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../auth/AuthContext.jsx';

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', to: '/admin', active: pathname === '/admin' },
    { icon: <TrendingUp size={20} />, label: 'Reporting', to: '/admin/reporting', active: pathname.startsWith('/admin/reporting') },
    { icon: <ShoppingCart size={20} />, label: 'Orders', to: '/admin/orders', active: pathname.startsWith('/admin/orders') },
    { icon: <BarChart3 size={20} />, label: 'Price Charts', to: '/admin/price-charts', active: pathname.startsWith('/admin/price-charts') },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      <ModernSidebar navItems={navItems} userName="Admin User" userRole="Administrator" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="p-6" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {pathname === '/admin' ? 'Dashboard' : pathname.split('/').slice(-1)[0].replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your Link Management dashboard.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm" style={{ color: 'var(--text-muted)' }}>Home</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
}
