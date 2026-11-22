import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { registrationService } from '../services/registrationService';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const MyRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadMyRegistrations();
  }, [activeFilter]);

  const loadMyRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getMyRegistrations(activeFilter);
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to load my registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await registrationService.cancelMyRegistration(cancelTarget.id);
      setFeedback({
        type: 'success',
        message: `Your registration for "${cancelTarget.eventName}" was successfully cancelled. Your reserved seat has been released.`
      });
      setCancelTarget(null);
      loadMyRegistrations();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const filters = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
            My Event Passes & Registrations
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Manage your reserved seats, view ticket credentials, and handle cancellations.
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark transition shadow-sm self-start sm:self-auto"
        >
          <span>Find More Events</span>
          <ArrowRight className="w-3.5 h-3.5 text-warm" />
        </Link>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between border ${
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-line pb-3 overflow-x-auto">
        <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-sage" /> Status:
        </span>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === f
                ? 'bg-sage text-white shadow-sm'
                : 'bg-white text-secondary hover:text-primary border border-line'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {loading ? (
        <LoadingSpinner message="Retrieving your confirmed event bookings..." />
      ) : registrations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-12 text-center space-y-4 shadow-card">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sage-bg border border-sage/20 text-sage flex items-center justify-center">
            <Ticket className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-primary">No event registrations found</h3>
            <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
              {activeFilter === 'All'
                ? "You haven't reserved any passes yet. Explore campus events to register."
                : `No registrations found with status "${activeFilter}".`}
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
          >
            Browse Campus Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-white rounded-3xl border border-line shadow-card overflow-hidden hover:border-sage/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-page overflow-hidden">
                  <img
                    src={reg.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                    alt={reg.eventName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={reg.registrationStatus} />
                  </div>
                  <div className="absolute bottom-2.5 right-3">
                    <span className="text-[10px] font-mono font-bold bg-white/95 backdrop-blur-md text-primary px-2.5 py-0.5 rounded-lg border border-line">
                      Booking: EE-{reg.id}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-base text-primary line-clamp-1">
                    {reg.eventName}
                  </h3>

                  <div className="space-y-1.5 text-xs text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-warm shrink-0" />
                      <span>{reg.eventDate || 'Scheduled date in syllabus'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                      <span className="truncate">{reg.venue || 'Campus Venue'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>Reserved on: {new Date(reg.registrationDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-line text-[11px] text-secondary flex items-center justify-between">
                    <span>Attendee: <strong className="text-primary">{reg.studentName}</strong></span>
                    <span className="font-mono">Roll: {reg.studentId}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                <Link
                  to={`/explore?register=${reg.eventId}`}
                  className="text-xs font-semibold text-sage hover:underline"
                >
                  Event Details &rarr;
                </Link>

                {reg.registrationStatus !== 'Cancelled' && (
                  <button
                    onClick={() => setCancelTarget(reg)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-danger bg-danger-bg hover:bg-danger/20 border border-danger/20 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Seat</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        title="Cancel Event Reservation"
        message={`Are you sure you want to cancel your seat for "${cancelTarget?.eventName}"? Your reservation will be cancelled and the seat will be made available to other students.`}
        confirmText="Confirm Cancellation"
        isDanger={true}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
};
