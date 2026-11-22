import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const [eventData, regs] = await Promise.all([
        eventService.getEventById(id),
        registrationService.getRegistrationsByEvent(id)
      ]);
      setEvent(eventData);
      setParticipants(regs);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await eventService.deleteEvent(id);
      navigate('/events');
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/explore?register=${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading event details..." size="large" />;
  }

  if (!event) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-line">
        <h3 className="text-lg font-bold text-primary mb-2">Event Not Found</h3>
        <p className="text-xs text-secondary mb-4">The requested record does not exist.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-sage text-white"
        >
          Return to Events
        </button>
      </div>
    );
  }

  const confirmedCount = participants.filter(p => p.registrationStatus === 'Confirmed').length;
  const availableSeats = Math.max(0, event.maxParticipants - confirmedCount);
  const percentFilled = Math.min(100, Math.round((confirmedCount / event.maxParticipants) * 100));

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Events</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-primary bg-page hover:bg-line transition"
          >
            <Share2 className="w-3.5 h-3.5 text-sage" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={() => navigate(`/events/${id}/edit`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark transition shadow-sm"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="p-1.5 text-xs font-medium rounded-xl text-danger bg-danger-bg hover:bg-danger/20 transition"
            title="Delete Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-white rounded-3xl border border-line shadow-card overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full bg-page">
          <img
            src={event.imageUrl}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryBadge category={event.category} />
              <StatusBadge status={event.status} />
              <span className="text-[11px] font-bold bg-white/90 backdrop-blur-md text-primary px-2.5 py-0.5 rounded-full">
                {event.registrationFee === 0 ? 'Free Entry' : `₹${event.registrationFee}`}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {event.eventName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Organized by {event.organizer}
            </p>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line border-t border-line bg-page/40 text-xs">
          <div className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warm-soft text-warm-hover">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-secondary">Event Date</p>
              <p className="font-bold text-primary mt-0.5">{event.eventDate}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sage-bg text-sage">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-secondary">Time</p>
              <p className="font-bold text-primary mt-0.5">{event.startTime} - {event.endTime}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-info-bg text-info">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-[10px] uppercase font-bold text-secondary">Venue</p>
              <p className="font-bold text-primary mt-0.5 truncate">{event.venue}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success-bg text-success">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-secondary">Confirmed Seats</p>
              <p className="font-bold text-primary mt-0.5">{confirmedCount} / {event.maxParticipants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-line p-5 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold text-sage uppercase tracking-wider">About Event</h3>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="pt-4 border-t border-line">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-primary">Seat Fill Rate</span>
                <span className="text-sage">{percentFilled}%</span>
              </div>
              <div className="w-full bg-page rounded-full h-2 overflow-hidden border border-line">
                <div
                  className="h-2 rounded-full bg-sage transition-all duration-500"
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <p className="text-[11px] text-secondary mt-2">
                {availableSeats > 0 ? `${availableSeats} seats remaining.` : 'Event at maximum capacity.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-line p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-line">
            <div>
              <h3 className="text-sm font-display font-bold text-primary">Registered Attendees</h3>
              <p className="text-xs text-secondary">{participants.length} enrolled students</p>
            </div>
            <button
              onClick={() => navigate(`/participants?eventId=${event.id}`)}
              className="text-xs font-semibold text-sage hover:underline"
            >
              Open in Roster &rarr;
            </button>
          </div>

          {participants.length === 0 ? (
            <p className="text-xs text-secondary py-8 text-center">No students registered yet for this event.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-line text-[10px] font-bold text-secondary uppercase tracking-wider">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Roll ID</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-page/50 transition">
                      <td className="py-2.5 px-3 font-semibold text-primary">{p.studentName}</td>
                      <td className="py-2.5 px-3 text-secondary font-mono">{p.studentId}</td>
                      <td className="py-2.5 px-3 text-secondary">{p.email}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={p.registrationStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Event Record"
        message={`Are you sure you want to delete "${event.eventName}"?`}
        confirmText="Confirm Delete"
        isDanger={true}
        onConfirm={handleDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
