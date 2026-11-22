import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Ticket
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import { CATEGORIES } from '../services/initialData';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PublicEvents = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const registerParamId = searchParams.get('register');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Authenticated User
  const currentUser = authService.getCurrentUser();

  // Registration Modal State
  const [registerEvent, setRegisterEvent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    studentName: '',
    studentId: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [selectedCategory]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents({
        category: selectedCategory,
        status: 'Upcoming',
        search: searchTerm
      });
      setEvents(data);

      if (registerParamId) {
        const target = data.find(e => String(e.id) === String(registerParamId));
        if (target) {
          openRegisterModal(target);
        }
      }
    } catch (err) {
      console.error('Error fetching public events:', err);
    } finally {
      setLoading(false);
    }
  };

  const openRegisterModal = (event) => {
    setRegisterEvent(event);
    if (currentUser) {
      // Auto-populate from logged-in consumer profile so they never retype unnecessarily
      setStudentForm({
        studentName: currentUser.fullName || currentUser.name || '',
        studentId: currentUser.studentId || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '+91 98765 43210'
      });
    } else {
      setStudentForm({ studentName: '', studentId: '', email: '', phone: '' });
    }
    setModalFeedback(null);
    setConfirmedBooking(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setModalFeedback(null);

    if (!studentForm.studentName.trim()) {
      setModalFeedback({ type: 'error', message: 'Full student name is required.' });
      return;
    }
    if (!studentForm.studentId.trim()) {
      setModalFeedback({ type: 'error', message: 'Institutional Student ID / Roll No is required.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentForm.email)) {
      setModalFeedback({ type: 'error', message: 'Please provide a valid institutional email.' });
      return;
    }
    if (studentForm.phone.length < 10) {
      setModalFeedback({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    try {
      setSubmitting(true);
      const booking = await registrationService.registerStudent({
        eventId: registerEvent.id,
        ...studentForm
      });
      setConfirmedBooking(booking);
      loadEvents(); // Refresh seat counts
    } catch (err) {
      setModalFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Editorial Page Header */}
        <div className="text-left space-y-2 border-b border-line pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-sage">Campus Calendar</span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-primary tracking-tight">
            Explore All Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-secondary max-w-2xl">
            Browse upcoming workshops, technical hackathons, cultural festivals, and research symposiums. Reserve your seat with your student credentials.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-line shadow-card space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by event title, organizer or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadEvents()}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'All'
                  ? 'bg-sage text-white shadow-sm'
                  : 'bg-page text-secondary hover:text-primary'
              }`}
            >
              All Domains
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-sage text-white shadow-sm'
                    : 'bg-page text-secondary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSpinner message="Searching scheduled events..." />
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-line">
            <p className="text-base font-bold text-primary">No events found matching your filter</p>
            <p className="text-xs text-secondary mt-1">Try searching another term or switch categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl border border-line shadow-card hover:border-sage/40 transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-page">
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <CategoryBadge category={event.category} />
                    </div>
                    <div className="absolute bottom-2.5 right-3">
                      <span className="text-[11px] font-bold bg-white/95 backdrop-blur-md text-primary px-2.5 py-0.5 rounded-lg border border-line shadow-sm">
                        {event.registrationFee === 0 ? 'Free Entry' : `₹${event.registrationFee}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-display font-bold text-base text-primary group-hover:text-sage transition line-clamp-1">
                      {event.eventName}
                    </h3>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-line text-xs text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-warm shrink-0" />
                        <span>{event.eventDate} ({event.startTime} - {event.endTime})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span>Capacity: <strong className="text-primary">{event.maxParticipants} participants</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => openRegisterModal(event)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3.5 h-3.5 text-warm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Registration Modal */}
        {registerEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-primary/25 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="relative bg-white rounded-3xl shadow-elevated max-w-lg w-full p-6 sm:p-8 border border-line animate-in fade-in zoom-in-95">
              <button
                onClick={() => setRegisterEvent(null)}
                className="absolute top-5 right-5 text-secondary hover:text-primary p-1.5 rounded-xl hover:bg-page transition"
              >
                <X className="w-5 h-5" />
              </button>

              {confirmedBooking ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-success-bg border border-success/30 text-success flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-primary">Registration Confirmed!</h3>
                    <p className="text-xs text-secondary mt-1">
                      Your seat is secured for <strong className="text-primary">{confirmedBooking.eventName}</strong>.
                    </p>
                  </div>
                  <div className="bg-page p-4 rounded-2xl border border-line text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-secondary">Booking Reference:</span>
                      <span className="font-mono font-bold text-primary">EE-{confirmedBooking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Student Name:</span>
                      <span className="font-semibold text-primary">{confirmedBooking.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Student ID:</span>
                      <span className="font-mono text-primary">{confirmedBooking.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Status:</span>
                      <span className="text-success font-bold">CONFIRMED</span>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to="/student/registrations"
                      onClick={() => setRegisterEvent(null)}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm text-center"
                    >
                      View in My Registrations
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage">Campus Registration</span>
                    <h3 className="text-lg font-display font-bold text-primary leading-tight mt-0.5">{registerEvent.eventName}</h3>
                    <p className="text-xs text-secondary mt-1">{registerEvent.venue} • {registerEvent.eventDate}</p>
                  </div>

                  {currentUser && (
                    <div className="mb-4 p-3 rounded-2xl bg-sage-bg border border-sage/20 text-xs text-secondary flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-sage shrink-0" />
                      <span>
                        Registering as <strong className="text-primary">{currentUser.fullName || currentUser.name}</strong> ({currentUser.studentId || 'ID Verified'}). Profile details auto-filled.
                      </span>
                    </div>
                  )}

                  {modalFeedback && (
                    <div className="mb-4 p-3 rounded-xl bg-danger-bg border border-danger/30 text-xs text-danger flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{modalFeedback.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Full Student Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={studentForm.studentName}
                        onChange={(e) => setStudentForm({ ...studentForm, studentName: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        Student ID / Roll Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2024CSB1090"
                        value={studentForm.studentId}
                        onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">
                          Institutional Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="student@college.edu"
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1">
                          Contact Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={studentForm.phone}
                          onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[11px] text-secondary flex items-center gap-1.5 mb-4">
                        <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
                        <span>Duplicate registrations are restricted by Student ID and Email.</span>
                      </p>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {submitting ? 'Confirming Seat...' : 'Confirm Registration'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};
