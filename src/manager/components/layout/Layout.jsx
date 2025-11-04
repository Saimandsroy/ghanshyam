import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ThemeToggle } from '../../../components/ThemeToggle';

export const Layout = ({
  children
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onMobileClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <TopBar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="container py-6 px-4 lg:px-8 flex-1">{children}</main>
      </div>
      <ThemeToggle />
    </div>;
};