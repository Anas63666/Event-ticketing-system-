import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event } from '../types';

/**
 * Get all events from Firestore, ordered by date
 */
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    
    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to load events. Please try again.');
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() } as Event;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to load event details.');
  }
};

/**
 * Get all events for a specific organizer
 */
export const getEventsByOrganizer = async (organizerId: string): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('organizerId', '==', organizerId),
      orderBy('date', 'asc')
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    
    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    
    return events;
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    throw new Error('Failed to load your events.');
  }
};

/**
 * Update an event (for organizers)
 */
export const updateEvent = async (
  eventId: string,
  updates: Partial<Omit<Event, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, updates);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event.');
  }
};

/**
 * Search events by name, description, or tags
 */
export const searchEvents = (events: Event[], searchQuery: string): Event[] => {
  if (!searchQuery.trim()) {
    return events;
  }
  
  const query = searchQuery.toLowerCase();
  
  return events.filter((event) => {
    const nameMatch = event.name.toLowerCase().includes(query);
    const descriptionMatch = event.description.toLowerCase().includes(query);
    const tagsMatch = event.tags.some((tag) => tag.toLowerCase().includes(query));
    
    return nameMatch || descriptionMatch || tagsMatch;
  });
};

/**
 * Check if an event date has passed
 */
export const isEventPassed = (event: Event): boolean => {
  const eventDate = event.date.toDate();
  const now = new Date();
  return now > eventDate;
};

/**
 * Check if an event is sold out
 */
export const isEventSoldOut = (event: Event): boolean => {
  return event.availableTickets <= 0;
};
