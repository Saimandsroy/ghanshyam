import React, { useState } from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from '../components/ThemeToggle';
import { CompletedOrders } from './pages/CompletedOrders.jsx';
import { OrderNotifications } from './pages/OrderNotifications.jsx';
import { RejectedLinks } from './pages/RejectedLinks.jsx';
import { NewSites } from './pages/NewSites.jsx';
import { Threads } from './pages/Threads.jsx';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="completed-orders" element={<CompletedOrders />} />
            <Route path="order-notifications" element={<OrderNotifications />} />
            <Route path="rejected-links" element={<RejectedLinks />} />
            <Route path="new-sites" element={<NewSites />} />
            <Route path="threads" element={<Threads />} />
          </Routes>
        </main>
      </div>
      <ThemeToggle />
    </div>
  );
}