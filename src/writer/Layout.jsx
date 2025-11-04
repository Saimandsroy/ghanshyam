import React from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, CheckCircle2, Bell, XCircle, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../auth/AuthContext.jsx';

export function WriterLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const base = '/writer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', to: `${base}`, active: pathname === `${base}` },
    { icon: <CheckCircle2 size={20} />, label: 'Completed Orders', to: `${base}/completed-orders`, active: pathname.startsWith(`${base}/completed-orders`) },
    { icon: <Bell size={20} />, label: 'Order Notifications', to: `${base}/notifications`, active: pathname.startsWith(`${base}/notifications`) },
    { icon: <XCircle size={20} />, label: 'Rejected Notifications', to: `${base}/rejected`, active: pathname.startsWith(`${base}/rejected`) },
    { icon: <MessageSquare size={20} />, label: 'Threads', to: `${base}/threads`, active: pathname.startsWith(`${base}/threads`) },
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-dark)' }}>
      <ModernSidebar navItems={navItems} userName="Writer" userRole="Writer" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="p-6" style={{ backgroundColor: 'var(--card-background)', borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Writer</h1>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
}
