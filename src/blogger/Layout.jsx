import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, CreditCard, Globe, Upload, ShoppingBag, MessageCircle } from 'lucide-react';
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
    {
      icon: <CreditCard size={20} />,
      label: 'Payments',
      to: '#',
      active: pathname.startsWith(`${base}/payments`),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Fill Payment Details', to: `${base}/payments/fill-details` },
        { label: 'Invoice List', to: `${base}/payments/invoices` },
        { label: 'Wallet', to: `${base}/payments/wallet` },
      ],
    },
    {
      icon: <Globe size={20} />,
      label: 'Sites',
      to: '#',
      active: pathname.startsWith(`${base}/sites`),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Single Site', to: `${base}/sites/single` },
        { label: 'View All Sites', to: `${base}/sites/all` },
      ],
    },
    { icon: <Upload size={20} />, label: 'Bulk Sites', to: `${base}/bulk-sites`, active: pathname.startsWith(`${base}/bulk-sites`) },
    { icon: <ShoppingBag size={20} />, label: 'Orders', to: `${base}/orders`, active: pathname.startsWith(`${base}/orders`) },
    { icon: <MessageCircle size={20} />, label: 'Threads', to: `${base}/threads`, active: pathname.startsWith(`${base}/threads`) },
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
