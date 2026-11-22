import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, ExternalLink } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="bg-white border-t border-line text-secondary pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-line">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sage-bg border border-sage/20 flex items-center justify-center text-sage">
                <Sparkles className="w-4 h-4 text-sage" />
              </div>
              <span className="font-display font-extrabold text-lg text-primary tracking-tight">EventEase</span>
            </div>
            <p className="text-xs leading-relaxed text-secondary">
              A modern collegiate event discovery and administration platform built for universities, student clubs, and campus innovators.
            </p>
            <div className="text-[11px] text-muted">
              Plan. Manage. Experience.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Explore Campus</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore" className="hover:text-sage transition">All Scheduled Events</Link></li>
              <li><a href="/#categories" className="hover:text-sage transition">Department Categories</a></li>
              <li><Link to="/explore?category=Technical" className="hover:text-sage transition">Technical & AI Hackathons</Link></li>
              <li><Link to="/explore?category=Cultural" className="hover:text-sage transition">Cultural Festivals</Link></li>
              <li><Link to="/explore?category=Sports" className="hover:text-sage transition">Varsity Sports Tournaments</Link></li>
            </ul>
          </div>

          {/* Campus Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Administration</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-sage transition">Institutional Admin Sign In</Link></li>
              <li><Link to="/dashboard" className="hover:text-sage transition">Executive Overview</Link></li>
              <li><Link to="/events/new" className="hover:text-sage transition">Event Creation Desk</Link></li>
              <li><Link to="/participants" className="hover:text-sage transition">Attendee Management Roster</Link></li>
            </ul>
          </div>

          {/* Institutional Contact Placeholder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Office of Student Affairs</h4>
            <div className="space-y-2 text-xs text-secondary">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
                <span>Student Activity Center, Central Campus Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-warm mt-0.5 shrink-0" />
                <span>events@eventease.edu</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-sage-bg text-sage text-[11px] font-semibold">
                Official Campus Portal
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-2">
          <p>© {new Date().getFullYear()} EventEase System. Academic & Institutional Release.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-primary transition cursor-pointer">Privacy Guidelines</span>
            <span>•</span>
            <span className="hover:text-primary transition cursor-pointer">Event Terms of Participation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
