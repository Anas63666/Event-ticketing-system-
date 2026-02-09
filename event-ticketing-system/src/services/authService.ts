import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Sign up a new user with email and password
 */
export const signup = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Login an existing user with email and password
 */
export const login = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw handleAuthError(error as AuthError);
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

/**
 * Handle Firebase authentication errors and return user-friendly messages
 */
const handleAuthError = (error: AuthError): Error => {
  let message = 'An error occurred during authentication.';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'Email already registered. Please login.';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email format.';
      break;
    case 'auth/weak-password':
      message = 'Password must be at least 6 characters.';
      break;
    case 'auth/user-not-found':
      message = 'No account found with this email.';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password.';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection.';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later.';
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled.';
      break;
    default:
      message = error.message || 'Authentication failed. Please try again.';
  }

  return new Error(message);
};
