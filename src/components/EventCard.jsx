import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const EventCard = ({ event }) => {
  const isExpired = new Date(event.date) < new Date();
  const isSoldOut = event.availableTickets === 0;

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <span className="event-category">{event.category}</span>
        {isSoldOut && <span className="sold-out-badge">SOLD OUT</span>}
        {isExpired && <span className="expired-badge">EXPIRED</span>}
      </div>
      
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="event-detail">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="event-detail">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail">
            <Users size={16} />
            <span>{event.availableTickets} / {event.totalTickets} available</span>
          </div>
        </div>
        
        <Link to={`/event/${event.id}`} className="btn-view-details">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
