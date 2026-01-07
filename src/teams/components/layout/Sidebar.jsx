import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CheckCircle,
  Bell,
  XCircle,
  Database,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { ModernSidebar } from '../../../components/ModernSidebar';

export function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', to: '/teams', active: location.pathname === '/teams' || location.pathname === '/teams/' },
    { icon: <Bell size={20} />, label: 'Order Added Notifications', to: '/teams/order-notifications', active: location.pathname.startsWith('/teams/order-notifications') },
    { icon: <CheckCircle size={20} />, label: 'Completed Orders', to: '/teams/completed-orders', active: location.pathname === '/teams/completed-orders' },
    { icon: <XCircle size={20} />, label: 'Rejected Links', to: '/teams/rejected-links', active: location.pathname === '/teams/rejected-links' },
    { icon: <Database size={20} />, label: 'New Sites', to: '/teams/new-sites', active: location.pathname === '/teams/new-sites' },
    { icon: <MessageSquare size={20} />, label: 'Threads', to: '/teams/threads', active: location.pathname === '/teams/threads' },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <ModernSidebar
      navItems={navItems}
      userName="Team Member"
      userRole="Team"
      onLogout={handleLogout}
      isMobileOpen={false}
      onMobileClose={() => { }}
    />
  );
}