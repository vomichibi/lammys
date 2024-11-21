import { Adapter } from 'next-auth/adapters';
import { db } from '@/lib/firebaseInit';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export const ClientAdapter = (): Adapter => {
  return {
    async createUser(user) {
      const userRef = doc(db, 'users', user.email!);
      const newUser = {
        email: user.email,
        name: user.name,
        image: user.image,
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
      const accountsRef = collection(db, 'accounts');
      const q = query(
        accountsRef, 
        where('provider', '==', provider),
        where('providerAccountId', '==', providerAccountId)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const accountData = querySnapshot.docs[0].data();
      return this.getUser(accountData.userId);
    },

    async updateUser(user) {
      const userRef = doc(db, 'users', user.id);
      const updates = {
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified ?? null,
      };
      await updateDoc(userRef, updates);
      return { ...updates, id: user.id };
    },

    async linkAccount(account) {
      const accountId = `${account.provider}_${account.providerAccountId}`;
      const accountRef = doc(db, 'accounts', accountId);
      await setDoc(accountRef, {
        ...account,
        userId: account.userId,
      });
      return account;
    },

    async createSession(session) {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      await setDoc(sessionRef, {
        userId: session.userId,
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
          sessionToken,
          userId: session.userId,
        },
        user,
      };
    },

    async updateSession(session) {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      const updates = {
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
      await deleteDoc(sessionRef);
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const accountId = `${provider}_${providerAccountId}`;
      const accountRef = doc(db, 'accounts', accountId);
      await deleteDoc(accountRef);
    },
  };
};
