import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Code2,
  Cpu,
  Palette,
  Trophy,
  BookOpen,
  Music,
  CheckCircle2,
  Search
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { eventService } from '../services/eventService';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';

const CATEGORY_ITEMS = [
  { name: 'Technology', label: 'Technical & Coding', icon: Code2, count: '12 Events', color: 'bg-sage-bg text-sage border-sage/20' },
  { name: 'Workshops', label: 'Hands-on Labs', icon: Cpu, count: '8 Workshops', color: 'bg-warm-soft text-secondary border-warm/30' },
  { name: 'Cultural', label: 'Music & Arts', icon: Palette, count: '15 Events', color: 'bg-[#F2EDF7] text-[#6B4F8A] border-[#E3D9ED]' },
  { name: 'Sports', label: 'Varsity Athletics', icon: Trophy, count: '6 Tournaments', color: 'bg-[#EBF5ED] text-[#2F683D] border-[#D0EADB]' },
  { name: 'Seminars', label: 'Research Talks', icon: BookOpen, count: '10 Keynotes', color: 'bg-info-bg text-info border-info/30' },
  { name: 'Festivals', label: 'Annual Campus Fests', icon: Music, count: '4 Major Fests', color: 'bg-[#FDF0EC] text-[#B8583B] border-[#F8D9CE]' }
];

export const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/explore');
    }
  };

  const featuredEvent = events[0] || {
    id: 1,
    eventName: "ApexHack 2026: 36-Hour National Hackathon",
    description: "Annual flagship hackathon bringing together top engineering minds to build AI, Web3, and Sustainable Tech solutions with industry mentorship and INR 1.5 Lakhs in cash prizes.",
    category: "Technical",
    eventDate: "2026-12-10",
    startTime: "09:00",
    venue: "APJ Abdul Kalam Innovation Hub, Main Campus",
    organizer: "Department of Computer Science & ACM Student Chapter",
    maxParticipants: 120,
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
  };

  const upcomingList = events.slice(1, 5);

  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <PublicNavbar />

      <main className="flex-1">
        {/* ===================== 1. HERO SECTION ===================== */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-line bg-gradient-to-b from-white to-page">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & Actions */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-bg border border-sage/20 text-sage text-xs font-semibold shadow-subtle">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Official University Event Discovery Portal</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-primary tracking-tight leading-[1.12]">
                  Discover Events. <br />
                  <span className="text-sage">Create Experiences.</span>
                </h1>

                <p className="text-base sm:text-lg text-secondary max-w-xl font-normal leading-relaxed">
                  Find exciting college events, connect with your community and make every experience count.
                </p>

                {/* Search Bar in Hero */}
                <form onSubmit={handleSearchSubmit} className="pt-2 max-w-md">
                  <div className="relative flex items-center bg-white rounded-2xl border border-line shadow-card p-1.5 focus-within:border-sage transition">
                    <Search className="w-5 h-5 ml-3 text-secondary shrink-0" />
                    <input
                      type="text"
                      placeholder="Search hackathons, seminars, fests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-none text-primary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm shrink-0"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Action Buttons & Value Proof */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark transition shadow-card"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-4 h-4 text-warm" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary bg-white hover:bg-warm-soft/40 border border-line transition shadow-subtle"
                  >
                    <span>Create Account</span>
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="pt-6 border-t border-line flex items-center gap-6 text-xs text-secondary">
                  <div>
                    <strong className="text-base font-bold text-primary block">100%</strong>
                    <span>Verified Campus Events</span>
                  </div>
                  <div className="w-px h-8 bg-line" />
                  <div>
                    <strong className="text-base font-bold text-primary block">5,000+</strong>
                    <span>Student Registrations</span>
                  </div>
                  <div className="w-px h-8 bg-line" />
                  <div>
                    <strong className="text-base font-bold text-primary block">Instant</strong>
                    <span>Seat Confirmation</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Decorative Card */}
                  <div className="rounded-3xl bg-white p-3.5 border border-line shadow-card overflow-hidden">
                    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-page">
                      <img
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"
                        alt="Campus Innovation Summit"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-sage shadow-sm">
                          Flagship Gathering
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-xs text-secondary mb-1">
                        <span className="flex items-center gap-1 font-medium text-sage">
                          <Sparkles className="w-3.5 h-3.5" /> University Innovation
                        </span>
                        <span>Dec 2026</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-primary">
                        Campus Annual Hack & Design Conclave
                      </h3>
                      <p className="text-xs text-secondary mt-1 line-clamp-2">
                        Engage with faculty mentors, tech founders, and student builders across all collegiate chapters.
                      </p>
                    </div>
                  </div>

                  {/* Floating Micro Badge */}
                  <div className="absolute -bottom-5 -left-4 bg-white p-3.5 rounded-2xl border border-line shadow-elevated flex items-center gap-3 animate-in fade-in">
                    <div className="w-10 h-10 rounded-xl bg-warm-soft text-warm-hover flex items-center justify-center font-bold">
                      <Users className="w-5 h-5 text-warm" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">Active Enrollments</p>
                      <p className="text-[11px] text-secondary">Registrations open for all students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 2. FEATURED EVENT ===================== */}
        <section className="py-16 sm:py-20 border-b border-line bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sage">Editor's Pick</span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-primary mt-1">
                  Featured Campus Event
                </h2>
              </div>
              <Link
                to="/explore"
                className="text-xs sm:text-sm font-semibold text-sage hover:text-sage-dark flex items-center gap-1 transition"
              >
                View all scheduled events &rarr;
              </Link>
            </div>

            {/* Featured Event Card */}
            <div className="rounded-3xl bg-page border border-line p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-subtle hover:border-sage/30 transition">
              <div className="lg:col-span-7 h-64 sm:h-80 rounded-2xl overflow-hidden bg-white shadow-sm border border-line">
                <img
                  src={featuredEvent.imageUrl}
                  alt={featuredEvent.eventName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={featuredEvent.category} />
                  <StatusBadge status={featuredEvent.status || 'Upcoming'} />
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-primary leading-tight">
                  {featuredEvent.eventName}
                </h3>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-line text-xs text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-warm shrink-0" />
                    <span>{featuredEvent.eventDate} ({featuredEvent.startTime || '10:00 AM'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sage shrink-0" />
                    <span className="truncate">{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary shrink-0" />
                    <span>Capacity: <strong className="text-primary">{featuredEvent.maxParticipants} students</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to={`/explore?register=${featuredEvent.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-warm" />
                  </Link>
                  <Link
                    to="/explore"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-white border border-line transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== 3. BROWSE BY CATEGORY ===================== */}
        <section id="categories" className="py-16 sm:py-20 border-b border-line bg-page">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-sage">Campus Categories</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-primary mt-1">
                Explore by Domain & Specialization
              </h2>
              <p className="text-xs sm:text-sm text-secondary mt-1.5">
                From competitive engineering hackathons to arts and varsity athletics, find events tailored to your interests.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORY_ITEMS.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate(`/explore?category=${cat.name}`)}
                    className="p-5 rounded-2xl bg-white border border-line hover:border-sage/40 hover:shadow-card transition cursor-pointer text-center group flex flex-col items-center justify-between"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border ${cat.color} group-hover:scale-110 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-primary group-hover:text-sage transition">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-secondary mt-0.5">{cat.label}</p>
                    </div>
                    <span className="mt-3 text-[10px] font-semibold text-sage bg-sage-bg px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== 4. UPCOMING EVENTS ===================== */}
        <section className="py-16 sm:py-20 border-b border-line bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sage">Semester Calendar</span>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-primary mt-1">
                  Upcoming Campus Experiences
                </h2>
              </div>
              <Link
                to="/explore"
                className="text-xs sm:text-sm font-semibold text-sage hover:text-sage-dark transition"
              >
                Browse all events &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingList.map((event) => (
                <div
                  key={event.id}
                  className="bg-page rounded-2xl border border-line overflow-hidden hover:border-sage/40 hover:shadow-card transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-white">
                      <img
                        src={event.imageUrl}
                        alt={event.eventName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <CategoryBadge category={event.category} />
                      </div>
                      <div className="absolute bottom-2 right-2.5">
                        <span className="text-[10px] font-bold bg-white/90 backdrop-blur-sm text-primary px-2.5 py-0.5 rounded-md border border-line">
                          {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-display font-bold text-sm text-primary group-hover:text-sage transition line-clamp-1">
                        {event.eventName}
                      </h4>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-1 pt-2 border-t border-line text-[11px] text-secondary">
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-warm shrink-0" />
                          <span>{event.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-sage shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/explore?register=${event.id}`}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-center text-primary hover:text-white bg-white hover:bg-sage border border-line hover:border-sage transition shadow-subtle flex items-center justify-center gap-1"
                    >
                      <span>View & Register</span>
                      <ArrowRight className="w-3 h-3 text-warm" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== 5. ABOUT & VALUE PROP ===================== */}
        <section id="about" className="py-16 sm:py-20 bg-page">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-line p-8 sm:p-12 shadow-subtle grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sage">About EventEase</span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-primary leading-tight">
                  Built to Empower Academic Communities
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  EventEase bridges student passion with administrative efficiency. Whether you are leading a national symposium, managing sports rosters, or hosting a hackathon, EventEase delivers real-time registration verification, automated capacity tracking, and comprehensive participation analytics.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                    <span>Real-time seat reservations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                    <span>Verified institutional IDs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                    <span>Cross-department analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                    <span>Zero duplicate registrations</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-sage-bg/60 border border-sage/20 space-y-4">
                <h4 className="text-sm font-bold text-primary">Are you a Faculty Coordinator or Club Lead?</h4>
                <p className="text-xs text-secondary leading-relaxed">
                  Sign in with your university credentials to create new events, monitor participant attendance, and generate evaluation reports.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sage hover:bg-sage-dark transition shadow-sm"
                  >
                    Admin Sign In
                  </Link>
                  <Link
                    to="/explore"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-secondary hover:text-primary bg-white border border-line transition"
                  >
                    Explore Public Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};
