import { Adapter, AdapterUser, AdapterSession } from 'next-auth/adapters';
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

interface CreateUserParams {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

class FirebaseClientAdapter implements Adapter {
  constructor() {
    // Bind methods to ensure 'this' context
    this.createUser = this.createUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.getUserByAccount = this.getUserByAccount.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.linkAccount = this.linkAccount.bind(this);
    this.unlinkAccount = this.unlinkAccount.bind(this);
    this.getSessionAndUser = this.getSessionAndUser.bind(this);
    this.createSession = this.createSession.bind(this);
    this.updateSession = this.updateSession.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
  }

  async createUser(user: CreateUserParams): Promise<AdapterUser> {
    const userRef = doc(db, 'users', user.email);
    const newUser: AdapterUser = {
      id: user.email,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
      emailVerified: user.emailVerified || null,
    };
    await setDoc(userRef, {
      email: newUser.email,
      name: newUser.name,
      image: newUser.image,
      emailVerified: newUser.emailVerified,
    });
    return newUser;
  }

  async getUser(id: string): Promise<AdapterUser | null> {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;
    const userData = userDoc.data();
    
    if (!userData) return null;

    return {
      id,
      email: userData.email,
      name: userData.name || undefined,
      image: userData.image || undefined,
      emailVerified: userData.emailVerified || null,
    };
  }

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const userRef = doc(db, 'users', email);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;
    const userData = userDoc.data();
    
    if (!userData) return null;

    return {
      id: email,
      email: userData.email,
      name: userData.name || undefined,
      image: userData.image || undefined,
      emailVerified: userData.emailVerified || null,
    };
  }

  async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<AdapterUser | null> {
    const accountsRef = collection(db, 'accounts');
    const q = query(
      accountsRef,
      where('providerAccountId', '==', providerAccountId),
      where('provider', '==', provider)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const accountDoc = querySnapshot.docs[0];
    const userData = accountDoc.data();
    if (!userData || !userData.userId) return null;
    
    return this.getUser(userData.userId);
  }

  async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
    const userRef = doc(db, 'users', user.id);
    const updates = {
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified || null,
    };
    await updateDoc(userRef, updates);
    const updatedUser = await getDoc(userRef);
    const userData = updatedUser.data();
    
    if (!userData) {
      throw new Error('User data not found after update');
    }

    return {
      id: user.id,
      email: userData.email,
      name: userData.name || undefined,
      image: userData.image || undefined,
      emailVerified: userData.emailVerified || null,
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  }

  async linkAccount(account: any): Promise<void> {
    const accountRef = doc(db, 'accounts', `${account.provider}_${account.providerAccountId}`);
    await setDoc(accountRef, {
      ...account,
      userId: account.userId,
    });
  }

  async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<void> {
    const accountRef = doc(db, 'accounts', `${provider}_${providerAccountId}`);
    await deleteDoc(accountRef);
  }

  async createSession({ sessionToken, userId, expires }: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
    const sessionRef = doc(db, 'sessions', sessionToken);
    const session = {
      sessionToken,
      userId,
      expires,
    };
    await setDoc(sessionRef, session);
    return session;
  }

  async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    const sessionRef = doc(db, 'sessions', sessionToken);
    const sessionDoc = await getDoc(sessionRef);
    if (!sessionDoc.exists()) return null;

    const session = sessionDoc.data() as AdapterSession;
    const user = await this.getUser(session.userId);
    if (!user) return null;

    return {
      session,
      user,
    };
  }

  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
  ): Promise<AdapterSession | null> {
    const sessionRef = doc(db, 'sessions', session.sessionToken);
    const sessionDoc = await getDoc(sessionRef);
    if (!sessionDoc.exists()) return null;

    const updates = {
      ...session,
      ...(session.expires && { expires: session.expires }),
    };
    
    await updateDoc(sessionRef, updates);
    const updatedSession = await getDoc(sessionRef);
    return updatedSession.data() as AdapterSession;
  }

  async deleteSession(sessionToken: string): Promise<void> {
    const sessionRef = doc(db, 'sessions', sessionToken);
    await deleteDoc(sessionRef);
  }
}

export const ClientAdapter = new FirebaseClientAdapter();
