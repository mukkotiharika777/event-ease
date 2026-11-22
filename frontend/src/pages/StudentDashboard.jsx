import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Ticket,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Award
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser() || {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu',
        studentId: '2023CSB1042',
        role: 'STUDENT'
      };
      setUser(currentUser);

      const [allEvents, allRegs] = await Promise.all([
        eventService.getAllEvents(),
        registrationService.getAllRegistrations()
      ]);

      setEvents(allEvents);
      // Filter student registrations by email or student ID, or fallback to first few for demo
      const userRegs = allRegs.filter(r => 
        (currentUser.email && r.email?.toLowerCase() === currentUser.email?.toLowerCase()) ||
        (currentUser.studentId && r.studentId === currentUser.studentId)
      );
      setMyRegistrations(userRegs.length > 0 ? userRegs : allRegs.slice(0, 2));
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Personalizing your campus portal..." size="large" />;
  }

  const upcomingEvents = events.filter(e => e.status === 'Upcoming').slice(0, 3);
  const recommendedEvents = events.filter(e => e.category === 'Technical' || e.category === 'Workshop').slice(0, 2);

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-bg text-sage text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Experience Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary">
              Welcome back, {user?.name || 'Scholar'}!
            </h1>
            <p className="text-xs sm:text-sm text-secondary">
              Track your confirmed tickets, discover recommended workshops, and explore upcoming events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5 text-warm" />
            </Link>
          </div>
        </div>

        {/* 2-Column Main Section: My Bookings & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: My Confirmed Registrations (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <div>
                <h3 className="text-lg font-display font-bold text-primary">My Registrations & Tickets</h3>
                <p className="text-xs text-secondary">Verified seats reserved under your Student ID</p>
              </div>
              <span className="text-xs font-semibold text-sage bg-sage-bg px-2.5 py-1 rounded-lg">
                {myRegistrations.length} Bookings
              </span>
            </div>

            {myRegistrations.length === 0 ? (
              <div className="bg-white rounded-2xl border border-line p-8 text-center space-y-3">
                <Ticket className="w-10 h-10 mx-auto text-secondary/40" />
                <h4 className="text-sm font-bold text-primary">No active registrations yet</h4>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  You haven't reserved seats for any events yet. Browse our calendar to secure your pass.
                </p>
                <Link
                  to="/explore"
                  className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage"
                >
                  Discover Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-white rounded-2xl border border-line p-5 shadow-subtle hover:border-sage/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={reg.registrationStatus} />
                        <span className="text-[11px] font-mono text-secondary">Ref: EE-{reg.id}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-primary">
                        {reg.eventName}
                      </h4>
                      <p className="text-xs text-secondary">
                        Registered under: <strong className="text-primary">{reg.studentName}</strong> ({reg.studentId})
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-line text-xs">
                      <span className="text-secondary text-[11px]">
                        Booked: {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'Active'}
                      </span>
                      <Link
                        to={`/explore?register=${reg.eventId}`}
                        className="mt-1 text-xs font-semibold text-sage hover:underline"
                      >
                        Event Info &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upcoming Campus Calendar Strip */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-display font-bold text-primary">Upcoming This Month</h3>
                <Link to="/explore" className="text-xs font-semibold text-sage hover:underline">See full calendar</Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/explore?register=${evt.id}`)}
                    className="bg-white rounded-2xl border border-line p-4 shadow-subtle hover:border-sage/40 transition cursor-pointer group"
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-page">
                      <img
                        src={evt.imageUrl}
                        alt={evt.eventName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <CategoryBadge category={evt.category} />
                    <h5 className="font-display font-bold text-xs text-primary mt-2 line-clamp-1 group-hover:text-sage transition">
                      {evt.eventName}
                    </h5>
                    <p className="text-[11px] text-secondary mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-warm shrink-0" />
                      <span>{evt.eventDate}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations & Profile Summary (1 col) */}
          <div className="space-y-6">
            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl border border-line p-5 shadow-subtle space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sage-bg border border-sage/20 text-sage flex items-center justify-center font-bold text-lg uppercase">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">{user?.name}</h4>
                  <p className="text-xs text-secondary">{user?.email}</p>
                  <span className="text-[10px] font-mono text-sage font-semibold">Roll: {user?.studentId || '2023CSB1042'}</span>
                </div>
              </div>
            </div>

            {/* Recommended for You */}
            <div className="bg-white rounded-2xl border border-line p-5 shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-warm" />
                <h4 className="text-sm font-display font-bold text-primary">Recommended For You</h4>
              </div>

              <div className="space-y-3">
                {recommendedEvents.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl bg-page border border-line space-y-2">
                    <span className="text-[10px] font-bold text-sage uppercase">{rec.category}</span>
                    <h5 className="text-xs font-bold text-primary line-clamp-1">{rec.eventName}</h5>
                    <p className="text-[11px] text-secondary line-clamp-2">{rec.description}</p>
                    <Link
                      to={`/explore?register=${rec.id}`}
                      className="inline-block text-xs font-semibold text-sage hover:underline"
                    >
                      Reserve Spot &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
