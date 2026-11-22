import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { registrationService } from '../services/registrationService';
import { eventService } from '../services/eventService';
import { REGISTRATION_STATUSES } from '../services/initialData';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const Participants = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [cancelTarget, setCancelTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedEventId, selectedStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [regs, eventList] = await Promise.all([
        registrationService.getAllRegistrations({
          eventId: selectedEventId,
          status: selectedStatus,
          search: searchTerm
        }),
        eventService.getAllEvents()
      ]);
      setRegistrations(regs);
      setEvents(eventList);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await registrationService.updateStatus(id, newStatus);
      setFeedback({ type: 'success', message: `Registration status updated to ${newStatus}.` });
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await registrationService.cancelRegistration(cancelTarget.id);
      setFeedback({ type: 'success', message: `Registration for ${cancelTarget.studentName} was cancelled.` });
      setCancelTarget(null);
      loadData();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-2 border-b border-line">
        <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">Participant Management</h1>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          View, audit, and regulate registered university students across scheduled events.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-success-bg border-success/30 text-success'
              : 'bg-danger-bg border-danger/30 text-danger'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-card space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search student name, ID, email, or event title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-primary focus:border-sage focus:outline-none max-w-xs truncate"
          >
            <option value="All">All Events</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.eventName}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-primary focus:border-sage focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {REGISTRATION_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Querying participant roster records..." />
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No registrations found"
          description="No students matched your search criteria or event filters."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-page/70 border-b border-line text-[11px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Registered Event</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-page/50 transition">
                    <td className="py-3.5 px-4 font-bold text-primary">{reg.studentName}</td>
                    <td className="py-3.5 px-4 font-mono text-secondary">{reg.studentId}</td>
                    <td className="py-3.5 px-4 max-w-xs font-medium text-sage truncate">{reg.eventName}</td>
                    <td className="py-3.5 px-4 text-secondary">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-secondary shrink-0" />
                        <span>{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{reg.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondary whitespace-nowrap">
                      {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={reg.registrationStatus} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {reg.registrationStatus !== 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(reg.id, 'Confirmed')}
                            className="p-1.5 text-xs text-success hover:bg-success-bg rounded-lg transition"
                            title="Confirm Registration"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {reg.registrationStatus !== 'Cancelled' && (
                          <button
                            onClick={() => setCancelTarget(reg)}
                            className="p-1.5 text-xs text-danger hover:bg-danger-bg rounded-lg transition"
                            title="Cancel Registration"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        title="Cancel Student Registration"
        message={`Are you sure you want to cancel the registration for "${cancelTarget?.studentName}"? This will free up a seat on the event capacity.`}
        confirmText="Cancel Registration"
        isDanger={true}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
};
