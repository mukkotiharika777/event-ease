import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, User, Shield, GraduationCap } from 'lucide-react';
import { authService } from '../../services/authService';

export const PublicNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = authService.getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line shadow-subtle transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-sage-bg border border-sage/20 flex items-center justify-center text-sage group-hover:scale-105 transition shadow-sm">
            <Sparkles className="w-5 h-5 text-sage" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-primary">EventEase</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage bg-sage-bg px-2 py-0.5 rounded-full border border-sage/20">Campus</span>
            </div>
            <p className="text-[11px] text-secondary tracking-wide hidden sm:block">Plan. Manage. Experience.</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-secondary">
          <Link to="/" className="hover:text-sage transition">Home</Link>
          <Link to="/explore" className="hover:text-sage transition">Explore Events</Link>
          <a href="/#categories" className="hover:text-sage transition">Categories</a>
          <a href="/#about" className="hover:text-sage transition">About</a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                to={currentUser.role === 'ADMIN' ? '/dashboard' : '/student/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-sage bg-sage-bg border border-sage/20 hover:bg-sage hover:text-white transition shadow-sm"
              >
                {currentUser.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                <span>{currentUser.role === 'ADMIN' ? 'Admin Dashboard' : 'Student Portal'}</span>
              </Link>
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/student/login');
                }}
                className="text-xs font-semibold text-secondary hover:text-danger transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/student/login"
                className="px-3.5 py-2 text-xs font-semibold text-secondary hover:text-primary transition"
              >
                Student Login
              </Link>
              <Link
                to="/student/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-sm"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 text-warm" />
              </Link>
              <Link
                to="/login"
                className="p-2 text-xs text-muted hover:text-primary transition border-l border-line ml-1 pl-3"
                title="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </Link>
            </div>
          )}
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
        <div className="md:hidden border-t border-line bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-primary hover:text-sage"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-primary hover:text-sage"
          >
            Explore Events
          </Link>
          <a
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-primary hover:text-sage"
          >
            Categories
          </a>

          <div className="pt-3 border-t border-line flex flex-col gap-2">
            {currentUser ? (
              <Link
                to={currentUser.role === 'ADMIN' ? '/dashboard' : '/student/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold rounded-xl text-white bg-sage"
              >
                Go to {currentUser.role === 'ADMIN' ? 'Admin Dashboard' : 'Student Portal'}
              </Link>
            ) : (
              <>
                <Link
                  to="/student/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs font-semibold rounded-xl border border-line text-primary"
                >
                  Student Login
                </Link>
                <Link
                  to="/student/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold rounded-xl text-white bg-sage"
                >
                  Create Student Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
