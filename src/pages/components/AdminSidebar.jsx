import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutGrid,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart3,
  Users2,
  Globe,
  Wallet,
  Link
} from 'lucide-react';
import { ModernSidebar } from '../../components/ModernSidebar';

export function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: <LayoutGrid size={20} />, 
      label: 'Dashboard', 
      to: '#dashboard',
      active: activeTab === 'dashboard'
    },
    { 
      icon: <TrendingUp size={20} />, 
      label: 'Reporting', 
      to: '#reporting',
      active: activeTab === 'reporting'
    },
    { 
      icon: <Users size={20} />, 
      label: 'Bloggers Lists', 
      to: '#bloggers',
      active: activeTab === 'bloggers'
    },
    { 
      icon: <ShoppingCart size={20} />, 
      label: 'Orders', 
      to: '#orders',
      active: activeTab === 'orders'
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: 'Price Charts', 
      to: '#charts',
      active: activeTab === 'charts'
    },
    { 
      icon: <Users2 size={20} />, 
      label: 'Team Members', 
      to: '#team',
      active: activeTab === 'team'
    },
    { 
      icon: <Globe size={20} />, 
      label: 'Sites', 
      to: '#sites',
      active: activeTab === 'sites'
    },
    { 
      icon: <Wallet size={20} />, 
      label: 'Wallet', 
      to: '#wallet',
      active: activeTab === 'wallet'
    },
    { 
      icon: <Link size={20} />, 
      label: 'More Links', 
      to: '#links',
      active: activeTab === 'links'
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
      userName="Admin User"
      userRole="Administrator"
      onLogout={handleLogout}
      isMobileOpen={false}
      onMobileClose={() => {}}
    />
  );
}
