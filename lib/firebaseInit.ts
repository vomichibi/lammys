'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getPerformance } from 'firebase/performance';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = (config: typeof firebaseConfig) => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => {
    const value = config[field as keyof typeof config];
    return !value || value === 'undefined';
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase with error handling
let app;
let db: Firestore;
let auth;

try {
  validateFirebaseConfig(firebaseConfig);
  
  // Check if Firebase is already initialized
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // Initialize Firestore and Auth
  db = getFirestore(app);
  auth = getAuth(app);

  // Initialize Performance Monitoring (optional)
  if (typeof window !== 'undefined') {
    try {
      const perf = getPerformance(app);
      console.log('Firebase Performance Monitoring initialized');
    } catch (error) {
      console.error('Performance Monitoring initialization error:', error);
      // Non-critical error, don't throw
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { db, auth };
export type { Firestore };
