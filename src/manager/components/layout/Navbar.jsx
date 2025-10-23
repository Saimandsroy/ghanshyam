import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Home, Package, Clock, AlertTriangle, MessageSquare, Globe } from 'lucide-react';
const NavItem = ({
  icon,
  label,
  active = false,
  hasDropdown = false,
  dropdownItems = []
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return <div className="relative">
      <button className={`nav-item inline-flex items-center gap-1.5 ${active ? 'nav-item-active' : ''}`} onClick={() => hasDropdown && setShowDropdown(!showDropdown)}>
        {icon}
        <span>{label}</span>
        {hasDropdown && <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />}
      </button>
      {hasDropdown && showDropdown && <div className="dropdown mt-1">
          {dropdownItems.map((item, index) => <div key={index} className="dropdown-item">
              {item}
            </div>)}
        </div>}
    </div>;
};
export const Navbar = () => {
  return <nav className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-1">
        <div className="font-bold text-accent text-xl mr-8">LinkManager</div>
        <NavItem icon={<Home size={18} />} label="Dashboard" active />
        <NavItem icon={<Package size={18} />} label="Orders" hasDropdown dropdownItems={['New Orders', 'View Orders', 'Pending from Bloggers']} />
        <NavItem icon={<Clock size={18} />} label="Pending Approval" hasDropdown dropdownItems={['Bloggers', 'Teams', 'Writers']} />
        <NavItem icon={<AlertTriangle size={18} />} label="Rejected Orders" />
        <NavItem icon={<MessageSquare size={18} />} label="Threads" />
        <NavItem icon={<Globe size={18} />} label="Sites" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input type="text" placeholder="Search..." className="input pl-9 pr-3 py-1.5 rounded-full w-[220px]" />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        </div>
        <button className="relative p-2 rounded-full hover:bg-surface">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white cursor-pointer">
          <span>JD</span>
        </div>
      </div>
    </nav>;
};