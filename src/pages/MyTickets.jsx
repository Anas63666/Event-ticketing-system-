import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TicketQR from '../components/TicketQR';
import { events as initialEvents } from '../data/events';
import { Ticket as TicketIcon } from 'lucide-react';

const MyTickets = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const userTickets = storedTickets.filter(t => t.userId === currentUser.uid);
    setTickets(userTickets);

    const storedEvents = localStorage.getItem('events');
    setEvents(storedEvents ? JSON.parse(storedEvents) : initialEvents);
  }, [currentUser]);

  if (tickets.length === 0) {
    return (
      <div className="my-tickets-page">
        <div className="empty-state">
          <TicketIcon size={64} />
          <h2>No Tickets Yet</h2>
          <p>You haven't booked any tickets. Browse events and book your first ticket!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tickets-page">
      <h1>My Tickets</h1>
      <p className="subtitle">Total Tickets: {tickets.length}</p>
      
      <div className="tickets-grid">
        {tickets.map(ticket => {
          const event = events.find(e => e.id === ticket.eventId);
          return event ? (
            <TicketQR key={ticket.id} ticket={ticket} event={event} />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default MyTickets;
