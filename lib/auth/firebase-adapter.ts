import { Adapter, AdapterUser, AdapterSession, AdapterAccount } from 'next-auth/adapters';
import { db } from '@/lib/firebaseInit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface FirebaseAccount extends AdapterAccount {
  userId: string;
}

export const FirebaseAdapter = (): Adapter => {
  const adapter: Adapter = {
    async createUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const userRef = doc(db, 'users', user.email!);
      const newUser = {
        ...user,
        id: user.email!,
        emailVerified: null,
      };
      await setDoc(userRef, newUser);
      return newUser as AdapterUser;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const userRef = doc(db, 'users', id);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      return userDoc.data() as AdapterUser;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const userRef = doc(db, 'users', email);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      return userDoc.data() as AdapterUser;
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }): Promise<AdapterUser | null> {
      const accountRef = doc(db, 'accounts', `${provider}_${providerAccountId}`);
      const accountDoc = await getDoc(accountRef);
      if (!accountDoc.exists()) return null;
      const account = accountDoc.data() as FirebaseAccount;
      if (!account.userId) return null;
      
      const userRef = doc(db, 'users', account.userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      return userDoc.data() as AdapterUser;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const userRef = doc(db, 'users', user.id);
      const updates = {
        ...user,
        emailVerified: null,
      };
      await updateDoc(userRef, updates);
      return updates as AdapterUser;
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
      const accountRef = doc(db, 'accounts', `${account.provider}_${account.providerAccountId}`);
      await setDoc(accountRef, {
        ...account,
        userId: account.userId,
      });
      return account;
    },

    async createSession(session: AdapterSession): Promise<AdapterSession> {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      await setDoc(sessionRef, {
        ...session,
        expires: session.expires.toISOString(),
      });
      return session;
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession, user: AdapterUser } | null> {
      const sessionRef = doc(db, 'sessions', sessionToken);
      const sessionDoc = await getDoc(sessionRef);
      if (!sessionDoc.exists()) return null;

      const session = sessionDoc.data();
      if (!session.userId) return null;

      const userRef = doc(db, 'users', session.userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return null;
      const user = userDoc.data() as AdapterUser;

      return {
        session: {
          ...session,
          expires: new Date(session.expires),
        } as AdapterSession,
        user,
      };
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null> {
      const sessionRef = doc(db, 'sessions', session.sessionToken);
      const updates = {
        ...session,
        expires: session.expires?.toISOString(),
      };
      await updateDoc(sessionRef, updates);
      return {
        ...session,
        expires: session.expires || new Date(),
      } as AdapterSession;
    },

    async deleteSession(sessionToken: string): Promise<void> {
      const sessionRef = doc(db, 'sessions', sessionToken);
      await updateDoc(sessionRef, { expires: new Date(0).toISOString() });
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }): Promise<void> {
      const accountRef = doc(db, 'accounts', `${provider}_${providerAccountId}`);
      await updateDoc(accountRef, { userId: null });
    },
  };

  return adapter;
};
