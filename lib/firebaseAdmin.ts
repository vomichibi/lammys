import * as admin from 'firebase-admin';

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error('Missing Firebase Admin SDK credentials');
      }

      // Ensure private key is properly formatted
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // If the key doesn't start with the correct header, assume it needs processing
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });

      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      throw error;
    }
  }
  return admin;
}

// Initialize Firebase Admin immediately
const firebaseAdmin = initializeFirebaseAdmin();

// Export initialized services
export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();
