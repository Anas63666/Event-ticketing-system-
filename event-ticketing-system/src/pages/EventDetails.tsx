import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { getEventById } from '../services/eventService';
import { bookTicket } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatCurrency, getTimeUntilEvent } from '../utils/helpers';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const fetchedEvent = await getEventById(eventId!);
      if (fetchedEvent) {
        setEvent(fetchedEvent);
      } else {
        setError('Event not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!event) return;

    try {
      setBookingInProgress(true);
      setError('');
      setSuccessMessage('');

      const result = await bookTicket(
        event.id,
        currentUser.uid,
        currentUser.name,
        currentUser.email
      );

      if (result.success) {
        setSuccessMessage('Ticket booked successfully! Redirecting to your tickets...');
        setTimeout(() => {
          navigate('/my-tickets');
        }, 2000);
      } else {
        setError(result.error || 'Booking failed');
      }
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isSoldOut = event.availableTickets <= 0;
  const isPast = new Date() > event.date.toDate();
  const canBook = !isSoldOut && !isPast && currentUser;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          ← Back to Events
        </button>

        {/* Event Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-96 bg-gradient-to-r from-indigo-500 to-purple-600">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-9xl">🎉</span>
              </div>
            )}
            
            {/* Status Badge */}
            {isSoldOut && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                Sold Out
              </div>
            )}
            {isPast && !isSoldOut && (
              <div className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                Past Event
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {event.name}
            </h1>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📅</span>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="text-lg font-semibold">{formatDate(event.date)}</p>
                    <p className="text-sm text-indigo-600">{getTimeUntilEvent(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">🕐</span>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="text-lg font-semibold">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🎫</span>
                  <div>
                    <p className="text-sm text-gray-600">Available Tickets</p>
                    <p className="text-lg font-semibold">
                      {isSoldOut ? (
                        <span className="text-red-600">Sold Out</span>
                      ) : (
                        <span className="text-indigo-600">{event.availableTickets} remaining</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {event.ticketPrice === 0 ? 'Free' : formatCurrency(event.ticketPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Booking Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!currentUser ? (
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Login to Book Ticket
                </button>
              ) : isSoldOut ? (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-md text-lg font-semibold cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : isPast ? (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-md text-lg font-semibold cursor-not-allowed"
                >
                  Event Has Passed
                </button>
              ) : (
                <button
                  onClick={handleBookTicket}
                  disabled={bookingInProgress}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingInProgress ? 'Booking...' : 'Book Ticket Now'}
                </button>
              )}
            </div>

            {!currentUser && (
              <p className="mt-4 text-sm text-gray-600 text-center">
                You need to be logged in to book tickets
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
