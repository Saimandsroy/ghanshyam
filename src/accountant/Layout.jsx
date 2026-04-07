import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { Wallet } from 'lucide-react';
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
    {
      icon: <Wallet size={20} />,
      label: 'Wallet',
      active: pathname.startsWith(`${base}/wallet`),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Bloggers Wallet', to: `${base}/wallet/bloggers` },
        { label: 'Payment History', to: `${base}/wallet/payment-history` },
        { label: 'Withdrawal Requests', to: `${base}/wallet/withdrawal-requests` }
      ]
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex bg-transparent">
      <ModernSidebar navItems={navItems} userName="Accountant" userRole="Accounts" onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="px-8 py-6 border-b border-[var(--color-border)] bg-white/70 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Accountant</h1>
        </header>
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
