import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart2, 
  Users, 
  Link, 
  FileText, 
  AlertCircle, 
  Database 
} from 'lucide-react';
import { ModernSidebar } from '../../../components/ModernSidebar';

export function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      to: '/teams',
      active: location.pathname === '/teams' || location.pathname === '/teams/'
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Analytics',
      to: '/teams/analytics',
      active: location.pathname === '/teams/analytics'
    },
    {
      icon: <Users size={20} />,
      label: 'Team',
      to: '/teams/team',
      active: location.pathname === '/teams/team'
    },
    {
      icon: <Link size={20} />,
      label: 'Links',
      to: '/teams/links',
      active: location.pathname === '/teams/links'
    },
    {
      icon: <FileText size={20} />,
      label: 'Orders',
      to: '/teams/orders',
      active: location.pathname === '/teams/orders'
    },
    {
      icon: <AlertCircle size={20} />,
      label: 'Issues',
      to: '/teams/issues',
      active: location.pathname === '/teams/issues'
    },
    {
      icon: <Database size={20} />,
      label: 'Sites',
      to: '/teams/sites',
      active: location.pathname === '/teams/sites'
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
      userName="Team Member"
      userRole="Team"
      onLogout={handleLogout}
      isMobileOpen={false}
      onMobileClose={() => {}}
    />
  );
}