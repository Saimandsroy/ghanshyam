import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Clock, AlertTriangle, MessageSquare, Globe } from 'lucide-react';
import { ModernSidebar } from '../../../components/ModernSidebar';
export const Sidebar = ({ isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
      to: '/manager/orders',
      active: location.pathname.startsWith('/manager/orders'),
      hasDropdown: true,
      dropdownItems: [
        { label: 'New Orders', to: '/manager/orders?filter=new' },
        { label: 'View Orders', to: '/manager/orders' },
        { label: 'Pending from Bloggers', to: '/manager/orders?filter=pending-bloggers' }
      ]
    },
    {
      icon: <Clock size={18} />,
      label: 'Pending Approval',
      hasDropdown: true,
      active: location.pathname.startsWith('/manager/pending'),
      dropdownItems: [
        { label: 'Bloggers', to: '/manager/pending/bloggers' },
        { label: 'Teams', to: '/manager/pending/teams' },
        { label: 'Writers', to: '/manager/pending/writers' }
      ]
    },
    {
      icon: <AlertTriangle size={18} />,
      label: 'Rejected Orders',
      to: '/manager/rejected',
      active: location.pathname === '/manager/rejected'
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

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <ModernSidebar
      navItems={navItems}
      userName="John Doe"
      userRole="Manager"
      onLogout={handleLogout}
      isMobileOpen={isMobileOpen}
      onMobileClose={onMobileClose}
    />
  );
};