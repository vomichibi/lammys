import { db } from './firebaseInit';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}

export const createUser = async (userData: {
  email: string;
  name?: string;
}): Promise<User> => {
  try {
    const usersRef = collection(db, 'users');
    const userDoc = doc(usersRef, userData.email);
    
    // Check if user already exists
    const existingUser = await getDoc(userDoc);
    if (existingUser.exists()) {
      // Update last login time
      const updatedUser = {
        ...existingUser.data(),
        lastLoginAt: new Date(),
      };
      await setDoc(userDoc, updatedUser, { merge: true });
      return updatedUser as User;
    }

    // Create new user
    const newUser: User = {
      id: userData.email,
      email: userData.email,
      name: userData.name || '',
      role: 'user',
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(userDoc, newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating/updating user:', error);
    // Try to reconnect if network is the issue
    try {
      await enableNetwork(db);
      // Retry the operation
      return createUser(userData);
    } catch (retryError) {
      console.error('Failed to retry user creation:', retryError);
      throw new Error('Failed to create/update user');
    }
  }
};

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', email));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    // Try to reconnect if network is the issue
    try {
      await enableNetwork(db);
      // Retry the operation
      return getUser(email);
    } catch (retryError) {
      console.error('Failed to retry getting user:', retryError);
      return null;
    }
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error getting all users:', error);
    // Try to reconnect if network is the issue
    try {
      await enableNetwork(db);
      // Retry the operation
      return getAllUsers();
    } catch (retryError) {
      console.error('Failed to retry getting all users:', retryError);
      return [];
    }
  }
};

export const isAdmin = async (email: string): Promise<boolean> => {
  try {
    const user = await getUser(email);
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
