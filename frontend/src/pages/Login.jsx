import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  GraduationCap,
  Users
} from 'lucide-react';
import { authService } from '../services/authService';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'admin' ? 'admin' : 'student';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState('student@eventease.edu');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Switch tabs
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    if (tab === 'admin') {
      setEmail('admin@eventease.edu');
      setPassword('Admin@123');
    } else {
      setEmail('student@eventease.edu');
      setPassword('Student@123');
    }
  };

  const handleQuickSelect = (userEmail, userPass, role) => {
    setEmail(userEmail);
    setPassword(userPass);
    setActiveTab(role === 'ADMIN' ? 'admin' : 'student');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please provide your institutional email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email.trim(), password);
      setSuccess(`Authenticated as ${user.fullName || user.name}! Directing to your workspace...`);
      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 400);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-sage-bg border border-sage/20 flex items-center justify-center text-sage group-hover:scale-105 transition shadow-sm">
              <Sparkles className="w-6 h-6 text-sage" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">EventEase</h1>
          <p className="text-xs text-secondary mt-1">Collegiate Event Management & Discovery Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-page rounded-2xl border border-line mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'student'
                  ? 'bg-white text-sage shadow-sm border border-line/60'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'admin'
                  ? 'bg-white text-sage shadow-sm border border-line/60'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Sign In</span>
            </button>
          </div>

          {/* Quick Persona Picker */}
          <div className="mb-6 p-3.5 rounded-2xl bg-sage-bg/70 border border-sage/20 text-xs text-secondary space-y-2">
            <div className="flex items-center justify-between font-bold text-primary text-[11px] uppercase tracking-wider">
              <span>Quick Test Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickSelect('aarav.sharma@college.edu', 'Student@123', 'CONSUMER')}
                className="text-left p-1.5 rounded-lg bg-white/90 hover:bg-white border border-line hover:border-sage/40 transition truncate"
              >
                🎓 <strong>Aarav Sharma</strong> (CSE)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('sneha.patel@college.edu', 'Student@123', 'CONSUMER')}
                className="text-left p-1.5 rounded-lg bg-white/90 hover:bg-white border border-line hover:border-sage/40 transition truncate"
              >
                🎓 <strong>Sneha Patel</strong> (IT)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('rohan.v@college.edu', 'Student@123', 'CONSUMER')}
                className="text-left p-1.5 rounded-lg bg-white/90 hover:bg-white border border-line hover:border-sage/40 transition truncate"
              >
                🎓 <strong>Rohan Verma</strong> (ECE)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('admin@eventease.edu', 'Admin@123', 'ADMIN')}
                className="text-left p-1.5 rounded-lg bg-white/90 hover:bg-white border border-line hover:border-sage/40 transition truncate"
              >
                🛡️ <strong>Admin</strong> (Dean)
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-bg border border-danger/30 text-xs text-danger flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-xs text-success flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                {activeTab === 'admin' ? 'Administrative Email' : 'College Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? 'Verifying Account...' : activeTab === 'admin' ? 'Sign In as Administrator' : 'Sign In to Student Portal'}</span>
              <ArrowRight className="w-4 h-4 text-warm" />
            </button>
          </form>

          {/* Create Account link */}
          <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs">
            <span className="text-secondary">New to EventEase?</span>
            <Link to="/student/register" className="font-semibold text-sage hover:underline">
              Create an Account &rarr;
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted mt-6">
          EventEase Collegiate Platform • Multi-Role Authentication Enabled
        </p>
      </div>
    </div>
  );
};
