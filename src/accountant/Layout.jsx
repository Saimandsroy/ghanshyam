import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { DollarSign, LayoutGrid } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../auth/AuthContext.jsx';

export function AccountantLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const base = '/accountant';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Payments', to: `${base}`, active: pathname === `${base}` },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      <ModernSidebar navItems={navItems} userName="Accountant" userRole="Accounts" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="p-6" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Accountant</h1>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
}
