# 🚀 Quick Setup Guide

## Project Complete! ✅

All features have been implemented. Follow these steps to run the app:

## 1. Install Dependencies
```bash
npm install
```

## 2. Firebase Setup

### Create Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enable **Email/Password Authentication**
4. Create **Firestore Database** (Start in test mode)

### Get Firebase Config:
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the config values

### Create .env file:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 3. Add Sample Event Data

Go to Firestore Console and create a document in `events` collection:

```json
{
  "name": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-12-15T10:00:00Z",
  "time": "10:00 AM",
  "location": "Convention Center",
  "imageUrl": "",
  "totalTickets": 100,
  "availableTickets": 100,
  "ticketPrice": 0,
  "organizerId": "test-organizer-id",
  "tags": ["technology", "conference"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 4. Start the App
```bash
npm start
```

App will open at `http://localhost:3000`

## 5. Test the App

### As Attendee:
1. Sign up with email/password
2. Browse events
3. Click event → Book ticket
4. View "My Tickets" to see QR code

### As Organizer:
1. Manually set your user's `role` to `"organizer"` in Firestore `users` collection
2. Login
3. Access "Dashboard"
4. View attendees and validate tickets

## Features Implemented:
✅ Event browsing with search
✅ User authentication
✅ Ticket booking
✅ QR code generation
✅ My Tickets page
✅ Organizer dashboard
✅ Attendee management
✅ Ticket validation
✅ Protected routes
✅ Responsive design

## Need Help?
Check README.md for detailed documentation!
