import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid,
  Wallet,
  ShoppingBag,
  MessageCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { ModernSidebar } from '../../components/ModernSidebar';

export function BloggerSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: <LayoutGrid size={20} />, 
      label: 'Dashboard', 
      to: '#dashboard',
      active: activeTab === 'dashboard'
    },
    { 
      icon: <Wallet size={20} />, 
      label: 'Wallet', 
      to: '#wallet',
      active: activeTab === 'wallet'
    },
    { 
      icon: <ShoppingBag size={20} />, 
      label: 'Today Orders', 
      to: '#orders',
      active: activeTab === 'orders'
    },
    { 
      icon: <MessageCircle size={20} />, 
      label: 'Threads', 
      to: '#threads',
      active: activeTab === 'threads'
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Reports', 
      to: '#reports',
      active: activeTab === 'reports'
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      to: '#settings',
      active: activeTab === 'settings'
    }
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/');
  };

  // Handle navigation clicks to update activeTab
  const navItemsWithClick = navItems.map(item => ({
    ...item,
    onClick: () => {
      const id = item.to.replace('#', '');
      setActiveTab(id);
    }
  }));

  return (
    <ModernSidebar
      navItems={navItemsWithClick}
      userName="Blogger User"
      userRole="Blogger"
      onLogout={handleLogout}
      isMobileOpen={false}
      onMobileClose={() => {}}
    />
  );
}
