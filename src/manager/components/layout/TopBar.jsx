import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
export const TopBar = ({ onMenuClick }) => {
  return <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button className="lg:hidden p-2 rounded-md hover:bg-surface mr-2" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold lg:hidden">LinkManager</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input type="text" placeholder="Search..." className="input pl-9 pr-3 py-1.5 rounded-full w-[220px]" />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        </div>
      </div>
    </div>;
};