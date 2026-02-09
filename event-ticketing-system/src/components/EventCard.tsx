import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { formatDate, formatCurrency } from '../utils/helpers';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const isSoldOut = event.availableTickets <= 0;
  const isPast = new Date() > event.date.toDate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
    >
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🎉</span>
          </div>
        )}
        
        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Sold Out
          </div>
        )}
        
        {/* Past Event Badge */}
        {isPast && !isSoldOut && (
          <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Past Event
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {event.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">🕐</span>
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              {isSoldOut ? (
                <span className="text-red-600 font-semibold">No tickets available</span>
              ) : (
                <>
                  <span className="font-semibold text-indigo-600">
                    {event.availableTickets}
                  </span>
                  <span className="text-gray-600"> tickets left</span>
                </>
              )}
            </p>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-indigo-600">
              {event.ticketPrice === 0 ? 'Free' : formatCurrency(event.ticketPrice)}
            </p>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
