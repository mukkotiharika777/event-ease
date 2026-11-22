import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { authService } from '../services/authService';

export const ConsumerRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePasswordStrength = (pass) => {
    if (pass.length < 6) return 'Password must be at least 6 characters.';
    if (!/\d/.test(pass)) return 'Password must contain at least one numerical digit.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!formData.studentId.trim()) {
      setError('Institutional Student ID / Roll Number is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid institutional email format.');
      return;
    }
    if (formData.phone.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    const strengthError = validatePasswordStrength(formData.password);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      await authService.registerConsumer({
        fullName: formData.fullName.trim(),
        studentId: formData.studentId.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      });

      setSuccess('Account created successfully! Redirecting you to the student login...');
      setTimeout(() => {
        navigate('/student/login?registered=true');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
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
          <p className="text-xs text-secondary mt-1">Student Campus Event Account Creation</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-primary">Student Sign Up</h2>
              <p className="text-xs text-secondary mt-0.5">Reserve seats, join hackathons, and manage bookings</p>
            </div>
            <div className="p-2 rounded-xl bg-sage-bg text-sage">
              <GraduationCap className="w-5 h-5" />
            </div>
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
              <label className="block text-xs font-semibold text-primary mb-1">Full Student Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="e.g. Ananya Patel"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  placeholder="2024CSB1090"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">College Email Address</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input
                    type="password"
                    placeholder="Min 6 chars"
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
                    placeholder="Repeat password"
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
              <span>{loading ? 'Creating Student Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4 text-warm" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs">
            <span className="text-secondary">Already have a student account?</span>
            <Link to="/student/login" className="font-semibold text-sage hover:underline">
              Sign In &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link to="/login" className="text-xs text-secondary hover:text-primary transition">
            Faculty / Admin Coordinator? Access Admin Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
