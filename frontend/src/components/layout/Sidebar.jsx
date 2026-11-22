import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';
import { authService } from '../../services/authService';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {
    name: 'Prof. Ramesh Chandra',
    email: 'admin@eventease.edu',
    role: 'ADMIN'
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Event Management', path: '/events', icon: CalendarDays },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Reports & Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Public Discovery', path: '/explore', icon: Globe },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-primary flex flex-col border-r border-line transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-line flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-sage-bg border border-sage/20 flex items-center justify-center text-sage shadow-sm group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 text-sage" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-extrabold text-lg tracking-tight text-primary">EventEase</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-sage text-white rounded">ADMIN</span>
              </div>
              <p className="text-[11px] text-secondary">Plan. Manage. Experience.</p>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-5 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-secondary">
            Administration Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sage-bg text-sage font-semibold border border-sage/20 shadow-subtle'
                      : 'text-secondary hover:text-primary hover:bg-page'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-sage-light group-hover:text-sage transition-colors" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </NavLink>
            );
          })}
        </div>

        {/* Admin Profile Footer */}
        <div className="p-3.5 border-t border-line bg-page/50">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-line shadow-subtle">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-sage-bg border border-sage/20 flex items-center justify-center font-bold text-xs text-sage uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-primary truncate">{user.name}</p>
                <p className="text-[10px] text-secondary truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-secondary hover:text-danger hover:bg-danger-bg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
