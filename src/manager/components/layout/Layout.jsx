import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../../../components/ModernSidebar'; // Adjust path as needed, likely ../../../components/ModernSidebar
import { Home, Package, Clock, AlertTriangle, MessageSquare, Globe, User } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext.jsx'; // Adjust path if needed

export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Assuming useAuth is available or fallback to local storage logic
  const { logout, user } = useAuth ? useAuth() : {
    logout: () => {
      sessionStorage.clear();
      localStorage.clear();
    },
    user: null
  };

  const getUserImage = () => {
    if (!user?.profile_image) return null;
    if (user.profile_image.startsWith('http')) return user.profile_image;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '');
    const cleanPath = user.profile_image.startsWith('/') ? user.profile_image.slice(1) : user.profile_image;
    return `${baseUrl}/${cleanPath}`;
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const navItems = [
    {
      icon: <Home size={18} />,
      label: 'Dashboard',
      to: '/manager',
      active: location.pathname === '/manager' || location.pathname === '/manager/'
    },
    {
      icon: <Package size={18} />,
      label: 'Orders',
      to: '/manager/orders/view',
      active: location.pathname.startsWith('/manager/orders'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Create View Order', to: '/manager/orders/create' },
        { label: 'View Orders', to: '/manager/orders/view' },
        { label: 'Pending from Bloggers', to: '/manager/orders/pending-bloggers' }
      ]
    },
    {
      icon: <Clock size={18} />,
      label: 'Pending Approval',
      hasDropdown: true,
      active: location.pathname.startsWith('/manager/pending'),
      dropdownItems: [
        { label: 'Bloggers', to: '/manager/pending/bloggers' },
        { label: 'Writers', to: '/manager/pending/writers' },
        { label: 'Teams', to: '/manager/pending/teams' }
      ]
    },
    {
      icon: <AlertTriangle size={18} />,
      label: 'Rejected Orders',
      to: '/manager/rejected/bloggers',
      active: location.pathname.startsWith('/manager/rejected'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'Bloggers', to: '/manager/rejected/bloggers' }
      ]
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Threads',
      to: '/manager/threads',
      active: location.pathname === '/manager/threads'
    },
    {
      icon: <Globe size={18} />,
      label: 'Sites',
      to: '/manager/sites',
      active: location.pathname === '/manager/sites'
    },
    {
      icon: <User size={18} />,
      label: 'Profile',
      to: '/manager/profile',
      active: location.pathname === '/manager/profile' || location.pathname === '/manager/profile/'
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex bg-app-background">
      <ModernSidebar
        navItems={navItems}
        userName={user?.name || "Manager User"}
        userRole={user?.role || "Manager"}
        userImage={getUserImage()}
        onLogout={handleLogout}
        profileLink="/manager/profile"
        changePasswordLink="/manager/change-password"
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};