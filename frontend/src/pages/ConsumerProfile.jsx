import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Ticket,
  GraduationCap
} from 'lucide-react';
import { authService } from '../services/authService';

export const ConsumerProfile = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || {
    id: 2,
    fullName: 'Aarav Sharma',
    email: 'student@eventease.edu',
    studentId: '2023CSB1042',
    phone: '+91 98765 43210',
    role: 'CONSUMER',
    department: 'Computer Science & Engineering'
  };

  const [fullName, setFullName] = useState(currentUser.fullName || currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [profileFeedback, setProfileFeedback] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileFeedback(null);

    if (!fullName.trim()) {
      setProfileFeedback({ type: 'error', message: 'Full student name cannot be empty.' });
      return;
    }

    try {
      setSavingProfile(true);
      await authService.updateProfile(currentUser.id, { fullName: fullName.trim(), phone: phone.trim() });
      setProfileFeedback({ type: 'success', message: 'Student profile updated successfully!' });
    } catch (err) {
      setProfileFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      setSavingPassword(true);
      await authService.changePassword(currentUser.id, { currentPassword, newPassword });
      setPasswordFeedback({ type: 'success', message: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/student/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
            Student Account & Profile
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Manage your personal details, institutional credentials, and security settings.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-danger bg-danger-bg hover:bg-danger/20 border border-danger/20 transition self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-card flex items-center gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-sage-bg border border-sage/20 text-sage flex items-center justify-center font-bold text-2xl uppercase shadow-sm">
          {fullName.charAt(0)}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display font-bold text-primary">{fullName}</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sage text-white px-2.5 py-0.5 rounded-full">
              Student / Scholar
            </span>
          </div>
          <p className="text-xs text-secondary">{currentUser.email}</p>
          <p className="text-xs text-sage font-mono font-semibold">Student ID: {currentUser.studentId || '2023CSB1042'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Form */}
        <div className="bg-white rounded-3xl border border-line p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-display font-bold text-primary">Personal Details</h3>
            <p className="text-xs text-secondary">Update your contact information</p>
          </div>

          {profileFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              profileFeedback.type === 'success' ? 'bg-success-bg border-success/30 text-success' : 'bg-danger-bg border-danger/30 text-danger'
            }`}>
              {profileFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{profileFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-primary mb-1">Full Student Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-primary mb-1">Institutional Student ID (Read-only)</label>
              <input
                type="text"
                value={currentUser.studentId || '2023CSB1042'}
                disabled
                className="w-full px-3.5 py-2 rounded-xl bg-page/70 border border-line text-secondary cursor-not-allowed font-mono"
              />
              <p className="text-[10px] text-muted mt-1">Student ID is verified through the Office of Student Affairs.</p>
            </div>

            <div>
              <label className="block font-semibold text-primary mb-1">College Email (Read-only)</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3.5 py-2 rounded-xl bg-page/70 border border-line text-secondary cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-primary mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm disabled:opacity-70"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-3xl border border-line p-6 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-display font-bold text-primary">Security & Password</h3>
            <p className="text-xs text-secondary">Ensure your account credentials remain secure</p>
          </div>

          {passwordFeedback && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              passwordFeedback.type === 'success' ? 'bg-success-bg border-success/30 text-success' : 'bg-danger-bg border-danger/30 text-danger'
            }`}>
              {passwordFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-primary mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-primary mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-primary mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm disabled:opacity-70"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
