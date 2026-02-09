import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket } from '../types';
import { formatDate } from '../utils/helpers';

interface TicketQRProps {
  ticket: Ticket;
}

const TicketQR: React.FC<TicketQRProps> = ({ ticket }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">{ticket.eventName}</h3>
        <p className="text-indigo-100">{formatDate(ticket.eventDate)}</p>
      </div>

      {/* QR Code Section */}
      <div className="p-8 flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg shadow-inner mb-6">
          <QRCodeSVG
            value={ticket.qrCodeData}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Ticket Details */}
        <div className="w-full space-y-3 text-center">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">Ticket ID</p>
            <p className="text-lg font-mono font-semibold text-gray-900">
              {ticket.id}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Attendee</p>
            <p className="text-lg font-semibold text-gray-900">
              {ticket.attendeeName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-md text-gray-700">{ticket.attendeeEmail}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Booked On</p>
            <p className="text-md text-gray-700">
              {formatDate(ticket.bookingDate)}
            </p>
          </div>

          {ticket.validated && (
            <div className="mt-4 bg-green-50 border border-green-400 text-green-700 px-4 py-2 rounded">
              ✓ Ticket Validated
            </div>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
        <p>Present this QR code at the event entrance</p>
      </div>
    </div>
  );
};

export default TicketQR;
