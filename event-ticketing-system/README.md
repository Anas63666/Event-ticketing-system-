# Event Management & Ticketing System

A modern event ticketing platform built with React, TypeScript, and Firebase.

## Features

- ✅ User authentication (attendees and organizers)
- ✅ Event browsing and booking
- ✅ QR code ticket generation
- ✅ Organizer dashboard
- ✅ Ticket validation
- ✅ Protected routes with role-based access control
- ✅ Transaction-based booking (prevents race conditions)
- ✅ Booking limits enforcement

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **QR Codes**: qrcode.react
- **Routing**: React Router v6
- **Testing**: Jest, React Testing Library, fast-check

## Project Status

### ✅ Completed Backend Services

All core backend logic and services are implemented:

1. **Authentication Service** (`src/services/authService.ts`)
   - User signup, login, logout
   - Firebase Auth integration
   - Error handling

2. **User Service** (`src/services/userService.ts`)
   - Create/read/update user profiles
   - Firestore integration
   - Booking count tracking

3. **Event Service** (`src/services/eventService.ts`)
   - Get all events
   - Get event by ID
   - Get events by organizer
   - Search and filter events
   - Update events

4. **Ticket Service** (`src/services/ticketService.ts`)
   - Book tickets (with Firestore transactions)
   - Get user tickets
   - Get event tickets (for organizers)
   - Booking limit enforcement
   - Sold-out prevention

5. **Validation Service** (`src/services/validationService.ts`)
   - Validate tickets
   - Check ticket status
   - Mark tickets as used
   - QR code data extraction

6. **Auth Context** (`src/contexts/AuthContext.tsx`)
   - Global authentication state
   - User role management
   - Auth state listener

7. **Protected Routes** (`src/components/`)
   - ProtectedRoute component
   - OrganizerRoute component
   - Role-based access control

8. **Utilities** (`src/utils/`)
   - Error message helpers
   - Date formatting
   - Validation helpers

### 🎨 Pending: UI Components

The following UI components need to be implemented:

- Login/Signup pages
- Event listing page
- Event details page
- My Tickets page
- Organizer dashboard
- Attendee list page
- Ticket validation page
- Navbar component
- EventCard component
- TicketQR component

## Setup Instructions

### 1. Install Dependencies

```bash
cd event-ticketing-system
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config
5. Create a `.env` file based on `.env.example`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
REACT_APP_FIREBASE_APP_ID=your_app_id_here
```

### 3. Firestore Security Rules

Add these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer';
    }
    
    match /tickets/{ticketId} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'organizer';
    }
  }
}
```

### 4. Firestore Indexes

Create these composite indexes in Firebase Console:

```json
{
  "indexes": [
    {
      "collectionGroup": "tickets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "bookingDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "tickets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "eventId", "order": "ASCENDING" },
        { "fieldPath": "bookingDate", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### 5. Start Development Server

```bash
npm start
```

### 6. Run Tests

```bash
npm test
```

### 7. Build for Production

```bash
npm run build
```

## Usage Examples

### Authentication

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { currentUser, login, signup, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (error) {
      console.error(error.message);
    }
  };
}
```

### Booking a Ticket

```typescript
import { bookTicket } from './services/ticketService';

const handleBooking = async (eventId: string, userId: string, userName: string, userEmail: string) => {
  const result = await bookTicket(eventId, userId, userName, userEmail);
  
  if (result.success) {
    console.log('Ticket booked:', result.ticket);
  } else {
    console.error('Booking failed:', result.error);
  }
};
```

### Validating a Ticket

```typescript
import { validateTicket } from './services/validationService';

const handleValidation = async (ticketId: string) => {
  const result = await validateTicket(ticketId);
  
  if (result.valid) {
    console.log('Valid ticket:', result.ticket);
  } else {
    console.error('Invalid:', result.message);
  }
};
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProtectedRoute.tsx
│   └── OrganizerRoute.tsx
├── pages/              # Page components (to be implemented)
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── services/           # Firebase and business logic
│   ├── authService.ts
│   ├── userService.ts
│   ├── eventService.ts
│   ├── ticketService.ts
│   ├── validationService.ts
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── errorMessages.ts
│   ├── helpers.ts
│   └── index.ts
├── config/             # Configuration files
│   └── firebase.ts
├── App.tsx
└── index.tsx
```

## Key Features Implementation

### Transaction-Based Booking

The booking system uses Firestore transactions to ensure:
- Atomic operations (ticket creation + available tickets decrement)
- No race conditions
- Consistent data state

### Booking Limits

- Maximum 2 tickets per user per event
- Enforced at service level
- Checked before transaction

### Role-Based Access Control

- Attendee role: Can book tickets, view own tickets
- Organizer role: Can manage events, view attendees, validate tickets
- Protected routes enforce access control

### Error Handling

- User-friendly error messages
- Firebase error code mapping
- Comprehensive error utilities

## Next Steps

1. Implement UI pages (Login, Signup, Event Listing, etc.)
2. Add React Router configuration
3. Create EventCard component
4. Create TicketQR component with qrcode.react
5. Build Organizer Dashboard
6. Add QR scanner (optional)
7. Deploy to Vercel/Netlify

## License

Private - Hackathon Project
