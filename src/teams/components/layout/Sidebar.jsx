import React from 'react';
import { Home, BarChart2, Users, Link, FileText, AlertCircle, Database, Settings, HelpCircle } from 'lucide-react';
export function Sidebar({ isOpen }) {
  const navItems = [{
    icon: <Home size={20} />,
    label: 'Dashboard',
    active: true
  }, {
    icon: <BarChart2 size={20} />,
    label: 'Analytics'
  }, {
    icon: <Users size={20} />,
    label: 'Team'
  }, {
    icon: <Link size={20} />,
    label: 'Links'
  }, {
    icon: <FileText size={20} />,
    label: 'Orders'
  }, {
    icon: <AlertCircle size={20} />,
    label: 'Issues'
  }, {
    icon: <Database size={20} />,
    label: 'Sites'
  }];
  const bottomItems = [{
    icon: <Settings size={20} />,
    label: 'Settings'
  }, {
    icon: <HelpCircle size={20} />,
    label: 'Help'
  }];
  return <aside className={`${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out h-screen bg-[#0F1724] border-r border-[#2C3445] flex flex-col`}>
      <div className="flex items-center justify-center h-16 border-b border-[#2C3445]">
        {isOpen ? <h1 className="text-xl font-bold text-[#6BF0FF]">Team Dashboard</h1> : <span className="text-2xl font-bold text-[#6BF0FF]">TD</span>}
      </div>
      <div className="flex flex-col flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {navItems.map((item, index) => <a key={index} href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-[#4E2C93] text-[#6BF0FF]' : 'text-[#D1D5DB] hover:bg-[#1A2233] hover:text-white'}`}>
              <span className="mr-3">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </a>)}
        </nav>
      </div>
      <div className="p-3 border-t border-[#2C3445]">
        {bottomItems.map((item, index) => <a key={index} href="#" className="flex items-center px-4 py-3 rounded-lg text-[#D1D5DB] hover:bg-[#1A2233] hover:text-white transition-colors">
            <span className="mr-3">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </a>)}
      </div>
    </aside>;
}