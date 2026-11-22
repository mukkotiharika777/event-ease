import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { authService } from '../../services/authService';

export const ConsumerNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = authService.getCurrentUser() || {
    fullName: 'Student',
    studentId: '2023CSB1042',
    email: 'student@eventease.edu'
  };

  const navLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Explore Events', path: '/explore', icon: Compass },
    { name: 'My Registrations', path: '/student/registrations', icon: CalendarCheck },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/student/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line shadow-subtle font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/student/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-sage-bg border border-sage/20 flex items-center justify-center text-sage group-hover:scale-105 transition shadow-sm">
            <Sparkles className="w-5 h-5 text-sage" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-primary">EventEase</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage bg-sage-bg px-2 py-0.5 rounded-full border border-sage/20">Student</span>
            </div>
            <p className="text-[11px] text-secondary tracking-wide hidden sm:block">Plan. Manage. Experience.</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition px-3 py-1.5 rounded-xl ${
                    isActive
                      ? 'text-sage bg-sage-bg border border-sage/20 shadow-subtle'
                      : 'text-secondary hover:text-primary hover:bg-page'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-sage" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Pill & Logout */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/student/profile"
            className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-page border border-line hover:border-sage/30 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-sage text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {(user.fullName || user.name || 'S').charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-primary truncate max-w-[120px]">{user.fullName || user.name}</p>
              <p className="text-[10px] text-secondary font-mono">{user.studentId || 'ID Verified'}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-secondary hover:text-danger hover:bg-danger-bg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-secondary hover:text-primary hover:bg-page transition"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-white px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 text-sm font-semibold text-primary hover:text-sage"
            >
              <item.icon className="w-4 h-4 text-sage" />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <span className="text-xs text-secondary font-mono">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-danger hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
