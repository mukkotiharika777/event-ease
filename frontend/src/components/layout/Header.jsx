import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Globe,
  ExternalLink
} from 'lucide-react';
import { authService } from '../../services/authService';

export const Header = ({ onMenuClick, onQuickSearch }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const user = authService.getCurrentUser() || { name: 'Administrator' };

  const notifications = [
    {
      id: 1,
      title: 'New registration received',
      desc: 'Aarav Sharma registered for ApexHack 2026',
      time: '10m ago'
    },
    {
      id: 2,
      title: 'Capacity alert (95%)',
      desc: 'Generative AI Workshop is approaching max capacity',
      time: '1h ago'
    },
    {
      id: 3,
      title: 'Event scheduled',
      desc: 'Tarang 2026 amphitheatre booking confirmed',
      time: '1d ago'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-line shadow-subtle px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-secondary hover:text-primary hover:bg-page transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search events, venues, organizers..."
              onChange={(e) => onQuickSearch && onQuickSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Create Event */}
          <button
            onClick={() => navigate('/events/new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-warm" />
            <span>New Event</span>
          </button>

          {/* Public Portal Switch */}
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-sage bg-sage-bg hover:bg-sage hover:text-white border border-sage/20 transition"
            title="Switch to Public Discovery"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Public View</span>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-secondary hover:text-primary hover:bg-page transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warm ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-line p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] font-semibold text-sage bg-sage-bg px-2 py-0.5 rounded-full border border-sage/20">
                    2 unread
                  </span>
                </div>
                <div className="divide-y divide-line py-1 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 hover:bg-page px-1.5 rounded-lg transition">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-primary">{n.title}</p>
                        <span className="text-[10px] text-muted shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-secondary mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 pt-2 text-center text-xs font-semibold text-sage hover:text-sage-dark border-t border-line"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 pl-2 border-l border-line cursor-pointer hover:opacity-85 transition"
          >
            <div className="w-8 h-8 rounded-full bg-sage-bg border border-sage/20 text-sage flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-primary leading-none">{user.name}</p>
              <p className="text-[10px] text-secondary leading-tight mt-0.5">Dean of Student Affairs</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
