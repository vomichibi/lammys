import {
  collection,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  DocumentReference,
  WriteBatch,
  writeBatch,
  limit,
  orderBy,
  startAfter,
  QueryConstraint,
  FirestoreError,
  onSnapshot,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';

// Custom error messages for Firestore operations
const FIRESTORE_ERRORS = {
  'not-found': 'Document not found',
  'permission-denied': 'Permission denied to access document',
  'already-exists': 'Document already exists',
  'failed-precondition': 'Operation failed due to document state',
  'invalid-argument': 'Invalid argument provided',
};

// Base Types
export interface BaseDocument {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Booking Types
export interface Booking extends BaseDocument {
  userId: string;
  services: string[];
  status: BookingStatus;
  payment: PaymentInfo;
  date: Date;
  notes?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface PaymentInfo {
  amount: number;
  status: PaymentStatus;
  stripePaymentId?: string;
  refundId?: string;
  paymentMethod?: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

// Service Types
export interface Service extends BaseDocument {
  name: string;
  price: number;
  description: string;
  category: string;
  estimatedTime: number;
  available: boolean;
  imageUrl?: string;
  maxBookingsPerDay?: number;
}

// Generic CRUD Operations
export class FirestoreCollection<T extends BaseDocument> {
  constructor(
    private collectionName: string,
    private converter?: {
      toFirestore: (data: T) => DocumentData;
      fromFirestore: (snapshot: QueryDocumentSnapshot) => T;
    }
  ) {}

  protected handleError(error: FirestoreError): never {
    const message = FIRESTORE_ERRORS[error.code] || error.message;
    throw new Error(`Firestore error (${error.code}): ${message}`);
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const timestamp = serverTimestamp();
      const docData = {
        ...data,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await setDoc(docRef, docData);
      return { ...docData, id: docRef.id } as T;
    } catch (error) {
      this.handleError(error as FirestoreError);
    }
  }

  async get(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return this.convertTimestamps(docSnap) as T;
    } catch (error) {
      this.handleError(error as FirestoreError);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      this.handleError(error as FirestoreError);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      this.handleError(error as FirestoreError);
    }
  }

  async list(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertTimestamps(doc) as T);
    } catch (error) {
      this.handleError(error as FirestoreError);
    }
  }

  onSnapshot(
    id: string,
    callback: (doc: T | null) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    const docRef = doc(db, this.collectionName, id);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(null);
          return;
        }
        callback(this.convertTimestamps(snapshot) as T);
      },
      (error) => {
        if (errorCallback) {
          errorCallback(new Error(FIRESTORE_ERRORS[error.code] || error.message));
        }
      }
    );
  }

  protected convertTimestamps(doc: DocumentSnapshot | QueryDocumentSnapshot): T {
    const data = doc.data();
    if (!data) return null;

    const converted = { ...data, id: doc.id };
    for (const [key, value] of Object.entries(converted)) {
      if (value instanceof Timestamp) {
        converted[key] = value.toDate();
      }
    }
    return converted as T;
  }
}

// Bookings Collection
export class BookingsCollection extends FirestoreCollection<Booking> {
  constructor() {
    super('bookings');
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.list([
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ]);
  }

  async getBookingsByDate(date: Date): Promise<Booking[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.list([
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      orderBy('date', 'asc')
    ]);
  }

  async updateBookingStatus(
    id: string, 
    status: BookingStatus, 
    paymentStatus?: PaymentStatus
  ): Promise<void> {
    const updates: Partial<Booking> = { status };
    if (paymentStatus) {
      updates['payment.status'] = paymentStatus;
    }
    return this.update(id, updates);
  }
}

// Services Collection
export class ServicesCollection extends FirestoreCollection<Service> {
  constructor() {
    super('services');
  }

  async getAvailableServices(): Promise<Service[]> {
    return this.list([
      where('available', '==', true),
      orderBy('category'),
      orderBy('price')
    ]);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.list([
      where('category', '==', category),
      where('available', '==', true),
      orderBy('price')
    ]);
  }

  async updateServiceAvailability(
    id: string, 
    available: boolean
  ): Promise<void> {
    return this.update(id, { available });
  }
}

// Export instances
export const bookings = new BookingsCollection();
export const services = new ServicesCollection();
