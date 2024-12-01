import * as admin from 'firebase-admin';

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Missing Firebase Admin SDK credentials');
      }

      // Format private key correctly
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        .replace(/\\n/g, '\n')
        .replace(/"\n"/g, '\n')
        .replace(/^"/, '')
        .replace(/"$/, '');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });

      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      throw error; // Re-throw to prevent silent failures
    }
  }
  return admin;
}

// Initialize Firebase Admin immediately
const firebaseAdmin = initializeFirebaseAdmin();

// Export initialized services
export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
