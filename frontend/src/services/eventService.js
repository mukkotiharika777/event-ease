import api from './api';
import { INITIAL_EVENTS } from './initialData';

const STORAGE_KEY = 'eventease_events_data';

const getStoredEvents = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_EVENTS;
  }
};

const saveStoredEvents = (events) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const eventService = {
  // Fetch all events with optional category/status filters and search
  getAllEvents: async (params = {}) => {
    try {
      const response = await api.get('/events', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using initial event records:', err.message);
      let events = getStoredEvents();
      if (params.category && params.category !== 'All') {
        events = events.filter(e => e.category === params.category);
      }
      if (params.status && params.status !== 'All') {
        events = events.filter(e => e.status.toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        events = events.filter(e => 
          e.eventName.toLowerCase().includes(query) ||
          e.venue.toLowerCase().includes(query) ||
          e.organizer.toLowerCase().includes(query)
        );
      }
      return events;
    }
  },

  // Get single event by id
  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (err) {
      console.warn(`Backend unavailable, reading event #${id} from local dataset:`, err.message);
      const events = getStoredEvents();
      const found = events.find(e => String(e.id) === String(id));
      if (!found) throw new Error('Event not found');
      return found;
    }
  },

  // Create new event
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, saving event locally:', err.message);
      const events = getStoredEvents();
      const newEvent = {
        ...eventData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      events.unshift(newEvent);
      saveStoredEvents(events);
      return newEvent;
    }
  },

  // Update event
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (err) {
      console.warn(`Backend unavailable, updating event #${id} locally:`, err.message);
      const events = getStoredEvents();
      const index = events.findIndex(e => String(e.id) === String(id));
      if (index === -1) throw new Error('Event not found');
      events[index] = { ...events[index], ...eventData };
      saveStoredEvents(events);
      return events[index];
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      await api.delete(`/events/${id}`);
      return true;
    } catch (err) {
      console.warn(`Backend unavailable, deleting event #${id} locally:`, err.message);
      let events = getStoredEvents();
      events = events.filter(e => String(e.id) !== String(id));
      saveStoredEvents(events);
      return true;
    }
  }
};
