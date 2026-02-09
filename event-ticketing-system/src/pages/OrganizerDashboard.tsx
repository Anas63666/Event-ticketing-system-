import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, TicketStats } from '../types';
import { getEventsByOrganizer } from '../services/eventService';
import { getEventTickets } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/helpers';

const OrganizerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketStats, setTicketStats] = useState<Map<string, TicketStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchOrganizerData();
    }
  }, [currentUser]);

  const fetchOrganizerData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const fetchedEvents = await getEventsByOrganizer(currentUser.uid);
      setEvents(fetchedEvents);

      // Fetch ticket stats for each event
      const statsMap = new Map<string, TicketStats>();
      for (const event of fetchedEvents) {
        const tickets = await getEventTickets(event.id);
        const totalBooked = event.totalTickets - event.availableTickets;
        const revenue = totalBooked * event.ticketPrice;
        
        statsMap.set(event.id, {
          totalBooked,
          totalAvailable: event.availableTickets,
          revenue
        });
      }
      setTicketStats(statsMap);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchOrganizerData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Organizer Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your events and track ticket sales
          </p>
        </div>

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📊</span>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't created any events yet
            </p>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const stats = ticketStats.get(event.id);
              const isSoldOut = event.availableTickets <= 0;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/organizer/events/${event.id}/attendees`)}
                >
                  {/* Event Image */}
                  <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-purple-600">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-5xl">🎉</span>
                      </div>
                    )}
                    {isSoldOut && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {event.name}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p>📅 {formatDate(event.date)}</p>
                      <p>📍 {event.location}</p>
                    </div>

                    {/* Stats */}
                    {stats && (
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tickets Sold</span>
                          <span className="font-semibold text-indigo-600">
                            {stats.totalBooked} / {event.totalTickets}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="font-semibold text-gray-900">
                            {stats.totalAvailable}
                          </span>
                        </div>

                        {event.ticketPrice > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Revenue</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(stats.revenue)}
                            </span>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(stats.totalBooked / event.totalTickets) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organizer/events/${event.id}/attendees`);
                      }}
                      className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      View Attendees
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
