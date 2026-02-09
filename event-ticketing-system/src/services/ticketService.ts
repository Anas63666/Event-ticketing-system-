import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  increment,
  serverTimestamp,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ticket, Event } from '../types';

// Maximum tickets a user can book per event
const MAX_TICKETS_PER_USER = 2;

/**
 * Book a ticket for an event
 * Uses Firestore transaction to ensure atomic operations
 */
export const bookTicket = async (
  eventId: string,
  userId: string,
  userName: string,
  userEmail: string
): Promise<{ success: boolean; ticket?: Ticket; error?: string }> => {
  try {
    // Check if user has reached booking limit for this event
    const userTicketsForEvent = await getUserTicketsForEvent(userId, eventId);
    if (userTicketsForEvent >= MAX_TICKETS_PER_USER) {
      return {
        success: false,
        error: `You've reached the maximum booking limit of ${MAX_TICKETS_PER_USER} tickets for this event.`
      };
    }

    // Run transaction to book ticket
    const result = await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists()) {
        throw new Error('EVENT_NOT_FOUND');
      }

      const event = eventDoc.data() as Event;

      // Check if tickets are available
      if (event.availableTickets <= 0) {
        throw new Error('SOLD_OUT');
      }

      // Check if event date has passed
      const eventDate = event.date.toDate();
      const now = new Date();
      if (now > eventDate) {
        throw new Error('EVENT_PASSED');
      }

      // Create ticket
      const ticketRef = doc(collection(db, 'tickets'));
      const ticketData: Ticket = {
        id: ticketRef.id,
        eventId,
        userId,
        eventName: event.name,
        eventDate: event.date,
        attendeeName: userName,
        attendeeEmail: userEmail,
        bookingDate: serverTimestamp() as Timestamp,
        validated: false,
        validatedAt: null,
        qrCodeData: ticketRef.id // QR code contains the ticket ID
      };

      transaction.set(ticketRef, ticketData);

      // Decrement available tickets
      transaction.update(eventRef, {
        availableTickets: increment(-1)
      });

      return {
        ...ticketData,
        bookingDate: Timestamp.now()
      };
    });

    return { success: true, ticket: result };
  } catch (error: any) {
    console.error('Error booking ticket:', error);

    let errorMessage = 'Booking failed. Please try again.';

    if (error.message === 'EVENT_NOT_FOUND') {
      errorMessage = 'Event not found.';
    } else if (error.message === 'SOLD_OUT') {
      errorMessage = 'Sorry, this event is sold out.';
    } else if (error.message === 'EVENT_PASSED') {
      errorMessage = 'Booking closed. Event date has passed.';
    }

    return { success: false, error: errorMessage };
  }
};

/**
 * Get all tickets for a specific user
 */
export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef,
      where('userId', '==', userId),
      orderBy('bookingDate', 'desc')
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const tickets: Ticket[] = [];
    querySnapshot.forEach((doc) => {
      tickets.push(doc.data() as Ticket);
    });

    return tickets;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw new Error('Failed to load your tickets.');
  }
};

/**
 * Get count of tickets a user has booked for a specific event
 */
export const getUserTicketsForEvent = async (
  userId: string,
  eventId: string
): Promise<number> => {
  try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef,
      where('userId', '==', userId),
      where('eventId', '==', eventId)
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting user tickets for event:', error);
    return 0;
  }
};

/**
 * Get all tickets for a specific event (for organizers)
 */
export const getEventTickets = async (eventId: string): Promise<Ticket[]> => {
  try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef,
      where('eventId', '==', eventId),
      orderBy('bookingDate', 'asc')
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const tickets: Ticket[] = [];
    querySnapshot.forEach((doc) => {
      tickets.push(doc.data() as Ticket);
    });

    return tickets;
  } catch (error) {
    console.error('Error fetching event tickets:', error);
    throw new Error('Failed to load attendees.');
  }
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (ticketDoc.exists()) {
      return ticketDoc.data() as Ticket;
    }

    return null;
  } catch (error) {
    console.error('Error fetching ticket:', error);
    throw new Error('Failed to load ticket.');
  }
};
