import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ticket, ValidationResult } from '../types';

/**
 * Validate a ticket by its ID
 * Checks if ticket exists, belongs to the event, and hasn't been used
 */
export const validateTicket = async (
  ticketId: string,
  eventId?: string
): Promise<ValidationResult> => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    // Check if ticket exists
    if (!ticketDoc.exists()) {
      return {
        valid: false,
        message: 'Invalid ticket. Ticket ID not found.',
        alreadyUsed: false
      };
    }

    const ticket = ticketDoc.data() as Ticket;

    // Check if ticket belongs to the specified event (if eventId provided)
    if (eventId && ticket.eventId !== eventId) {
      return {
        valid: false,
        ticket,
        message: 'This ticket is not valid for this event.',
        alreadyUsed: false
      };
    }

    // Check if ticket has already been validated
    if (ticket.validated) {
      return {
        valid: false,
        ticket,
        message: 'Warning: This ticket has already been used.',
        alreadyUsed: true
      };
    }

    // Mark ticket as validated
    await updateDoc(ticketRef, {
      validated: true,
      validatedAt: serverTimestamp()
    });

    // Return updated ticket data
    const updatedTicket: Ticket = {
      ...ticket,
      validated: true,
      validatedAt: Timestamp.now()
    };

    return {
      valid: true,
      ticket: updatedTicket,
      message: 'Valid ticket. Entry granted.',
      alreadyUsed: false
    };
  } catch (error) {
    console.error('Error validating ticket:', error);
    return {
      valid: false,
      message: 'Validation failed. Please try again.',
      alreadyUsed: false
    };
  }
};

/**
 * Check ticket status without marking it as validated
 * Useful for preview/checking before actual validation
 */
export const checkTicketStatus = async (
  ticketId: string
): Promise<ValidationResult> => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      return {
        valid: false,
        message: 'Ticket not found.',
        alreadyUsed: false
      };
    }

    const ticket = ticketDoc.data() as Ticket;

    if (ticket.validated) {
      return {
        valid: false,
        ticket,
        message: 'This ticket has already been used.',
        alreadyUsed: true
      };
    }

    return {
      valid: true,
      ticket,
      message: 'Ticket is valid and ready to use.',
      alreadyUsed: false
    };
  } catch (error) {
    console.error('Error checking ticket status:', error);
    return {
      valid: false,
      message: 'Failed to check ticket status.',
      alreadyUsed: false
    };
  }
};

/**
 * Extract ticket ID from QR code data
 * In our case, QR code data is the ticket ID itself
 */
export const extractTicketIdFromQR = (qrData: string): string => {
  return qrData.trim();
};
