import React, { useState, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, Wallet, Globe, ShoppingBag, Plus, FileText } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const base = '/client';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = useMemo(() => [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', to: `${base}`, active: pathname === `${base}` || pathname === `${base}/` },
    { icon: <Wallet size={20} />, label: 'Top Up', to: `${base}/topup`, active: pathname.startsWith(`${base}/topup`) },
    { icon: <FileText size={20} />, label: 'Transactions', to: `${base}/transactions`, active: pathname.startsWith(`${base}/transactions`) },
    { 
      icon: <Globe size={20} />, 
      label: 'Sites', 
      to: '#', 
      active: pathname.startsWith(`${base}/sites`),
      hasDropdown: true,
      dropdownItems: [
        { label: 'View Sites', to: `${base}/sites` },
        { label: 'Link Completed', to: `${base}/sites/link-completed` }
      ]
    },
    {
      icon: <ShoppingBag size={20} />,
      label: 'Orders',
      to: '#',
      active: pathname.startsWith(`${base}/orders`),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Create Order', to: `${base}/orders/create` },
        { label: 'My Orders', to: `${base}/orders` },
      ],
    },
  ], [pathname, base]);

  // Find current page title
  const getPageTitle = () => {
    if (pathname === base || pathname === `${base}/`) return 'Dashboard';
    if (pathname.includes('/topup')) return 'Top Up Wallet';
    if (pathname.includes('/transactions')) return 'Wallet & Transactions';
    if (pathname.includes('/sites')) return 'Browse Sites';
    if (pathname.includes('/orders/create')) return 'Create Order';
    if (pathname.includes('/orders/')) return 'Order Details';
    if (pathname.includes('/orders')) return 'My Orders';
    return 'Dashboard';
  };

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      <ModernSidebar
        navItems={navItems}
        userName={user?.name || 'Client User'}
        userRole="Client"
        userImage={getImageUrl(user?.profile_image)}
        profileLink={null}
        changePasswordLink={null}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[var(--background-dark)] relative">
        <header className="h-16 lg:h-20 px-6 lg:px-8 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-[var(--color-border)] sticky top-0 z-30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <LayoutGrid size={24} />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Wallet badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Wallet size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">
                ${user?.wallet_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full space-y-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
