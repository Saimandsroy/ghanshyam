import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Clock, AlertTriangle, MessageSquare, Globe, User } from 'lucide-react';
import { ModernSidebar } from '../../../components/ModernSidebar';
export const Sidebar = ({ isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Read manager's real name from localStorage (set at login)
  const managerName = useMemo(() => {
    try {
      const userData = localStorage.getItem('authUser');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.name || parsed.username || 'Manager';
      }
    } catch (e) { /* ignore parse errors */ }
    return 'Manager';
  }, []);

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
      items: [
        { label: 'View Orders', to: '/manager/orders/view' },
        { label: 'Create Order', to: '/manager/orders/create' },
        { label: 'Direct Writer Push', to: '/manager/orders/create/direct-writer' },
        { label: 'Direct Blogger Push', to: '/manager/orders/create/direct-blogger' },
      ],
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
        { label: 'Bloggers', to: '/manager/rejected/bloggers' },
        { label: 'Writers', to: '/manager/rejected/writers' }
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
      active: location.pathname === '/manager/profile'
    }
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <ModernSidebar
      navItems={navItems}
      userName={managerName}
      userRole="Manager"
      onLogout={handleLogout}
      isMobileOpen={isMobileOpen}
      onMobileClose={onMobileClose}
      profileLink="/manager/profile"
    />
  );
};