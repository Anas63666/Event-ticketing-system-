import { useState, useEffect } from 'react';
import { events as initialEvents } from '../data/events';
import { Users, Ticket, CheckCircle, XCircle, Search, Plus, Calendar, MapPin, DollarSign, Image as ImageIcon, Edit2, Trash2 } from 'lucide-react';

const Organizer = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Technology',
    price: 0,
    totalTickets: 100,
    image: '',
    organizer: ''
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    let loadedEvents = storedEvents ? JSON.parse(storedEvents) : initialEvents;
    
    // Auto-delete expired events (events where date has passed)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeEvents = loadedEvents.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });
    
    // If events were deleted, update localStorage
    if (activeEvents.length !== loadedEvents.length) {
      localStorage.setItem('events', JSON.stringify(activeEvents));
      loadedEvents = activeEvents;
    }
    
    setEvents(loadedEvents);
    
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    
    // Convert 24-hour time to 12-hour format with AM/PM
    const convertTime = (time24) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(e => 
        e.id === editingEvent.id 
          ? {
              ...e,
              ...formData,
              time: convertTime(formData.time),
              price: Number(formData.price),
              totalTickets: Number(formData.totalTickets),
              // Keep availableTickets relative to change in totalTickets
              availableTickets: e.availableTickets + (Number(formData.totalTickets) - e.totalTickets)
            }
          : e
      );
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      alert('Event updated successfully!');
      setEditingEvent(null);
    } else {
      // Create new event
      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        ...formData,
        time: convertTime(formData.time),
        price: Number(formData.price),
        totalTickets: Number(formData.totalTickets),
        availableTickets: Number(formData.totalTickets)
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      alert('Event created successfully!');
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Technology',
      price: 0,
      totalTickets: 100,
      image: '',
      organizer: ''
    });
    setShowCreateForm(false);
  };

  const handleEditEvent = (event) => {
    // Convert 12-hour time back to 24-hour for input
    const convertTo24Hour = (time12) => {
      const [time, period] = time12.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: convertTo24Hour(event.time),
      location: event.location,
      category: event.category,
      price: event.price,
      totalTickets: event.totalTickets,
      image: event.image || '',
      organizer: event.organizer
    });
    setShowCreateForm(true);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Also delete associated tickets
    const updatedTickets = tickets.filter(t => t.eventId !== eventId);
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }

    alert('Event deleted successfully!');
  };

  const handleCancelEdit = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Technology',
      price: 0,
      totalTickets: 100,
      image: '',
      organizer: ''
    });
  };

  const filteredTickets = selectedEvent 
    ? getEventTickets(selectedEvent.id).filter(t => 
        t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="organizer-page">
      <div className="organizer-header">
        <h1>Organizer Dashboard</h1>
        <button 
          className="btn-create-event" 
          onClick={() => {
            if (showCreateForm && !editingEvent) {
              setShowCreateForm(false);
            } else if (showCreateForm && editingEvent) {
              handleCancelEdit();
            } else {
              setShowCreateForm(true);
              setEditingEvent(null);
            }
          }}
        >
          <Plus size={20} />
          {showCreateForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-event-form">
          <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <form onSubmit={handleCreateEvent}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Conference 2026"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="organizer">Organizer Name *</label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Events Inc."
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">
                  <Calendar size={16} /> Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="location">
                  <MapPin size={16} /> Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Convention Center, New York"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Art">Art</option>
                  <option value="Food">Food</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  <DollarSign size={16} /> Price (0 for free)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalTickets">
                  <Ticket size={16} /> Total Tickets *
                </label>
                <input
                  type="number"
                  id="totalTickets"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="image">
                  <ImageIcon size={16} /> Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
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
              >
                <div onClick={() => setSelectedEvent(event)}>
                  <h4>{event.title}</h4>
                  <div className="event-stats">
                    <span><Ticket size={14} /> {eventTickets.length} total</span>
                    <span><CheckCircle size={14} /> {validTickets} valid</span>
                    <span><XCircle size={14} /> {usedTickets} used</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button 
                    className="btn-icon btn-edit" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditEvent(event);
                    }}
                    title="Edit Event"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-delete" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
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
