import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import OrganizerRoute from './components/OrganizerRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AttendeeList from './pages/AttendeeList';
import TicketValidation from './pages/TicketValidation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/events/:eventId" element={<EventDetails />} />

            {/* Protected Routes (Attendee) */}
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            {/* Organizer Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <OrganizerRoute>
                  <OrganizerDashboard />
                </OrganizerRoute>
              }
            />
            <Route
              path="/organizer/events/:eventId/attendees"
              element={
                <OrganizerRoute>
                  <AttendeeList />
                </OrganizerRoute>
              }
            />
            <Route
              path="/organizer/validate"
              element={
                <OrganizerRoute>
                  <TicketValidation />
                </OrganizerRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
