import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateTicket } from '../services/validationService';
import { ValidationResult } from '../types';
import { formatDate } from '../utils/helpers';

const TicketValidation: React.FC = () => {
  const navigate = useNavigate();
  const [ticketId, setTicketId] = useState('');
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketId.trim()) {
      return;
    }

    try {
      setValidating(true);
      setResult(null);
      const validationResult = await validateTicket(ticketId.trim());
      setResult(validationResult);
    } catch (error) {
      console.error('Validation error:', error);
      setResult({
        valid: false,
        message: 'Validation failed. Please try again.',
        alreadyUsed: false
      });
    } finally {
      setValidating(false);
    }
  };

  const handleReset = () => {
    setTicketId('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/organizer/dashboard')}
          className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">🎫</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ticket Validation
          </h1>
          <p className="text-gray-600">
            Scan or enter ticket ID to validate entry
          </p>
        </div>

        {/* Validation Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleValidate} className="space-y-6">
            <div>
              <label
                htmlFor="ticketId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ticket ID
              </label>
              <input
                id="ticketId"
                type="text"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                placeholder="Enter or scan ticket ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-mono"
                disabled={validating}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={validating || !ticketId.trim()}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validating ? 'Validating...' : 'Validate Ticket'}
              </button>
              
              {result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Validation Result */}
        {result && (
          <div
            className={`rounded-lg shadow-lg p-8 ${
              result.valid
                ? 'bg-green-50 border-2 border-green-500'
                : result.alreadyUsed
                ? 'bg-yellow-50 border-2 border-yellow-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">
                {result.valid ? '✅' : result.alreadyUsed ? '⚠️' : '❌'}
              </span>
              <h2
                className={`text-3xl font-bold mb-2 ${
                  result.valid
                    ? 'text-green-900'
                    : result.alreadyUsed
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}
              >
                {result.valid
                  ? 'Valid Ticket'
                  : result.alreadyUsed
                  ? 'Already Used'
                  : 'Invalid Ticket'}
              </h2>
              <p
                className={`text-lg ${
                  result.valid
                    ? 'text-green-700'
                    : result.alreadyUsed
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}
              >
                {result.message}
              </p>
            </div>

            {/* Ticket Details */}
            {result.ticket && (
              <div className="bg-white rounded-lg p-6 space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Ticket Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Event</p>
                    <p className="font-semibold text-gray-900">
                      {result.ticket.eventName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Event Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(result.ticket.eventDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Attendee</p>
                    <p className="font-semibold text-gray-900">
                      {result.ticket.attendeeName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {result.ticket.attendeeEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Ticket ID</p>
                    <p className="font-mono text-sm text-gray-900">
                      {result.ticket.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Booked On</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(result.ticket.bookingDate)}
                    </p>
                  </div>
                </div>

                {result.ticket.validated && result.ticket.validatedAt && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Validated At</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(result.ticket.validatedAt)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!result && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to Validate
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Enter the ticket ID manually or scan the QR code</li>
              <li>• Click "Validate Ticket" to check the ticket</li>
              <li>• Green = Valid ticket, allow entry</li>
              <li>• Yellow = Already used, check with attendee</li>
              <li>• Red = Invalid ticket, deny entry</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketValidation;
