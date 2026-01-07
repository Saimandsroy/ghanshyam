import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../components/ModernSidebar';
import { LayoutGrid, CreditCard, Globe, Upload, ShoppingBag, MessageCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { NotificationsPanel } from './components/NotificationsPanel.jsx';
import api from '../lib/api';

export function BloggerLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const base = '/blogger';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Blogger User',
    profile_image: null
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/blogger/profile');
      setUserProfile({
        name: response.data.name || 'Blogger User',
        profile_image: response.data.profile_image || null
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Strip /api from the base URL for static file paths
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
    // Remove leading slash from imagePath if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseUrl}/${cleanPath}`;
  };

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
    <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] text-[var(--text-primary)] font-sans transition-colors duration-300">
      <ModernSidebar
        navItems={navItems}
        userName={userProfile.name}
        userRole="Blogger"
        userImage={getImageUrl(userProfile.profile_image)}
        profileLink="/blogger/profile"
        changePasswordLink="/blogger/change-password"
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-full bg-[var(--background-dark)] relative">
        {/* Desktop Header / Mobile Header Wrapper used to be here, but ModernSidebar handles mobile toggle. 
            We need a header for the page title and notifications. */}
        <header className="h-16 lg:h-20 px-6 lg:px-8 flex items-center justify-between bg-[var(--background-dark)]/80 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-30 transition-all duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <LayoutGrid size={24} />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              {navItems.find(item => item.active)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <NotificationsPanel />
            {/* Add standard decorative elements or actions here if needed */}
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
