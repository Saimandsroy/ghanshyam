import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, TrendingUp, ShoppingCart, BarChart3, Users, Users2, Globe, Wallet, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard', to: '/admin', active: pathname === '/admin' },
    { icon: <TrendingUp size={20} />, label: 'Reporting', to: '/admin/reporting', active: pathname.startsWith('/admin/reporting') },
    { icon: <Users size={20} />, label: 'Bloggers Lists', to: '/admin/bloggers', active: pathname.startsWith('/admin/bloggers') },
    { icon: <ShoppingCart size={20} />, label: 'Orders', to: '/admin/orders', active: pathname.startsWith('/admin/orders') },
    { icon: <BarChart3 size={20} />, label: 'Price Charts', to: '/admin/price-charts', active: pathname.startsWith('/admin/price-charts') },
    { icon: <Users2 size={20} />, label: 'Team Members', to: '/admin/team-members', active: pathname.startsWith('/admin/team-members') },
    {
      icon: <Globe size={20} />,
      label: 'Sites',
      active: pathname.startsWith('/admin/sites'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Add Excel File', to: '/admin/sites/add-excel' },
        { label: 'Create Account from Sites', to: '/admin/sites/create-account' },
        { label: 'Deleted Sites', to: '/admin/sites/deleted' },
        { label: 'Pending Bulk Upload Requests', to: '/admin/sites/pending-bulk' },
        { label: 'Sites', to: '/admin/sites' }
      ]
    },
    {
      icon: <Wallet size={20} />,
      label: 'Wallet',
      active: pathname.startsWith('/admin/wallet'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Bloggers Wallet', to: '/admin/wallet/bloggers' },
        { label: 'Payment History', to: '/admin/wallet/payment-history' },
        { label: 'Withdrawal Requests', to: '/admin/wallet/withdrawal-requests' }
      ]
    },
    {
      icon: <MoreHorizontal size={20} />,
      label: 'More Links',
      active: pathname.startsWith('/admin/more'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Careers', to: '/admin/more/careers' },
        { label: 'Countries Lists', to: '/admin/more/countries' },
        { label: 'FAQs', to: '/admin/more/faqs' },
        { label: 'Videos', to: '/admin/more/videos' }
      ]
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] bg-grid-pattern">
      <ModernSidebar
        navItems={navItems}
        userName="Admin User"
        userRole="Administrator"
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="px-8 py-6 border-b border-[var(--border)] bg-[var(--background-dark)]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Toggle menu"
              >
                <LayoutGrid size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold mb-1 text-[var(--text-primary)] tracking-tight">
                  {pathname === '/admin' ? 'Dashboard' : pathname.split('/').slice(-1)[0].replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </h1>
                <p className="hidden md:block text-sm text-[var(--text-muted)]">Welcome back to your Link Management dashboard.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary-cyan)] transition-colors">Home</Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
