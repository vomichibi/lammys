import { Adapter } from 'next-auth/adapters';
import { db } from '@/lib/firebaseInit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const FirebaseAdapter = (): Adapter => {
  return {
    async createUser(user) {
      const userRef = doc(db, 'users', user.email!);
      const newUser = {
        ...user,
        emailVerified: user.emailVerified ?? null,
      };
      await setDoc(userRef, newUser);
      return { ...newUser, id: user.email! };
    },

    async getUser(id) {
      const userRef = doc(db, 'users', id);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      const userData = userDoc.data();
      return {
        ...userData,
        id,
        emailVerified: userData.emailVerified ?? null,
      };
    },

    async getUserByEmail(email) {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      const userData = userDoc.data();
      return {
        ...userData,
        id: email,
        emailVerified: userData.emailVerified ?? null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const userRef = doc(db, 'accounts', `${provider}_${providerAccountId}`);
      const accountDoc = await getDoc(userRef);
      if (!accountDoc.exists()) return null;
      const { userId } = accountDoc.data();
      return this.getUser(userId);
    },

    async updateUser(user) {
      const userRef = doc(db, 'users', user.id);
      const updates = {
        ...user,
        emailVerified: user.emailVerified ?? null,
      };
      await updateDoc(userRef, updates);
      return { ...updates, id: user.id };
    },

    async linkAccount(account) {
      const accountRef = doc(db, 'accounts', `${account.provider}_${account.providerAccountId}`);
      await setDoc(accountRef, {
        ...account,
        userId: account.userId,
      });
      return account;
    },

    async createSession(session) {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      await setDoc(sessionRef, {
        ...session,
        expires: session.expires.toISOString(),
      });
      return session;
    },

    async getSessionAndUser(sessionToken) {
      const sessionRef = doc(db, 'sessions', sessionToken);
      const sessionDoc = await getDoc(sessionRef);
      if (!sessionDoc.exists()) return null;

      const session = sessionDoc.data();
      const user = await this.getUser(session.userId);
      if (!user) return null;

      return {
        session: {
          ...session,
          expires: new Date(session.expires),
        },
        user,
      };
    },

    async updateSession(session) {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      const updates = {
        ...session,
        expires: session.expires.toISOString(),
      };
      await updateDoc(sessionRef, updates);
      return {
        ...session,
        expires: new Date(updates.expires),
      };
    },

    async deleteSession(sessionToken) {
      const sessionRef = doc(db, 'sessions', sessionToken);
      await updateDoc(sessionRef, { expires: new Date(0).toISOString() });
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const accountRef = doc(db, 'accounts', `${provider}_${providerAccountId}`);
      await updateDoc(accountRef, { userId: null });
    },
  };
};
