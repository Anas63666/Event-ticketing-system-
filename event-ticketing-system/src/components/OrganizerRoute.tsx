import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface OrganizerRouteProps {
  children: React.ReactNode;
}

/**
 * OrganizerRoute component that restricts access to organizer users only
 * Redirects to login if not authenticated
 * Redirects to home if authenticated but not an organizer
 */
const OrganizerRoute: React.FC<OrganizerRouteProps> = ({ children }) => {
  const { currentUser, isOrganizer, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not an organizer
  if (!isOrganizer) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and is organizer
  return <>{children}</>;
};

export default OrganizerRoute;
