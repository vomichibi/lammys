import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseInit';

// Error messages
const AUTH_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-email': 'Invalid email address',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled',
  'auth/weak-password': 'Password is too weak',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-credential': 'Invalid login credentials',
  'default': 'An error occurred during authentication'
};

export const createUser = async (email: string, password: string, name?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', email), {
      email,
      name: name || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    // Update user profile if name is provided
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
    }

    return userCredential;
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Create/update user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.email!), {
      email: userCredential.user.email,
      name: userCredential.user.displayName || '',
      role: 'user',
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    return userCredential;
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to sign out');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || 'Failed to send password reset email');
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Type for the authenticated user
export interface AuthUser {
  id: string;
  email: string | null;
  name?: string | null;
  isAdmin: boolean;
}

// Helper function to check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return user?.email === 'team@lammys.au';
};
