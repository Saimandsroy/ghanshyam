import React, { useState } from 'react';
import './index.css';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <div className="flex h-screen bg-[#0F1724] text-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>;
}