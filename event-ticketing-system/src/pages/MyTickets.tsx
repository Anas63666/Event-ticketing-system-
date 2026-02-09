import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../types';
import { getUserTickets } from '../services/ticketService';
import { useAuth } from '../contexts/AuthContext';
import TicketQR from '../components/TicketQR';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTickets: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchTickets();
    }
  }, [currentUser]);

  const fetchTickets = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const fetchedTickets = await getUserTickets(currentUser.uid);
      setTickets(fetchedTickets);
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner message="Loading your tickets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchTickets}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">
            {tickets.length === 0
              ? 'You haven\'t booked any tickets yet'
              : `You have ${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Empty State */}
        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🎫</span>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Tickets Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring events and book your first ticket!
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        ) : (
          /* Tickets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketQR key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
