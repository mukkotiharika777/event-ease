import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { CATEGORIES, EVENT_STATUSES } from '../services/initialData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const PRESET_IMAGES = [
  { label: 'Technical Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI/ML Workshop', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cultural Fest', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Academic Seminar', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80' }
];

export const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    category: 'Technical',
    eventDate: '',
    startTime: '10:00',
    endTime: '16:00',
    venue: '',
    organizer: '',
    maxParticipants: 100,
    registrationFee: 0,
    status: 'Upcoming',
    imageUrl: PRESET_IMAGES[0].url
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id);
      setFormData(data);
    } catch (err) {
      setError('Failed to load event details: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.eventName.trim()) {
      setError('Event Title is required.');
      return;
    }
    if (!formData.eventDate) {
      setError('Event Date is required.');
      return;
    }
    if (!formData.venue.trim()) {
      setError('Campus Venue is required.');
      return;
    }
    if (!formData.organizer.trim()) {
      setError('Host Department is required.');
      return;
    }
    if (formData.maxParticipants <= 0) {
      setError('Maximum capacity must be at least 1 participant.');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setError('End time must be later than start time.');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await eventService.updateEvent(id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      navigate('/events');
    } catch (err) {
      setError(err.message || 'Error saving event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving event details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <button
          type="button"
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Management</span>
        </button>
        <span className="text-xs text-secondary">
          {isEditing ? `Modifying Event #${id}` : 'Drafting New Campus Event'}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-line shadow-card p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-display font-bold text-primary">
            {isEditing ? 'Modify Event Schedule & Information' : 'Publish New Collegiate Event'}
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Fill in the schedule, department organizer, and seat limits.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-danger-bg border border-danger/30 text-xs text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-sage uppercase tracking-wider">1. Event Overview</h3>
            
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Event Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. ApexHack 2026: 36-Hour National Hackathon"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Description & Agenda <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed syllabus, rules, mentor panels, or tournament rules..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Event Status <span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:outline-none"
                >
                  {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Location */}
          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="text-xs font-bold text-sage uppercase tracking-wider">2. Schedule & Venue</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Date of Event <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Start Time <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  End Time <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Campus Venue / Hall <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. APJ Abdul Kalam Innovation Hub"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Host Department / Organizer <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g. Dept of Computer Science & ACM"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Capacity & Fees */}
          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="text-xs font-bold text-sage uppercase tracking-wider">3. Capacity & Attendance</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Maximum Capacity (Seats) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Registration Fee (INR ₹)
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  min="0"
                  value={formData.registrationFee}
                  onChange={handleChange}
                  placeholder="0 for Free"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Banner Image */}
          <div className="space-y-3 pt-4 border-t border-line">
            <h3 className="text-xs font-bold text-sage uppercase tracking-wider">4. Banner Photography</h3>
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-page border border-line focus:border-sage focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-secondary mb-2">Or select from curated campus presets:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: preset.url }))}
                    className={`px-3 py-1 text-xs rounded-xl border transition ${
                      formData.imageUrl === preset.url
                        ? 'bg-sage text-white border-sage'
                        : 'bg-page text-secondary hover:text-primary border-line'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-line">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-5 py-2 text-xs font-semibold text-secondary hover:text-primary bg-page hover:bg-line rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-sage hover:bg-sage-dark active:bg-sage-dark rounded-xl transition shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-warm" />
              <span>{submitting ? 'Saving Event...' : isEditing ? 'Update Event Record' : 'Publish to Calendar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
