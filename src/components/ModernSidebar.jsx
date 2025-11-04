import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Settings, 
  LogOut, 
  User,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modern Sidebar Component
 * 
 * Features:
 * - Clean aqua transparent highlight for active items
 * - Profile section at bottom with settings and logout
 * - Collapsible dropdown menus
 * - Smooth animations
 * - Responsive design
 */

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
  
  const content = (
    <>
      <div className="flex items-center gap-3 flex-1">
        <span className={`transition-colors duration-200 ${active ? 'text-[var(--primary-cyan)]' : 'text-[var(--text-secondary)]'}`}>
          {icon}
        </span>
        <span className={`font-medium transition-colors duration-200 ${active ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
          {label}
        </span>
      </div>
      {hasDropdown && (
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[var(--text-muted)]" />
        </motion.div>
      )}
    </>
  );

  const handleClick = (e) => {
    if (hasDropdown) {
      e.preventDefault();
      setShowDropdown(!showDropdown);
    } else if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="mb-1">
      {hasDropdown || onClick ? (
        <button
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative group ${
            active ? 'text-white' : 'hover:bg-[var(--card-background)]'
          }`}
          onClick={handleClick}
        >
          {/* Active highlight - aqua transparent layer */}
          {active && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'rgba(107, 240, 255, 0.1)',
                border: '1px solid rgba(107, 240, 255, 0.2)',
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
          <div className="relative z-10 flex items-center w-full">
            {content}
          </div>
        </button>
      ) : (
        <Link
          to={to}
          className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 relative group ${
            active ? 'text-white' : 'hover:bg-[var(--card-background)]'
          }`}
        >
          {/* Active highlight - aqua transparent layer */}
          {active && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'rgba(107, 240, 255, 0.1)',
                border: '1px solid rgba(107, 240, 255, 0.2)',
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
              }}
            />
          )}
          <div className="relative z-10 flex items-center w-full">
            {content}
          </div>
        </Link>
      )}
      
      {/* Dropdown Menu */}
      <AnimatePresence>
        {hasDropdown && showDropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-12 pr-4 py-2 space-y-1">
              {dropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--card-background)] transition-all duration-200"
                >
                  <ChevronRight size={14} />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ModernSidebar = ({
  navItems = [],
  userName = "John Doe",
  userRole = "Admin",
  userAvatar = null,
  onLogout,
  isMobileOpen = false,
  onMobileClose
}) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarClasses = `
    h-screen flex flex-col
    fixed lg:static top-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={onMobileClose}
        />
      )}

      <aside 
        className={sidebarClasses}
        style={{
          backgroundColor: 'var(--background-dark)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 p-6"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)',
              color: 'var(--background-dark)'
            }}
          >
            L
          </div>
          <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            LINKS
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={item.active}
                hasDropdown={item.hasDropdown}
                dropdownItems={item.dropdownItems}
              />
            ))}
          </nav>
        </div>

        {/* Profile Section at Bottom */}
        <div 
          className="p-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--card-background)] transition-all duration-200"
            >
              {/* Avatar */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-cyan) 0%, var(--bright-cyan) 100%)',
                  color: 'var(--background-dark)'
                }}
              >
                {userAvatar || userName.split(' ').map(n => n[0]).join('')}
              </div>

              {/* User Info */}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {userName}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {userRole}
                </div>
              </div>

              {/* Dropdown Arrow */}
              <motion.div
                animate={{ rotate: showProfileMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 card p-2 shadow-xl"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--background-dark)] transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User size={16} />
                    <span className="text-sm">Profile</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--background-dark)] transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings size={16} />
                    <span className="text-sm">Settings</span>
                  </Link>

                  <div 
                    className="my-1"
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--border)',
                    }}
                  />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200"
                    style={{ color: 'var(--error)' }}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};
