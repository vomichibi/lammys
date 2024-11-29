// Export client-side Firebase
export * from './config';
export * from './auth';
export * from './firestore';
export * from './storage';

// Only export admin on server-side
export const adminAuth = null;
export const adminDb = null;
export const adminStorage = null;
