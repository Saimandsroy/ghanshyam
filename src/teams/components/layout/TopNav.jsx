import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
export function TopNav({ onMenuClick }) {
  return <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#2D1066] border-b border-[#2C3445] shadow-md">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4 p-2 rounded-full hover:bg-[#4E2C93] transition-colors" aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold">
          <span className="text-[#6BF0FF]">Link</span>Management
        </h1>
      </div>
      <div className="flex-1 mx-10">
        <div className="relative max-w-md">
          <input type="text" placeholder="Search..." className="w-full py-2 pl-10 pr-4 text-sm bg-[#1B0642] border border-[#2C3445] rounded-full focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent" />
          <Search className="absolute left-3 top-2.5 text-[#9AA4B2]" size={16} />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-[#4E2C93] transition-colors" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#F87171] rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </button>
        <button className="p-2 rounded-full hover:bg-[#4E2C93] transition-colors" aria-label="Settings">
          <Settings size={20} />
        </button>
        <div className="relative">
          <button className="flex items-center" aria-label="User menu">
            <div className="w-8 h-8 overflow-hidden rounded-full border-2 border-[#6BF0FF]">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&h=100&q=80" alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
      </div>
    </header>;
}