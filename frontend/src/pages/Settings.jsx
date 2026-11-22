import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  Database,
  LogOut,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService';

export const Settings = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {
    name: 'Prof. Ramesh Chandra',
    email: 'admin@eventease.edu',
    role: 'ADMIN',
    department: 'Dean of Student Affairs'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="pb-2 border-b border-line">
        <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">System Settings & Profile</h1>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Manage administrator credentials, application environment, and database layer.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-line p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sage-bg border border-sage/20 text-sage flex items-center justify-center font-bold text-xl uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-primary">{user.name}</h3>
              <p className="text-xs text-secondary">{user.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sage text-white tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-danger bg-danger-bg hover:bg-danger/20 border border-danger/20 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-line p-6 shadow-card space-y-4">
        <h3 className="text-xs font-bold text-sage uppercase tracking-wider">Application Environment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-page border border-line flex items-start gap-3">
            <Server className="w-5 h-5 text-sage mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-primary">Backend Architecture</p>
              <p className="text-secondary mt-0.5">Java 21 • Spring Boot 3.x</p>
              <p className="text-[11px] text-muted mt-1">REST API with JPA transactions</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-page border border-line flex items-start gap-3">
            <Database className="w-5 h-5 text-warm mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-primary">Database Layer</p>
              <p className="text-secondary mt-0.5">PostgreSQL (Supabase)</p>
              <p className="text-[11px] text-muted mt-1">Relational schema with unique student-event constraints</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sage-bg border border-sage/20 text-xs text-sage flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-sage mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-primary">EventEase Light Theme Release</span>
            <p className="text-[11px] text-secondary mt-0.5">
              Styled with custom Sage Green (`#52796F`), Soft Warm Highlights (`#F5E8DD`), and Off-White (`#F8F8F5`).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
