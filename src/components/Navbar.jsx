import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Ticket size={28} />
          <span>EventHub</span>
        </Link>
        
        <div className="nav-links">
          {currentUser ? (
            <>
              <Link to="/" className="nav-link">Events</Link>
              {userRole === 'attendee' && (
                <Link to="/my-tickets" className="nav-link">
                  <Ticket size={18} />
                  My Tickets
                </Link>
              )}
              {userRole === 'organizer' && (
                <Link to="/organizer" className="nav-link">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
              )}
              <div className="nav-user">
                <User size={18} />
                <span>{currentUser.email}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
