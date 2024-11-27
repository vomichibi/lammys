import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

// Export admin services
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

// Custom error messages for admin operations
const ADMIN_ERRORS = {
  'auth/user-not-found': 'User not found',
  'auth/invalid-uid': 'Invalid user ID provided',
  'auth/invalid-email': 'Invalid email address',
  'auth/id-token-expired': 'Authentication token has expired',
  'auth/id-token-revoked': 'Authentication token has been revoked',
  'auth/invalid-argument': 'Invalid argument provided',
  'auth/insufficient-permission': 'Insufficient permissions to perform this operation',
};

export interface AdminUserRecord {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  emailVerified: boolean;
  customClaims?: {
    [key: string]: any;
  };
  metadata: {
    creationTime: string;
    lastSignInTime: string;
    lastRefreshTime?: string;
  };
}

export interface CustomClaims {
  admin?: boolean;
  moderator?: boolean;
  premium?: boolean;
  [key: string]: any;
}

export const verifyIdToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await auth.verifyIdToken(token);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const setCustomUserClaims = async (
  uid: string, 
  claims: CustomClaims
): Promise<void> => {
  try {
    await auth.setCustomUserClaims(uid, claims);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const getUserByEmail = async (email: string): Promise<AdminUserRecord> => {
  try {
    return await auth.getUserByEmail(email);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const getUserById = async (uid: string): Promise<AdminUserRecord> => {
  try {
    return await auth.getUser(uid);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const updateUser = async (
  uid: string,
  updates: admin.auth.UpdateRequest
): Promise<AdminUserRecord> => {
  try {
    return await auth.updateUser(uid, updates);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const deleteUser = async (uid: string): Promise<void> => {
  try {
    await auth.deleteUser(uid);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const listUsers = async (
  maxResults: number = 1000,
  pageToken?: string
): Promise<{
  users: AdminUserRecord[];
  pageToken?: string;
}> => {
  try {
    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    return {
      users: listUsersResult.users,
      pageToken: listUsersResult.pageToken,
    };
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const revokeRefreshTokens = async (uid: string): Promise<void> => {
  try {
    await auth.revokeRefreshTokens(uid);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const createCustomToken = async (
  uid: string,
  claims?: CustomClaims
): Promise<string> => {
  try {
    return await auth.createCustomToken(uid, claims);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};

export const verifySessionCookie = async (
  sessionCookie: string,
  checkRevoked: boolean = true
): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await auth.verifySessionCookie(sessionCookie, checkRevoked);
  } catch (error: any) {
    throw new Error(ADMIN_ERRORS[error.code] || error.message);
  }
};
