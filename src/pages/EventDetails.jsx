import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { events as initialEvents } from '../data/events';
import { Calendar, MapPin, Clock, Users, Ticket, AlertCircle } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    const eventsData = storedEvents ? JSON.parse(storedEvents) : initialEvents;
    const foundEvent = eventsData.find(e => e.id === parseInt(id));
    setEvent(foundEvent);
  }, [id]);

  const bookTicket = () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please login to book tickets' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (userRole !== 'attendee') {
      setMessage({ type: 'error', text: 'Only attendees can book tickets' });
      return;
    }

    const isExpired = new Date(event.date) < new Date();
    if (isExpired) {
      setMessage({ type: 'error', text: 'This event has expired' });
      return;
    }

    if (event.availableTickets < ticketCount) {
      setMessage({ type: 'error', text: 'Not enough tickets available' });
      return;
    }

    // Check existing bookings
    const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const userTicketsForEvent = existingTickets.filter(
      t => t.userId === currentUser.uid && t.eventId === event.id
    );

    if (userTicketsForEvent.length + ticketCount > 2) {
      setMessage({ type: 'error', text: 'Maximum 2 tickets per user allowed' });
      return;
    }

    // Create tickets
    const newTickets = [];
    for (let i = 0; i < ticketCount; i++) {
      const ticket = {
        id: Date.now() + i,
        ticketId: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
        eventId: event.id,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        bookedAt: new Date().toISOString(),
        status: 'valid'
      };
      newTickets.push(ticket);
    }

    // Update tickets
    const allTickets = [...existingTickets, ...newTickets];
    localStorage.setItem('tickets', JSON.stringify(allTickets));

    // Update event availability
    const storedEvents = JSON.parse(localStorage.getItem('events') || JSON.stringify(initialEvents));
    const updatedEvents = storedEvents.map(e => 
      e.id === event.id 
        ? { ...e, availableTickets: e.availableTickets - ticketCount }
        : e
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvent({ ...event, availableTickets: event.availableTickets - ticketCount });

    setMessage({ type: 'success', text: `Successfully booked ${ticketCount} ticket(s)!` });
    setTimeout(() => navigate('/my-tickets'), 2000);
  };

  if (!event) {
    return <div className="loading">Loading event details...</div>;
  }

  const isExpired = new Date(event.date) < new Date();
  const isSoldOut = event.availableTickets === 0;

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        <div className="event-image-large">
          <img src={event.image} alt={event.title} />
          {isSoldOut && <div className="overlay-badge sold-out">SOLD OUT</div>}
          {isExpired && <div className="overlay-badge expired">EXPIRED</div>}
        </div>

        <div className="event-info-section">
          <span className="category-badge">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="event-description-full">{event.description}</p>

          <div className="event-meta">
            <div className="meta-item">
              <Calendar size={24} />
              <div>
                <strong>Date</strong>
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            <div className="meta-item">
              <Clock size={24} />
              <div>
                <strong>Time</strong>
                <span>{event.time}</span>
              </div>
            </div>

            <div className="meta-item">
              <MapPin size={24} />
              <div>
                <strong>Location</strong>
                <span>{event.location}</span>
              </div>
            </div>

            <div className="meta-item">
              <Users size={24} />
              <div>
                <strong>Availability</strong>
                <span>{event.availableTickets} / {event.totalTickets} tickets</span>
              </div>
            </div>

            <div className="meta-item">
              <Ticket size={24} />
              <div>
                <strong>Organizer</strong>
                <span>{event.organizer}</span>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              <AlertCircle size={18} />
              {message.text}
            </div>
          )}

          {!isExpired && !isSoldOut && userRole === 'attendee' && (
            <div className="booking-section">
              <div className="ticket-selector">
                <label>Number of Tickets:</label>
                <select 
                  value={ticketCount} 
                  onChange={(e) => setTicketCount(parseInt(e.target.value))}
                >
                  <option value={1}>1 Ticket</option>
                  <option value={2}>2 Tickets</option>
                </select>
              </div>
              <button onClick={bookTicket} className="btn-book-ticket">
                <Ticket size={20} />
                Book {ticketCount} Ticket{ticketCount > 1 ? 's' : ''}
              </button>
            </div>
          )}

          {!currentUser && (
            <div className="login-prompt">
              <AlertCircle size={18} />
              Please login to book tickets
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
