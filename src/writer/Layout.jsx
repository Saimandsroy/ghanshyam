import React from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, CheckCircle2, Bell, XCircle, MessageSquare } from 'lucide-react';
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
    { icon: <LayoutGrid size={18} />, label: 'Dashboard', to: base, active: pathname === base || pathname === `${base}/` },
    { icon: <CheckCircle2 size={18} />, label: 'Completed Orders', to: `${base}/completed-orders`, active: pathname.startsWith(`${base}/completed-orders`) },
    { icon: <Bell size={18} />, label: 'Order Notifications', to: `${base}/notifications`, active: pathname.startsWith(`${base}/notifications`) },
    { icon: <XCircle size={18} />, label: 'Rejected Notifications', to: `${base}/rejected`, active: pathname.startsWith(`${base}/rejected`) },
    { icon: <MessageSquare size={18} />, label: 'Threads', to: `${base}/threads`, active: pathname.startsWith(`${base}/threads`) },
  ];

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] bg-grid-pattern text-[var(--text-primary)]">
      <ModernSidebar
        navItems={navItems}
        userName="Writer"
        userRole="Writer"
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Header */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[var(--background-dark)]/80 backdrop-blur-md z-10 border-b border-[var(--border)] lg:hidden" />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
