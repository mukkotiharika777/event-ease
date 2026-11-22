import api from './api';
import { INITIAL_REGISTRATIONS } from './initialData';
import { eventService } from './eventService';
import { authService } from './authService';

const STORAGE_KEY = 'eventease_registrations_data';

const getStoredRegistrations = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
    return INITIAL_REGISTRATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_REGISTRATIONS;
  }
};

const saveStoredRegistrations = (regs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regs));
};

export const registrationService = {
  // Fetch all registrations (Admin view)
  getAllRegistrations: async (params = {}) => {
    try {
      const response = await api.get('/registrations', { params });
      return response.data;
    } catch (err) {
      console.warn('Backend offline, reading registrations dataset:', err.message);
      let regs = getStoredRegistrations();
      if (params.eventId && params.eventId !== 'All') {
        regs = regs.filter(r => String(r.eventId) === String(params.eventId));
      }
      if (params.status && params.status !== 'All') {
        regs = regs.filter(r => r.registrationStatus.toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        regs = regs.filter(r =>
          r.studentName.toLowerCase().includes(query) ||
          r.studentId.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.eventName.toLowerCase().includes(query)
        );
      }
      return regs;
    }
  },

  // Get consumer's personal registrations
  getMyRegistrations: async (filter = 'All') => {
    const user = authService.getCurrentUser();
    if (!user) return [];

    try {
      const response = await api.get(`/registrations/user/${user.id}`, { params: { filter } });
      return response.data;
    } catch (err) {
      const regs = getStoredRegistrations();
      // Match by userId, studentId or email
      let userRegs = regs.filter(r =>
        (r.userId && String(r.userId) === String(user.id)) ||
        (user.email && r.email?.toLowerCase() === user.email.toLowerCase()) ||
        (user.studentId && r.studentId === user.studentId)
      );

      if (filter && filter !== 'All') {
        userRegs = userRegs.filter(r => r.registrationStatus.toLowerCase() === filter.toLowerCase());
      }
      return userRegs;
    }
  },

  // Get registrations for a specific event
  getRegistrationsByEvent: async (eventId) => {
    try {
      const response = await api.get(`/registrations/event/${eventId}`);
      return response.data;
    } catch (err) {
      const regs = getStoredRegistrations();
      return regs.filter(r => String(r.eventId) === String(eventId));
    }
  },

  // Register a student/consumer for an event
  registerStudent: async (registrationData) => {
    const user = authService.getCurrentUser();
    const payload = {
      ...registrationData,
      userId: user?.id || null
    };

    try {
      const response = await api.post('/registrations', payload);
      return response.data;
    } catch (err) {
      const regs = getStoredRegistrations();
      const event = await eventService.getEventById(registrationData.eventId);

      if (!event) throw new Error('Target event does not exist.');
      if (event.status === 'Completed' || event.status === 'Cancelled') {
        throw new Error(`Cannot register for an event that is ${event.status.toLowerCase()}.`);
      }

      // Check duplicate registration
      const alreadyRegistered = regs.some(
        r => String(r.eventId) === String(registrationData.eventId) &&
             (r.email.toLowerCase() === registrationData.email.toLowerCase() ||
              r.studentId.toLowerCase() === registrationData.studentId.toLowerCase()) &&
             r.registrationStatus !== 'Cancelled'
      );
      if (alreadyRegistered) {
        throw new Error('You have already reserved a seat for this event with your Student ID or Email.');
      }

      // Check event capacity
      const confirmedCount = regs.filter(
        r => String(r.eventId) === String(registrationData.eventId) && r.registrationStatus === 'Confirmed'
      ).length;

      if (confirmedCount >= event.maxParticipants) {
        throw new Error('Sorry, this event has already reached maximum participant capacity.');
      }

      const newRegistration = {
        id: Date.now(),
        eventId: event.id,
        userId: user?.id || null,
        eventName: event.eventName,
        eventDate: event.eventDate,
        venue: event.venue,
        imageUrl: event.imageUrl,
        studentName: registrationData.studentName || user?.fullName || user?.name,
        studentId: registrationData.studentId || user?.studentId,
        email: registrationData.email || user?.email,
        phone: registrationData.phone || user?.phone || '+91 98765 43210',
        registrationDate: new Date().toISOString(),
        registrationStatus: 'Confirmed'
      };

      regs.unshift(newRegistration);
      saveStoredRegistrations(regs);
      return newRegistration;
    }
  },

  // Consumer cancelling their own registration
  cancelMyRegistration: async (registrationId) => {
    try {
      const response = await api.delete(`/registrations/my/${registrationId}`);
      return response.data;
    } catch (err) {
      const regs = getStoredRegistrations();
      const index = regs.findIndex(r => String(r.id) === String(registrationId));
      if (index === -1) throw new Error('Registration record not found.');

      regs[index].registrationStatus = 'Cancelled';
      saveStoredRegistrations(regs);
      return regs[index];
    }
  },

  // Update registration status (Admin)
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/registrations/${id}`, { registrationStatus: status });
      return response.data;
    } catch (err) {
      const regs = getStoredRegistrations();
      const index = regs.findIndex(r => String(r.id) === String(id));
      if (index === -1) throw new Error('Registration not found');
      regs[index].registrationStatus = status;
      saveStoredRegistrations(regs);
      return regs[index];
    }
  },

  // Cancel registration (Admin)
  cancelRegistration: async (id) => {
    try {
      await api.delete(`/registrations/${id}`);
      return true;
    } catch (err) {
      const regs = getStoredRegistrations();
      const index = regs.findIndex(r => String(r.id) === String(id));
      if (index === -1) throw new Error('Registration not found');
      regs[index].registrationStatus = 'Cancelled';
      saveStoredRegistrations(regs);
      return true;
    }
  }
};
