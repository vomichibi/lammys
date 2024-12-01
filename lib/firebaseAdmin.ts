import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });

    // Set admin claim for team@lammys.au if not already set
    const setupAdminUser = async () => {
      try {
        const user = await admin.auth().getUserByEmail('team@lammys.au');
        const customClaims = (await admin.auth().getUser(user.uid)).customClaims;
        
        if (!customClaims?.admin) {
          await admin.auth().setCustomUserClaims(user.uid, { admin: true });
          console.log('Admin claims set for team@lammys.au');
        }
      } catch (error) {
        console.error('Error setting up admin user:', error);
      }
    };

    setupAdminUser();
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const initializeFirebaseAdmin = () => {
  return admin;
};
