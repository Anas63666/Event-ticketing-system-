// Type definitions for the Event Ticketing System
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer';
  createdAt: Timestamp;
  bookingCount: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: Timestamp;
  time: string;
  location: string;
  imageUrl: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
  organizerId: string;
  createdAt: Timestamp;
  tags: string[];
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  eventName: string;
  eventDate: Timestamp;
  attendeeName: string;
  attendeeEmail: string;
  bookingDate: Timestamp;
  validated: boolean;
  validatedAt: Timestamp | null;
  qrCodeData: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isOrganizer: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ValidationResult {
  valid: boolean;
  ticket?: Ticket;
  message: string;
  alreadyUsed: boolean;
}

export interface TicketStats {
  totalBooked: number;
  totalAvailable: number;
  revenue: number;
}

export interface Attendee {
  name: string;
  email: string;
  ticketId: string;
  bookingDate: Date;
  validated: boolean;
}
