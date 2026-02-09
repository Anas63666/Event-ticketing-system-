import { useState, useEffect } from 'react';
import { events as initialEvents } from '../data/events';
import { Users, Ticket, CheckCircle, XCircle, Search } from 'lucide-react';

const Organizer = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    setEvents(storedEvents ? JSON.parse(storedEvents) : initialEvents);
    
    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setTickets(storedTickets);
  }, []);

  const getEventTickets = (eventId) => {
    return tickets.filter(t => t.eventId === eventId);
  };

  const validateTicket = () => {
    if (!scanInput.trim()) return;

    const ticket = tickets.find(t => t.ticketId === scanInput.trim().toUpperCase());
    
    if (!ticket) {
      setScanResult({ success: false, message: 'Invalid ticket ID' });
      return;
    }

    if (selectedEvent && ticket.eventId !== selectedEvent.id) {
      setScanResult({ success: false, message: 'Ticket not for this event' });
      return;
    }

    if (ticket.status === 'used') {
      setScanResult({ success: false, message: 'Ticket already used' });
      return;
    }

    // Mark ticket as used
    const updatedTickets = tickets.map(t => 
      t.ticketId === ticket.ticketId ? { ...t, status: 'used' } : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    setScanResult({ 
      success: true, 
      message: 'Ticket validated successfully',
      ticket 
    });
    setScanInput('');
  };

  const filteredTickets = selectedEvent 
    ? getEventTickets(selectedEvent.id).filter(t => 
        t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="organizer-page">
      <h1>Organizer Dashboard</h1>
      
      <div className="organizer-container">
        <div className="events-sidebar">
          <h2>Your Events</h2>
          {events.map(event => {
            const eventTickets = getEventTickets(event.id);
            const validTickets = eventTickets.filter(t => t.status === 'valid').length;
            const usedTickets = eventTickets.filter(t => t.status === 'used').length;
            
            return (
              <div 
                key={event.id} 
                className={`event-item ${selectedEvent?.id === event.id ? 'active' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <h4>{event.title}</h4>
                <div className="event-stats">
                  <span><Ticket size={14} /> {eventTickets.length} total</span>
                  <span><CheckCircle size={14} /> {validTickets} valid</span>
                  <span><XCircle size={14} /> {usedTickets} used</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="organizer-main">
          {selectedEvent ? (
            <>
              <div className="event-header">
                <h2>{selectedEvent.title}</h2>
                <div className="event-stats-large">
                  <div className="stat-card">
                    <Users size={32} />
                    <div>
                      <h3>{getEventTickets(selectedEvent.id).length}</h3>
                      <p>Total Attendees</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <CheckCircle size={32} />
                    <div>
                      <h3>{getEventTickets(selectedEvent.id).filter(t => t.status === 'valid').length}</h3>
                      <p>Valid Tickets</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <XCircle size={32} />
                    <div>
                      <h3>{getEventTickets(selectedEvent.id).filter(t => t.status === 'used').length}</h3>
                      <p>Used Tickets</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-validator">
                <h3>Validate Ticket</h3>
                <div className="validator-input">
                  <input
                    type="text"
                    placeholder="Enter Ticket ID or scan QR code"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && validateTicket()}
                  />
                  <button onClick={validateTicket} className="btn-validate">
                    Validate
                  </button>
                </div>
                
                {scanResult && (
                  <div className={`scan-result ${scanResult.success ? 'success' : 'error'}`}>
                    {scanResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    <span>{scanResult.message}</span>
                    {scanResult.ticket && (
                      <div className="ticket-details-small">
                        <p>Email: {scanResult.ticket.userEmail}</p>
                        <p>Booked: {new Date(scanResult.ticket.bookedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="attendees-section">
                <div className="section-header">
                  <h3>Attendee List</h3>
                  <div className="search-box-small">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search by ticket ID or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="attendees-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Email</th>
                        <th>Booked At</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                          <tr key={ticket.id}>
                            <td><code>{ticket.ticketId}</code></td>
                            <td>{ticket.userEmail}</td>
                            <td>{new Date(ticket.bookedAt).toLocaleString()}</td>
                            <td>
                              <span className={`status-badge ${ticket.status}`}>
                                {ticket.status === 'valid' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {ticket.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="no-data">No attendees found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Users size={64} />
              <h2>Select an Event</h2>
              <p>Choose an event from the sidebar to view attendees and validate tickets</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organizer;
