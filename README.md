# 🎫 EventHub - Event Management & Ticketing System

A modern, full-featured event management and ticketing platform built with React, Firebase, and QR code technology.

## 🌟 Features

### For Attendees
- ✅ Browse and search events with filters
- ✅ View detailed event information
- ✅ Book tickets (max 2 per event)
- ✅ Generate QR code tickets
- ✅ Download tickets as images
- ✅ View all booked tickets in one place
- ✅ Real-time ticket availability

### For Organizers
- ✅ Comprehensive dashboard
- ✅ View all events and attendees
- ✅ Real-time ticket statistics
- ✅ Validate tickets via QR code or manual entry
- ✅ Track ticket status (valid/used)
- ✅ Search and filter attendees

### Core Logic Implemented
1. ✅ Prevent booking without login
2. ✅ Limit tickets per user (max 2)
3. ✅ Generate unique ticket IDs
4. ✅ Store bookings in localStorage
5. ✅ Show "Sold Out" when tickets finished
6. ✅ Disable booking after event date
7. ✅ Real-time ticket counter
8. ✅ Ticket validation system
9. ✅ Protected routes for organizers

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Styling**: Custom CSS

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd event-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Copy your Firebase config
   - Update `src/firebase.js` with your credentials

4. Start the development server:
```bash
npm run dev
```

## 🔥 Firebase Setup

1. Go to Firebase Console
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Get your config:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Copy the firebaseConfig object
   - Paste it in `src/firebase.js`

## 👥 Demo Credentials

### Attendee Account
- Email: `attendee@demo.com`
- Password: `password123`

### Organizer Account
- Email: `organizer@demo.com`
- Password: `password123`

## 📁 Project Structure

```
src/
├── components/
│   ├── EventCard.jsx       # Event display card
│   ├── Navbar.jsx          # Navigation bar
│   ├── ProtectedRoute.jsx  # Route protection
│   └── TicketQR.jsx        # QR code ticket component
├── pages/
│   ├── Home.jsx            # Event listing page
│   ├── EventDetails.jsx    # Event details & booking
│   ├── MyTickets.jsx       # User's tickets
│   ├── Organizer.jsx       # Organizer dashboard
│   ├── Login.jsx           # Login page
│   └── Signup.jsx          # Signup page
├── context/
│   └── AuthContext.jsx     # Authentication context
├── data/
│   └── events.js           # Event data
├── firebase.js             # Firebase configuration
├── App.jsx                 # Main app component
├── App.css                 # Main styles
└── main.jsx                # Entry point
```

## 🎨 Features Breakdown

### Authentication System
- Firebase Authentication with email/password
- Role-based access (Attendee/Organizer)
- Protected routes
- Persistent login sessions

### Event Management
- 6 pre-loaded events across different categories
- Search functionality
- Category filtering
- Event expiration handling
- Ticket availability tracking

### Booking System
- Login required for booking
- Maximum 2 tickets per user per event
- Unique ticket ID generation
- Real-time availability updates
- Booking confirmation

### QR Code System
- Unique QR code for each ticket
- Downloadable ticket images
- QR code contains ticket metadata
- Scannable for validation

### Organizer Dashboard
- Event selection sidebar
- Real-time statistics
- Attendee list with search
- Ticket validation interface
- Status tracking (valid/used)

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy the dist folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the dist folder to Netlify
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📝 Usage Guide

### For Attendees
1. Sign up with email and password (select "Attendee")
2. Browse events on the home page
3. Use search and filters to find events
4. Click "View Details" on any event
5. Select number of tickets (1 or 2)
6. Click "Book Ticket"
7. View your tickets in "My Tickets"
8. Download QR code tickets

### For Organizers
1. Sign up with email and password (select "Organizer")
2. Access the dashboard from the navbar
3. Select an event from the sidebar
4. View attendee statistics
5. Search for specific attendees
6. Validate tickets by entering ticket ID
7. Track ticket status (valid/used)

## 🎯 Key Highlights

- **Modern UI**: Dark theme with smooth animations
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Instant ticket availability updates
- **Secure**: Firebase authentication and protected routes
- **User-friendly**: Intuitive interface for both roles
- **Production-ready**: Clean code and best practices

## 🔒 Security Features

- Protected routes for role-based access
- Firebase authentication
- Input validation
- Secure ticket generation
- Status tracking to prevent reuse

## 📱 Responsive Design

- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized controls
- Responsive navigation

## 🎓 Learning Outcomes

This project demonstrates:
- React hooks and context API
- Firebase integration
- Protected routing
- QR code generation
- State management
- Local storage usage
- Role-based authentication
- Real-time data updates

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Built with ❤️ for the Hackathon

---

**Note**: Remember to update your Firebase configuration in `src/firebase.js` before deploying!
