import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, Wallet, ShoppingBag, MessageCircle, BarChart3, Settings } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../auth/AuthContext.jsx';

export function BloggerLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const base = '/blogger';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', to: `${base}`, active: pathname === `${base}` },
    { icon: <Wallet size={20} />, label: 'Wallet', to: `${base}/wallet`, active: pathname.startsWith(`${base}/wallet`) },
    { icon: <ShoppingBag size={20} />, label: 'Today Orders', to: `${base}/orders`, active: pathname.startsWith(`${base}/orders`) },
    { icon: <MessageCircle size={20} />, label: 'Threads', to: `${base}/threads`, active: pathname.startsWith(`${base}/threads`) },
    { icon: <BarChart3 size={20} />, label: 'Reports', to: `${base}/reports`, active: pathname.startsWith(`${base}/reports`) },
    { icon: <Settings size={20} />, label: 'Settings', to: `${base}/settings`, active: pathname.startsWith(`${base}/settings`) },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      <ModernSidebar navItems={navItems} userName="Blogger User" userRole="Blogger" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="p-6" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
}
