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
  Auth,
} from 'firebase/auth';
import { auth } from './firebase';
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
} as const;

export const createUser = async (email: string, password: string, name?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
    
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
    const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
    
    // Wait for auth state to be fully initialized
    await new Promise<void>((resolve) => {
      const unsubscribe = (auth as Auth).onAuthStateChanged((user: User | null) => {
        if (user) {
          unsubscribe();
          resolve();
        }
      });
      
      // Add timeout to prevent infinite waiting
      setTimeout(() => {
        unsubscribe();
        resolve();
      }, 5000);
    });
    
    // Update last login timestamp
    await setDoc(doc(db, 'users', email), {
      lastLogin: new Date().toISOString()
    }, { merge: true });

    // Set user email cookie
    document.cookie = `user_email=${email}; path=/; max-age=7200; SameSite=Strict`;

    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth as Auth, provider);
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth as Auth);
    // Clear user email cookie
    document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth as Auth, email);
  } catch (error: any) {
    throw new Error(AUTH_ERRORS[error.code as keyof typeof AUTH_ERRORS] || AUTH_ERRORS.default);
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth as Auth, callback);
};

// Type for the authenticated user
export interface AuthUser {
  id: string;
  email: string | null;
  name?: string | null;
  isAdmin: boolean;
}

// Helper function to check if user is admin
export function isAdmin(user: User | null): boolean {
  return user?.email === 'team@lammys.au';
}

// Helper function to get current user
export const getCurrentUser = (): User | null => {
  return (auth as Auth).currentUser;
};
