import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CalendarCheck,
  Users,
  CheckCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Activity,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { eventService } from '../services/eventService';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CHART_COLORS = ['#52796F', '#84A59D', '#E6A17E', '#3B8D70', '#6489B8', '#D69A48'];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, analyticsData, recentData, allEvents] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getAnalytics(),
        dashboardService.getRecentActivity(),
        eventService.getAllEvents()
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setRecentRegistrations(recentData);
      setUpcomingEvents(allEvents.filter(e => e.status === 'Upcoming').slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Assembling executive campus metrics..." size="large" />;
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      subtext: 'Across all academic faculties',
      icon: Calendar,
      color: 'text-sage',
      bgColor: 'bg-sage-bg',
      action: () => navigate('/events')
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      subtext: 'Scheduled on campus calendar',
      icon: CalendarCheck,
      color: 'text-warm-hover',
      bgColor: 'bg-warm-soft',
      action: () => navigate('/events?status=Upcoming')
    },
    {
      title: 'Total Registrations',
      value: stats?.totalRegistrations || 0,
      subtext: 'Confirmed student attendees',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success-bg',
      action: () => navigate('/participants')
    },
    {
      title: 'Completed Events',
      value: stats?.completedEvents || 0,
      subtext: 'Archived semester programs',
      icon: CheckCircle,
      color: 'text-info',
      bgColor: 'bg-info-bg',
      action: () => navigate('/events?status=Completed')
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">
            Administrative Overview
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Real-time event lifecycle, attendee metrics, and departmental participation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/events/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-warm" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={card.action}
              className="bg-white rounded-2xl border border-line p-5 hover:border-sage/40 hover:shadow-card transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-display font-extrabold text-primary tracking-tight">{card.value}</span>
                <span className="text-[11px] text-secondary group-hover:text-sage flex items-center gap-0.5 transition font-medium">
                  View records <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Registration Trends (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-display font-bold text-primary">Registration Trajectory</h3>
              <p className="text-xs text-secondary">Monthly student enrollment volume across all departments</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success-bg px-2.5 py-1 rounded-lg border border-success/20">
              <TrendingUp className="w-3.5 h-3.5" /> +28% this semester
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.monthlyRegistrations || []} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="month" stroke="#777E89" fontSize={11} tickLine={false} />
                <YAxis stroke="#777E89" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', color: '#252B36', border: '1px solid #E9EAE6', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                  itemStyle={{ color: '#52796F', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#52796F"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#E6A17E', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#E6A17E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (1 column) */}
        <div className="bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-primary">Category Distribution</h3>
            <p className="text-xs text-secondary mb-4">Event spread across faculties</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.categoryDistribution || []}
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(analytics?.categoryDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '10px', color: '#252B36', border: '1px solid #E9EAE6', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-line">
            {(analytics?.categoryDistribution || []).slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                <span className="text-primary truncate">{item.name}</span>
                <span className="text-secondary font-semibold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Lower Section: Upcoming Events & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-display font-bold text-primary">Scheduled Upcoming Events</h3>
              <p className="text-xs text-secondary">Active campus seminars, hackathons, and symposiums</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-semibold text-sage hover:text-sage-dark transition flex items-center gap-1"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="group p-3.5 rounded-2xl border border-line hover:border-sage/40 hover:shadow-card transition cursor-pointer bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-page">
                    <img
                      src={event.imageUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <CategoryBadge category={event.category} />
                    </div>
                  </div>
                  <h4 className="font-display font-bold text-xs text-primary group-hover:text-sage transition line-clamp-1">
                    {event.eventName}
                  </h4>
                  <div className="mt-2 space-y-1 text-[11px] text-secondary">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3 h-3 text-warm shrink-0" />
                      <span>{event.eventDate} • {event.startTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-sage shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-line flex items-center justify-between text-[11px]">
                  <span className="text-secondary">Capacity: <strong className="text-primary">{event.maxParticipants}</strong></span>
                  <StatusBadge status={event.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Stream (1 col) */}
        <div className="bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
              <h3 className="text-sm font-display font-bold text-primary">Recent Registrations</h3>
              <span className="p-1 rounded-lg bg-sage-bg text-sage">
                <Activity className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="divide-y divide-line">
              {recentRegistrations.length === 0 ? (
                <p className="text-xs text-secondary py-6 text-center">No student registrations recorded yet.</p>
              ) : (
                recentRegistrations.map((reg) => (
                  <div key={reg.id} className="py-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-bold text-primary truncate">{reg.studentName}</p>
                      <StatusBadge status={reg.registrationStatus} />
                    </div>
                    <p className="text-[11px] text-sage font-medium truncate mt-0.5">{reg.eventName}</p>
                    <div className="flex items-center justify-between text-[10px] text-secondary mt-1">
                      <span>Roll: {reg.studentId}</span>
                      <span>{reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/participants')}
            className="w-full mt-4 py-2.5 text-center text-xs font-semibold text-sage hover:text-white bg-sage-bg hover:bg-sage rounded-xl transition border border-sage/20"
          >
            Manage Attendance Roster &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
