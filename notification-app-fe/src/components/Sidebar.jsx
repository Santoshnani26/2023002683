import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, Settings, LogOut, Bell } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'All Notifications', path: '/', icon: LayoutDashboard },
    { name: 'Priority Inbox', path: '/priority', icon: Inbox },
  ];

  return (
    <div className="w-64 border-r border-border bg-surface h-screen fixed left-0 top-0 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3">
          <Bell className="w-5 h-5 text-background" />
        </div>
        <span className="text-primary font-semibold text-lg tracking-tight">Affordmed</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-medium text-secondary uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary hover:text-primary hover:bg-surfaceHover'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-surfaceHover transition-colors">
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
