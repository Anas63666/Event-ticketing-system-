# 🚀 Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name (e.g., "eventhub-app")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Click on **Email/Password** under Sign-in method
4. Enable **Email/Password**
5. Click "Save"

### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Select **Start in production mode**
4. Choose a location (closest to your users)
5. Click "Enable"

### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (</>)
4. Register your app (name: "EventHub")
5. Copy the `firebaseConfig` object

### Update Firebase Config
Open `src/firebase.js` and replace with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Create Demo Accounts

### Option 1: Use the Signup Page
1. Run `npm run dev`
2. Go to http://localhost:5173/signup
3. Create an **Attendee** account:
   - Email: attendee@demo.com
   - Password: password123
   - Role: Attendee
4. Logout and create an **Organizer** account:
   - Email: organizer@demo.com
   - Password: password123
   - Role: Organizer

### Option 2: Use Firebase Console
1. Go to **Authentication** > **Users**
2. Click "Add User"
3. Add both accounts manually
4. Then add user documents in Firestore:
   - Collection: `users`
   - Document ID: (user UID from Authentication)
   - Fields:
     - email: "attendee@demo.com"
     - role: "attendee"
     - createdAt: (current timestamp)

## Step 4: Run the Application
```bash
npm run dev
```

Visit http://localhost:5173

## Step 5: Test the Application

### Test as Attendee
1. Login with attendee@demo.com / password123
2. Browse events
3. Click on an event
4. Book tickets
5. View "My Tickets"
6. Download QR code

### Test as Organizer
1. Login with organizer@demo.com / password123
2. Go to Dashboard
3. Select an event
4. View attendee list
5. Validate a ticket using the ticket ID from attendee's QR code

## 🎯 Quick Test Flow

1. **Create Attendee Account** → Login
2. **Book 2 tickets** for "Tech Conference 2026"
3. **View tickets** in My Tickets page
4. **Copy a Ticket ID** from the QR code
5. **Logout** and login as Organizer
6. **Go to Dashboard** → Select "Tech Conference 2026"
7. **Paste Ticket ID** in validator
8. **Click Validate** → Should show success
9. **Try validating again** → Should show "already used"

## 🔧 Troubleshooting

### Firebase Errors
- **"Firebase: Error (auth/invalid-api-key)"**
  - Check your API key in firebase.js
  - Make sure you copied the entire config correctly

- **"Missing or insufficient permissions"**
  - Go to Firestore Rules
  - For development, use:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

### Build Errors
- **"Module not found"**
  - Run `npm install` again
  - Delete `node_modules` and `package-lock.json`, then `npm install`

### Login Issues
- Make sure Email/Password is enabled in Firebase Authentication
- Check browser console for errors
- Verify Firebase config is correct

## 📦 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## ✅ Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Firebase config updated in code
- [ ] Demo accounts created
- [ ] Application runs locally
- [ ] Tested booking flow
- [ ] Tested organizer dashboard
- [ ] Ready for deployment

## 🎉 You're All Set!

Your Event Management System is ready to use. Happy coding! 🚀
