/**
 * Get user-friendly error message for Firebase Auth errors
 */
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Email already registered. Please login.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.'
  };

  return errorMessages[errorCode] || 'Authentication failed. Please try again.';
};

/**
 * Get user-friendly error message for booking errors
 */
export const getBookingErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'AUTH_REQUIRED': 'Please login to book tickets.',
    'BOOKING_LIMIT_REACHED': "You've reached the maximum booking limit for this event.",
    'SOLD_OUT': 'Sorry, this event is sold out.',
    'EVENT_PASSED': 'Booking closed. Event date has passed.',
    'EVENT_NOT_FOUND': 'Event not found.',
    'INSUFFICIENT_TICKETS': 'Not enough tickets available.'
  };

  return errorMessages[errorCode] || 'Booking failed. Please try again.';
};

/**
 * Get user-friendly error message for validation errors
 */
export const getValidationErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'TICKET_NOT_FOUND': 'Invalid ticket. Ticket ID not found.',
    'WRONG_EVENT': 'This ticket is not valid for this event.',
    'ALREADY_VALIDATED': 'Warning: This ticket has already been used.',
    'QR_SCAN_ERROR': 'Failed to scan QR code. Please try again or enter manually.'
  };

  return errorMessages[errorCode] || 'Validation failed. Please try again.';
};
