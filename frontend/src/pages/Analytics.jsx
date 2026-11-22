import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Download,
  Users,
  Award
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { eventService } from '../services/eventService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CHART_COLORS = ['#52796F', '#84A59D', '#E6A17E', '#3B8D70', '#6489B8', '#D69A48'];

export const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, statsData, allEvents] = await Promise.all([
        dashboardService.getAnalytics(),
        dashboardService.getStats(),
        eventService.getAllEvents()
      ]);
      setAnalytics(analyticsData);
      setStats(statsData);
      setEvents(allEvents);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ stats, analytics, events }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eventease_analytics_report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return <LoadingSpinner message="Calculating university metrics..." size="large" />;
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">Reports & Campus Analytics</h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Institutional turnout trends, capacity fill rate, and faculty distribution.
          </p>
        </div>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-sage bg-sage-bg hover:bg-sage hover:text-white border border-sage/20 transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* 3 Metric Highlighters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-line shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Attendance Rate</p>
            <p className="text-3xl font-display font-extrabold text-primary mt-1">94.2%</p>
            <p className="text-[11px] text-success mt-0.5">+4.8% vs last academic year</p>
          </div>
          <div className="p-3 rounded-xl bg-success-bg text-success border border-success/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Average Capacity Filled</p>
            <p className="text-3xl font-display font-extrabold text-sage mt-1">87%</p>
            <p className="text-[11px] text-secondary mt-0.5">Across active departments</p>
          </div>
          <div className="p-3 rounded-xl bg-sage-bg text-sage border border-sage/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-secondary uppercase tracking-wider">Most Active Domain</p>
            <p className="text-2xl font-display font-extrabold text-warm-hover mt-1">Technical / AI</p>
            <p className="text-[11px] text-secondary mt-0.5">42% of total campus turnout</p>
          </div>
          <div className="p-3 rounded-xl bg-warm-soft text-warm-hover border border-warm/20">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-line shadow-card">
          <h3 className="text-sm font-display font-bold text-primary mb-1">Monthly Registration Trajectory</h3>
          <p className="text-xs text-secondary mb-6">Track student engagement across the academic semester</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyRegistrations || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F1EC" vertical={false} />
                <XAxis dataKey="month" stroke="#777E89" fontSize={11} tickLine={false} />
                <YAxis stroke="#777E89" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', color: '#252B36', border: '1px solid #E9EAE6', fontSize: '12px' }}
                />
                <Bar dataKey="registrations" fill="#52796F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-line shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-primary mb-1">Event Category Distribution</h3>
            <p className="text-xs text-secondary mb-4">Proportion of events per university specialization</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.categoryDistribution || []}
                    innerRadius={55}
                    outerRadius={80}
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

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line">
            {(analytics?.categoryDistribution || []).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                <span className="truncate text-primary">{c.name}</span>
                <span className="text-secondary font-bold ml-auto">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
