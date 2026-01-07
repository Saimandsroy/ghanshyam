import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ModernSidebar } from '../../../components/ModernSidebar'; // Adjust path as needed, likely ../../../components/ModernSidebar
import { Home, Package, Clock, AlertTriangle, MessageSquare, Globe } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext.jsx'; // Adjust path if needed

export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Assuming useAuth is available or fallback to local storage logic
  const { logout } = useAuth ? useAuth() : {
    logout: () => {
      sessionStorage.clear();
      localStorage.clear();
    }
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
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex bg-[var(--background-dark)] bg-grid-pattern">
      <ModernSidebar
        navItems={navItems}
        userName="Manager User"
        userRole="Manager"
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};