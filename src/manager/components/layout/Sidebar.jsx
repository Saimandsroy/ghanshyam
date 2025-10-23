import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Home, Package, Clock, AlertTriangle, MessageSquare, Globe, Search, Bell, Menu, X } from 'lucide-react';
const NavItem = ({
  icon,
  label,
  to = '#',
  active = false,
  hasDropdown = false,
  dropdownItems = [],
  onClick
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const content = <>
      {icon}
      <span className="ml-3">{label}</span>
      {hasDropdown && <ChevronDown size={16} className={`ml-auto transition-transform ${showDropdown ? 'rotate-180' : ''}`} />}
    </>;
  return <div className="mb-1">
      {hasDropdown ? <button className={`nav-item w-full inline-flex items-center gap-1.5 ${active ? 'nav-item-active' : ''}`} onClick={() => setShowDropdown(!showDropdown)}>
          {content}
        </button> : <Link to={to} className={`nav-item w-full inline-flex items-center gap-1.5 ${active ? 'nav-item-active' : ''}`} onClick={onClick}>
          {content}
        </Link>}
      {hasDropdown && showDropdown && <div className="pl-10 mt-1 space-y-1">
          {dropdownItems.map((item, index) => <Link key={index} to={item.to} className="dropdown-item block rounded-md py-2">
              {item.label}
            </Link>)}
        </div>}
    </div>;
};
export const Sidebar = ({
  isMobileOpen = false,
  onMobileClose
}) => {
  const location = useLocation();
  const sidebarClasses = `
    h-screen bg-surface border-r border-border flex flex-col
    fixed lg:static top-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;
  return <>
      {/* Mobile overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-background bg-opacity-50 z-30 lg:hidden" onClick={onMobileClose}></div>}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="font-bold text-accent text-xl">LinkManager</div>
          <button className="lg:hidden p-1 rounded-md hover:bg-surface-hover" onClick={onMobileClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <NavItem icon={<Home size={18} />} label="Dashboard" to="" active={location.pathname === '/manager' || location.pathname === '/manager/'} />
          <NavItem icon={<Package size={18} />} label="Orders" to="orders" active={location.pathname.startsWith('/manager/orders')} hasDropdown dropdownItems={[{
          label: 'New Orders',
          to: 'orders?filter=new'
        }, {
          label: 'View Orders',
          to: 'orders'
        }, {
          label: 'Pending from Bloggers',
          to: 'orders?filter=pending-bloggers'
        }]} />
          <NavItem icon={<Clock size={18} />} label="Pending Approval" hasDropdown dropdownItems={[{
          label: 'Bloggers',
          to: 'pending/bloggers'
        }, {
          label: 'Teams',
          to: 'pending/teams'
        }, {
          label: 'Writers',
          to: 'pending/writers'
        }]} />
          <NavItem icon={<AlertTriangle size={18} />} label="Rejected Orders" to="rejected" />
          <NavItem icon={<MessageSquare size={18} />} label="Threads" to="threads" />
          <NavItem icon={<Globe size={18} />} label="Sites" to="sites" />
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
              <span>JD</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-text-secondary">Admin</div>
            </div>
            <button className="relative p-1 rounded-full hover:bg-surface-hover">
              <Bell size={16} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
            </button>
          </div>
        </div>
      </aside>
    </>;
};