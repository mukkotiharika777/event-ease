import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { CATEGORIES, EVENT_STATUSES } from '../services/initialData';
import { StatusBadge, CategoryBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const EventManagement = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-asc');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, selectedStatus]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents({
        category: selectedCategory,
        status: selectedStatus,
        search: searchTerm
      });
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await eventService.deleteEvent(deleteTarget.id);
      setActionFeedback({
        type: 'success',
        message: `Event "${deleteTarget.eventName}" was successfully deleted.`
      });
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: `Failed to delete event: ${err.message}`
      });
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date-asc') return new Date(a.eventDate) - new Date(b.eventDate);
    if (sortBy === 'date-desc') return new Date(b.eventDate) - new Date(a.eventDate);
    if (sortBy === 'name-asc') return a.eventName.localeCompare(b.eventName);
    if (sortBy === 'capacity-desc') return b.maxParticipants - a.maxParticipants;
    return 0;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & New Event Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">Event Management</h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            Create, schedule, edit, and maintain college symposiums and workshops.
          </p>
        </div>
        <button
          onClick={() => navigate('/events/new')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-sage hover:bg-sage-dark transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-warm" />
          <span>Create New Event</span>
        </button>
      </div>

      {actionFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            actionFeedback.type === 'success'
              ? 'bg-success-bg border-success/30 text-success'
              : 'bg-danger-bg border-danger/30 text-danger'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{actionFeedback.message}</span>
          </div>
          <button onClick={() => setActionFeedback(null)} className="font-bold underline ml-4">Dismiss</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-card space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search by event title, venue or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-primary focus:border-sage focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-primary focus:border-sage focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-primary focus:border-sage focus:outline-none"
          >
            <option value="date-asc">Date (Earliest)</option>
            <option value="date-desc">Date (Latest)</option>
            <option value="name-asc">Title (A-Z)</option>
            <option value="capacity-desc">Capacity (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Events Table View */}
      {loading ? (
        <LoadingSpinner message="Fetching campus event records..." />
      ) : sortedEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Adjust your search criteria or create a brand new event."
          actionText="Create Event"
          onAction={() => navigate('/events/new')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-page/70 border-b border-line text-[11px] font-bold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Venue & Organizer</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                {sortedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-page/50 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.imageUrl}
                          alt={event.eventName}
                          className="w-11 h-11 rounded-xl object-cover bg-page shrink-0 border border-line"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="max-w-xs">
                          <p
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="font-display font-bold text-primary hover:text-sage cursor-pointer truncate"
                          >
                            {event.eventName}
                          </p>
                          <p className="text-[11px] text-secondary truncate mt-0.5">{event.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={event.category} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-primary">{event.eventDate}</div>
                      <div className="text-[11px] text-secondary flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-sage" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-primary truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sage shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <p className="text-[11px] text-secondary truncate mt-0.5">{event.organizer}</p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <Users className="w-3.5 h-3.5 text-secondary" />
                        <span>{event.maxParticipants} Seats</span>
                      </div>
                      <span className="text-[10px] text-secondary">
                        {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={event.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-page transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                          className="p-1.5 rounded-lg text-secondary hover:text-warm-hover hover:bg-page transition"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event)}
                          className="p-1.5 rounded-lg text-secondary hover:text-danger hover:bg-danger-bg transition"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        isOpen={Boolean(deleteTarget)}
        title="Delete Event Record"
        message={`Are you sure you want to delete "${deleteTarget?.eventName}"? All participant registrations associated with this event will be impacted.`}
        confirmText="Confirm Delete"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
