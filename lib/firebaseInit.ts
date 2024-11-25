'use client';

import { initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
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

  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase with error handling
let app;
try {
  validateFirebaseConfig(firebaseConfig);
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firestore with error handling
let db: Firestore;
try {
  db = getFirestore(app);
} catch (error) {
  console.error('Firestore initialization error:', error);
  throw error;
}

// Initialize Performance Monitoring
let perf;
try {
  perf = getPerformance(app);
  console.log('Firebase Performance Monitoring initialized');
} catch (error) {
  console.error('Performance Monitoring initialization error:', error);
  // Non-critical error, don't throw
}

export { db, perf };
export type { Firestore };
