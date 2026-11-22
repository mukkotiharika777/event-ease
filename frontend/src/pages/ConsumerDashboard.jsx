import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Compass,
  CheckCircle2,
  CalendarCheck,
  Award,
  ArrowRight,
  Sparkles,
  Ticket,
  ChevronRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser() || {
        fullName: 'Aarav Sharma',
        studentId: '2023CSB1042',
        email: 'student@eventease.edu'
      };
      setUser(currentUser);

      const [allEvents, userRegs] = await Promise.all([
        eventService.getAllEvents(),
        registrationService.getMyRegistrations('All')
      ]);

      setEvents(allEvents);
      setMyRegistrations(userRegs);
    } catch (err) {
      console.error('Error loading consumer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Assembling your personalized student portal..." size="large" />;
  }

  // Summary Metrics calculations
  const availableEventsCount = events.filter(e => e.status === 'Upcoming').length;
  const myConfirmedCount = myRegistrations.filter(r => r.registrationStatus === 'Confirmed').length;
  const upcomingEventsCount = events.filter(e => e.status === 'Upcoming').length;
  const completedEventsCount = events.filter(e => e.status === 'Completed').length;

  const featuredEvent = events[0] || {
    id: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    description: "Annual flagship hackathon bringing together top engineering minds to build AI, Web3, and Sustainable Tech solutions.",
    category: "Technical",
    eventDate: "2026-12-10",
    venue: "APJ Abdul Kalam Innovation Hub",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
  };

  const upcomingList = events.filter(e => e.status === 'Upcoming').slice(0, 3);
  const popularCategories = ['Technical', 'Workshop', 'Cultural', 'Sports'];

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Welcome Section */}
      <div className="bg-white rounded-3xl border border-line p-6 sm:p-10 shadow-card relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-bg text-sage text-xs font-semibold border border-sage/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Student Hub • Roll No: {user?.studentId || 'Verified'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-primary tracking-tight">
            Welcome back, {user?.fullName || user?.name || 'Scholar'}!
          </h1>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed">
            Discover cutting-edge hackathons, reserved masterclasses, and vibrant fests happening across campus. Every experience enriches your collegiate journey.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
            >
              <Compass className="w-4 h-4 text-warm" />
              <span>Explore Campus Events</span>
            </Link>
            <Link
              to="/student/registrations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-page border border-line transition"
            >
              <Ticket className="w-4 h-4 text-sage" />
              <span>My Passes ({myConfirmedCount})</span>
            </Link>
          </div>
        </div>

        {/* Hero Mini Art */}
        <div className="hidden lg:block relative shrink-0">
          <div className="w-48 h-36 rounded-2xl overflow-hidden border border-line shadow-sm bg-page">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=500&q=80"
              alt="Campus Life"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Four Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/explore')}
          className="bg-white rounded-2xl border border-line p-5 shadow-subtle hover:border-sage/40 hover:shadow-card transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Available Events</span>
            <div className="p-2.5 rounded-xl bg-sage-bg text-sage transition group-hover:scale-110">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-display font-extrabold text-primary">{availableEventsCount}</span>
            <span className="text-[11px] text-sage font-medium flex items-center gap-0.5">Explore &rarr;</span>
          </div>
          <p className="text-xs text-secondary mt-1">Open for student registration</p>
        </div>

        <div
          onClick={() => navigate('/student/registrations')}
          className="bg-white rounded-2xl border border-line p-5 shadow-subtle hover:border-sage/40 hover:shadow-card transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">My Registrations</span>
            <div className="p-2.5 rounded-xl bg-warm-soft text-warm-hover transition group-hover:scale-110">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-display font-extrabold text-primary">{myConfirmedCount}</span>
            <span className="text-[11px] text-warm-hover font-medium flex items-center gap-0.5">View passes &rarr;</span>
          </div>
          <p className="text-xs text-secondary mt-1">Confirmed student bookings</p>
        </div>

        <div
          onClick={() => navigate('/explore')}
          className="bg-white rounded-2xl border border-line p-5 shadow-subtle hover:border-sage/40 hover:shadow-card transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Upcoming Events</span>
            <div className="p-2.5 rounded-xl bg-info-bg text-info transition group-hover:scale-110">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-display font-extrabold text-primary">{upcomingEventsCount}</span>
            <span className="text-[11px] text-info font-medium flex items-center gap-0.5">Calendar &rarr;</span>
          </div>
          <p className="text-xs text-secondary mt-1">Scheduled on campus</p>
        </div>

        <div
          onClick={() => navigate('/explore')}
          className="bg-white rounded-2xl border border-line p-5 shadow-subtle hover:border-sage/40 hover:shadow-card transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Completed Events</span>
            <div className="p-2.5 rounded-xl bg-success-bg text-success transition group-hover:scale-110">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-display font-extrabold text-primary">{completedEventsCount}</span>
            <span className="text-[11px] text-secondary font-medium">Archived</span>
          </div>
          <p className="text-xs text-secondary mt-1">Concluded this academic year</p>
        </div>
      </div>

      {/* 3. Featured Campus Event Banner */}
      <div className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 h-56 sm:h-72 rounded-2xl overflow-hidden bg-page border border-line">
          <img
            src={featuredEvent.imageUrl}
            alt={featuredEvent.eventName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-warm-soft text-warm-hover px-2.5 py-0.5 rounded-full border border-warm/20">
              Featured Experience
            </span>
            <CategoryBadge category={featuredEvent.category} />
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-primary leading-tight">
            {featuredEvent.eventName}
          </h3>
          <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
            {featuredEvent.description}
          </p>
          <div className="space-y-1 pt-2 text-xs text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-warm shrink-0" />
              <span>{featuredEvent.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
              <span className="truncate">{featuredEvent.venue}</span>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to={`/explore?register=${featuredEvent.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
            >
              <span>Instant Seat Reservation</span>
              <ArrowRight className="w-3.5 h-3.5 text-warm" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Two Column Roster: My Upcoming Bookings & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Upcoming Registrations (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-line">
            <div>
              <h3 className="text-lg font-display font-bold text-primary">My Upcoming Registrations</h3>
              <p className="text-xs text-secondary">Your active tickets and registration credentials</p>
            </div>
            <Link
              to="/student/registrations"
              className="text-xs font-semibold text-sage hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-line p-8 text-center space-y-3">
              <Ticket className="w-10 h-10 mx-auto text-secondary/30" />
              <h4 className="text-sm font-bold text-primary">No event bookings yet</h4>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Explore campus workshops, hackathons, and sports events to secure your pass.
              </p>
              <Link
                to="/explore"
                className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sage"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myRegistrations.slice(0, 3).map((reg) => (
                <div
                  key={reg.id}
                  className="bg-white rounded-2xl border border-line p-4 shadow-subtle hover:border-sage/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={reg.registrationStatus} />
                      <span className="text-[11px] font-mono text-secondary">ID: EE-{reg.id}</span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-primary">
                      {reg.eventName}
                    </h4>
                    <p className="text-xs text-secondary">
                      {reg.venue || 'Main Campus'} • Registered on {new Date(reg.registrationDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to="/student/registrations"
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-semibold text-sage bg-sage-bg hover:bg-sage hover:text-white border border-sage/20 transition"
                  >
                    View Ticket &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming College Events Cards */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-display font-bold text-primary">Upcoming College Events</h3>
              <Link to="/explore" className="text-xs font-semibold text-sage hover:underline">Explore full calendar</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upcomingList.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/explore?register=${evt.id}`)}
                  className="bg-white rounded-2xl border border-line p-4 shadow-subtle hover:border-sage/40 hover:shadow-card transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
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

                  <div className="mt-3 pt-2 border-t border-line text-[11px] font-semibold text-sage">
                    Reserve Spot &rarr;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Popular Categories & Quick Profile (1 col) */}
        <div className="space-y-6">
          {/* Quick Profile Snapshot */}
          <div className="bg-white rounded-2xl border border-line p-5 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sage-bg border border-sage/20 text-sage flex items-center justify-center font-bold text-lg uppercase">
                {(user?.fullName || user?.name || 'S').charAt(0)}
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-primary truncate">{user?.fullName || user?.name}</h4>
                <p className="text-xs text-secondary truncate">{user?.email}</p>
                <span className="text-[10px] font-mono text-sage font-semibold">Roll: {user?.studentId}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
              <Link to="/student/profile" className="text-sage font-semibold hover:underline">
                Edit Profile &rarr;
              </Link>
              <span className="text-secondary">Student Member</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div className="bg-white rounded-2xl border border-line p-5 shadow-subtle space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Popular Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              {popularCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/explore?category=${cat}`)}
                  className="p-3 rounded-xl bg-page hover:bg-sage-bg border border-line hover:border-sage/30 text-left transition group"
                >
                  <p className="text-xs font-bold text-primary group-hover:text-sage">{cat}</p>
                  <span className="text-[10px] text-secondary">Explore events &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
