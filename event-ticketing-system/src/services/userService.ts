import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

/**
 * Create a new user profile in Firestore
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  role: 'attendee' | 'organizer' = 'attendee'
): Promise<User> => {
  try {
    const userRef = doc(db, 'users', uid);
    
    const userData: User = {
      uid,
      email,
      name,
      role,
      createdAt: serverTimestamp() as Timestamp,
      bookingCount: 0
    };

    await setDoc(userRef, userData);
    
    // Return user data with current timestamp
    return {
      ...userData,
      createdAt: Timestamp.now()
    };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile. Please try again.');
  }
};

/**
 * Get user profile from Firestore by UID
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to retrieve user profile.');
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile.');
  }
};

/**
 * Increment user's booking count
 */
export const incrementBookingCount = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentCount = userDoc.data().bookingCount || 0;
      await updateDoc(userRef, {
        bookingCount: currentCount + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing booking count:', error);
    throw new Error('Failed to update booking count.');
  }
};
