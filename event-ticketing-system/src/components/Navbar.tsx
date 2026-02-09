import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, isOrganizer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🎫</span>
            <span className="text-xl font-semibold">EventTicket</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-indigo-200 transition-colors duration-200"
            >
              Events
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/my-tickets"
                  className="hover:text-indigo-200 transition-colors duration-200"
                >
                  My Tickets
                </Link>

                {isOrganizer && (
                  <Link
                    to="/organizer/dashboard"
                    className="hover:text-indigo-200 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-indigo-200">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-indigo-200 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
