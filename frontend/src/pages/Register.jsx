import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/authService';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    if (!formData.name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Institutional email is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Create student user object & store in session
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId || '2024CSB1100',
        phone: formData.phone,
        role: formData.role
      };
      localStorage.setItem('eventease_token', `demo-token-${Date.now()}`);
      localStorage.setItem('eventease_user', JSON.stringify(newUser));

      setSuccess('Account created successfully! Directing to your campus dashboard...');
      setTimeout(() => {
        if (formData.role === 'ADMIN') {
          navigate('/dashboard');
        } else {
          navigate('/student-portal');
        }
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
          <p className="text-xs text-secondary mt-1">Collegiate Event Discovery & Experience Platform</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
          <div className="mb-5">
            <h2 className="text-lg font-display font-bold text-primary">Create Your Account</h2>
            <p className="text-xs text-secondary mt-0.5">Join university events, book seats, and track participation</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger-bg border border-danger/30 text-xs text-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-success-bg border border-success/30 text-xs text-success flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Roll / Student ID</label>
                <input
                  type="text"
                  placeholder="2024CSB1090"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Account Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-page border border-line focus:border-sage focus:outline-none"
                >
                  <option value="STUDENT">Student / Scholar</option>
                  <option value="ADMIN">Faculty / Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>{loading ? 'Registering Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 text-warm" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-line text-center">
            <p className="text-xs text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-sage hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-muted mt-6">
          EventEase Collegiate Platform • University Campus Network
        </p>
      </div>
    </div>
  );
};
