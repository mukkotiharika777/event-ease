import api from './api';

const USERS_STORAGE_KEY = 'eventease_registered_users_v2';

// Seeded distinct user accounts so every persona has a different login
const DEFAULT_ACCOUNTS = [
  {
    id: 1,
    fullName: 'Prof. Ramesh Chandra',
    name: 'Prof. Ramesh Chandra',
    email: 'admin@eventease.edu',
    studentId: null,
    phone: '+91 98765 00001',
    password: 'Admin@123',
    role: 'ADMIN',
    department: 'Dean of Student Affairs',
    token: 'jwt-token-admin-1'
  },
  {
    id: 2,
    fullName: 'Aarav Sharma',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    studentId: '2023CSB1042',
    phone: '+91 98765 43210',
    password: 'Student@123',
    role: 'CONSUMER',
    department: 'Computer Science & Engineering',
    token: 'jwt-token-consumer-2'
  },
  {
    id: 3,
    fullName: 'Sneha Patel',
    name: 'Sneha Patel',
    email: 'sneha.patel@college.edu',
    studentId: '2023IT1088',
    phone: '+91 98123 45678',
    password: 'Student@123',
    role: 'CONSUMER',
    department: 'Information Technology',
    token: 'jwt-token-consumer-3'
  },
  {
    id: 4,
    fullName: 'Rohan Verma',
    name: 'Rohan Verma',
    email: 'rohan.v@college.edu',
    studentId: '2022EC1031',
    phone: '+91 97654 32109',
    password: 'Student@123',
    role: 'CONSUMER',
    department: 'Electronics & Communication',
    token: 'jwt-token-consumer-4'
  },
  {
    id: 5,
    fullName: 'Student Scholar',
    name: 'Student Scholar',
    email: 'student@eventease.edu',
    studentId: '2024CSB1100',
    phone: '+91 98765 11111',
    password: 'Student@123',
    role: 'CONSUMER',
    department: 'Computer Science & Engineering',
    token: 'jwt-token-consumer-5'
  }
];

const getStoredUsers = () => {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  // Get all registered accounts
  getAllUsers: () => {
    return getStoredUsers();
  },

  // Consumer / Student Registration
  registerConsumer: async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanStudentId = userData.studentId?.trim().toUpperCase();

    try {
      const response = await api.post('/auth/register', {
        ...userData,
        email: cleanEmail,
        studentId: cleanStudentId
      });
      return response.data;
    } catch (err) {
      console.warn('Backend server offline, saving new user to database:', err.message);
      const users = getStoredUsers();

      // Check duplicate email
      const emailExists = users.some(u => u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        throw new Error(`An account with the email "${cleanEmail}" already exists. Please sign in instead.`);
      }

      // Check duplicate Student ID
      if (cleanStudentId) {
        const idExists = users.some(u => u.studentId && u.studentId.toUpperCase() === cleanStudentId);
        if (idExists) {
          throw new Error(`An account with the Student ID "${cleanStudentId}" already exists. Please verify your ID.`);
        }
      }

      const newUser = {
        id: Date.now(),
        fullName: userData.fullName.trim(),
        name: userData.fullName.trim(),
        studentId: cleanStudentId,
        email: cleanEmail,
        phone: userData.phone?.trim() || '+91 98765 43210',
        password: userData.password,
        role: 'CONSUMER',
        department: userData.department || 'Undergraduate Engineering',
        token: `jwt-token-consumer-${Date.now()}`
      };

      users.push(newUser);
      saveStoredUsers(users);
      return newUser;
    }
  },

  // Universal Login (handles both ADMIN and CONSUMER seamlessly)
  login: async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Please enter your institutional email address.');
    }
    if (!cleanPassword) {
      throw new Error('Please enter your account password.');
    }

    try {
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password: cleanPassword
      });
      const { token, user } = response.data;
      localStorage.setItem('eventease_token', token);
      localStorage.setItem('eventease_user', JSON.stringify(user));
      return user;
    } catch (err) {
      console.warn('Backend server offline, querying local accounts database:', err.message);
      const users = getStoredUsers();
      
      const match = users.find(u => 
        u.email.toLowerCase() === cleanEmail && 
        u.password === cleanPassword
      );

      if (!match) {
        // Helpful error hint if email exists but password was wrong
        const userExists = users.some(u => u.email.toLowerCase() === cleanEmail);
        if (userExists) {
          throw new Error('Incorrect password. Please verify and try again.');
        } else {
          throw new Error(`No account registered with email "${cleanEmail}". Please check your spelling or sign up.`);
        }
      }

      const userSession = {
        id: match.id,
        fullName: match.fullName || match.name,
        name: match.fullName || match.name,
        email: match.email,
        studentId: match.studentId,
        phone: match.phone,
        role: match.role,
        department: match.department,
        token: match.token || `token-${Date.now()}`
      };

      localStorage.setItem('eventease_token', userSession.token);
      localStorage.setItem('eventease_user', JSON.stringify(userSession));
      return userSession;
    }
  },

  // Update Profile
  updateProfile: async (userId, updateData) => {
    try {
      const response = await api.put(`/users/${userId}`, updateData);
      const updated = response.data;
      localStorage.setItem('eventease_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      const users = getStoredUsers();
      const index = users.findIndex(u => String(u.id) === String(userId));
      if (index === -1) throw new Error('User record not found.');

      users[index].fullName = updateData.fullName || users[index].fullName;
      users[index].name = updateData.fullName || users[index].name;
      users[index].phone = updateData.phone || users[index].phone;

      saveStoredUsers(users);

      const currentUser = JSON.parse(localStorage.getItem('eventease_user') || '{}');
      const updatedSession = { ...currentUser, ...users[index] };
      delete updatedSession.password;
      localStorage.setItem('eventease_user', JSON.stringify(updatedSession));
      return updatedSession;
    }
  },

  // Change Password
  changePassword: async (userId, { currentPassword, newPassword }) => {
    try {
      await api.put(`/users/${userId}/password`, { currentPassword, newPassword });
      return true;
    } catch (err) {
      const users = getStoredUsers();
      const user = users.find(u => String(u.id) === String(userId));
      if (!user) throw new Error('User record not found.');
      if (user.password !== currentPassword.trim()) {
        throw new Error('Current password does not match our records.');
      }
      user.password = newPassword.trim();
      saveStoredUsers(users);
      return true;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('eventease_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('eventease_token');
    localStorage.removeItem('eventease_user');
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem('eventease_token'));
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },

  isConsumer: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'CONSUMER';
  }
};
