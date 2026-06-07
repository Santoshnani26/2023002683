import React from 'react';
import { Search, Sun, Bell } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex items-center w-96 relative">
        <Search className="w-4 h-4 text-secondary absolute left-3" />
        <input
          type="text"
          placeholder="Search notifications..."
          className="w-full bg-surface border border-border rounded-full py-1.5 pl-10 pr-4 text-sm text-primary placeholder-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-placement rounded-full animate-pulse"></span>
        </button>
        <div className="h-8 w-px bg-border mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500"></div>
          <span className="text-sm font-medium">Santosh Reddy</span>
        </div>
      </div>
    </header>
  );
}
