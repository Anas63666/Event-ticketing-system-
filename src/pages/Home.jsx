import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { events as initialEvents } from '../data/events';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(events.map(e => e.category))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Discover Amazing Events</h1>
        <p>Book tickets for conferences, concerts, workshops and more</p>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="no-events">
            <p>No events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
