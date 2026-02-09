import { Timestamp } from 'firebase/firestore';

/**
 * Format Firestore Timestamp to readable date string
 */
export const formatDate = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format Firestore Timestamp to readable date and time string
 */
export const formatDateTime = (timestamp: Timestamp): string => {
  const date = timestamp.toDate();
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (timestamp: Timestamp): boolean => {
  const date = timestamp.toDate();
  const now = new Date();
  return now > date;
};

/**
 * Generate a unique ID (fallback if Firestore doesn't generate one)
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format currency (for ticket prices)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength (minimum 6 characters)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Calculate time remaining until event
 */
export const getTimeUntilEvent = (timestamp: Timestamp): string => {
  const eventDate = timestamp.toDate();
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();

  if (diff < 0) return 'Event has passed';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  return 'Starting soon';
};
