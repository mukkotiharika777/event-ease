import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ConsumerLayout } from './components/layout/ConsumerLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ConsumerLogin } from './pages/ConsumerLogin';
import { ConsumerRegister } from './pages/ConsumerRegister';
import { ConsumerDashboard } from './pages/ConsumerDashboard';
import { MyRegistrations } from './pages/MyRegistrations';
import { ConsumerProfile } from './pages/ConsumerProfile';
import { Dashboard } from './pages/Dashboard';
import { EventManagement } from './pages/EventManagement';
import { EventForm } from './pages/EventForm';
import { EventDetails } from './pages/EventDetails';
import { Participants } from './pages/Participants';
import { PublicEvents } from './pages/PublicEvents';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { authService } from './services/authService';

// Admin Route Guard
const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'ADMIN') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return children;
};

// Consumer / Student Route Guard
const ConsumerRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* 1. Public Discovery Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<PublicEvents />} />
      <Route path="/discover" element={<Navigate to="/explore" replace />} />

      {/* 2. Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/student/login" element={<ConsumerLogin />} />
      <Route path="/student/register" element={<ConsumerRegister />} />
      <Route path="/register" element={<ConsumerRegister />} />

      {/* 3. Consumer / Student Protected Module */}
      <Route
        path="/student"
        element={
          <ConsumerRoute>
            <ConsumerLayout />
          </ConsumerRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<ConsumerDashboard />} />
        <Route path="registrations" element={<MyRegistrations />} />
        <Route path="profile" element={<ConsumerProfile />} />
      </Route>

      {/* Shortcut redirect */}
      <Route path="/student-portal" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/my-registrations" element={<Navigate to="/student/registrations" replace />} />

      {/* 4. Admin Protected Suite */}
      <Route
        path="/"
        element={
          <AdminRoute>
            <AppLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="events/new" element={<EventForm />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="events/:id/edit" element={<EventForm />} />
        <Route path="participants" element={<Participants />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 5. Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
