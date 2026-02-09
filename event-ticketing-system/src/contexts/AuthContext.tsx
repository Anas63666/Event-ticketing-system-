import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthContextType, User } from '../types';
import * as authService from '../services/authService';
import * as userService from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use the AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOrganizer, setIsOrganizer] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await userService.getUserProfile(firebaseUser.uid);
          
          if (userProfile) {
            setCurrentUser(userProfile);
            setIsOrganizer(userProfile.role === 'organizer');
          } else {
            // If profile doesn't exist, user might be newly created
            setCurrentUser(null);
            setIsOrganizer(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser(null);
          setIsOrganizer(false);
        }
      } else {
        setCurrentUser(null);
        setIsOrganizer(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Sign up a new user
   */
  const signup = async (email: string, password: string, name: string): Promise<void> => {
    try {
      // Create Firebase auth user
      const firebaseUser = await authService.signup(email, password);
      
      // Create user profile in Firestore
      const userProfile = await userService.createUserProfile(
        firebaseUser.uid,
        email,
        name,
        'attendee' // Default role is attendee
      );
      
      setCurrentUser(userProfile);
      setIsOrganizer(false);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Login an existing user
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const firebaseUser = await authService.login(email, password);
      
      // Get user profile from Firestore
      const userProfile = await userService.getUserProfile(firebaseUser.uid);
      
      if (userProfile) {
        setCurrentUser(userProfile);
        setIsOrganizer(userProfile.role === 'organizer');
      } else {
        throw new Error('User profile not found.');
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout the current user
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsOrganizer(false);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    isOrganizer,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
