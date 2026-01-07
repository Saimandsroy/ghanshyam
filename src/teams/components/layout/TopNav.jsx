import React from 'react';
import { Menu } from 'lucide-react';

export function TopNav({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-card border-b border-border shadow-md">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold">
          <span className="text-primary">Link</span>Management
        </h1>
      </div>
    </header>
  );
}