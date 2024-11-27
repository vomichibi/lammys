import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  UploadMetadata,
  StorageError
} from 'firebase/storage';
import { storage } from './config';

// Error messages for storage operations
const STORAGE_ERRORS = {
  'storage/unauthorized': 'User is not authorized to perform this operation',
  'storage/canceled': 'Upload was canceled by the user',
  'storage/unknown': 'An unknown error occurred',
  'storage/object-not-found': 'File does not exist',
  'storage/bucket-not-found': 'Storage bucket not found',
  'storage/quota-exceeded': 'Storage quota exceeded',
  'storage/invalid-checksum': 'File on the client does not match the checksum of the file received',
  'storage/retry-limit-exceeded': 'Maximum retry time for operation exceeded',
};

export interface UploadOptions {
  metadata?: UploadMetadata;
  generateUniqueName?: boolean;
}

export interface UploadResult {
  url: string;
  path: string;
  metadata: UploadMetadata;
}

const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
};

export const uploadFile = async (
  file: File,
  path: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const fileName = options.generateUniqueName 
      ? generateUniqueFileName(file.name)
      : file.name;
    
    const fullPath = `${path}/${fileName}`;
    const storageRef = ref(storage, fullPath);
    
    const metadata: UploadMetadata = {
      contentType: file.type,
      ...options.metadata,
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const url = await getDownloadURL(snapshot.ref);

    return {
      url,
      path: fullPath,
      metadata: snapshot.metadata,
    };
  } catch (error) {
    const storageError = error as StorageError;
    throw new Error(STORAGE_ERRORS[storageError.code] || storageError.message);
  }
};

export const uploadUserAvatar = async (
  userId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const path = `avatars/${userId}`;
  return uploadFile(file, path, {
    ...options,
    generateUniqueName: true,
    metadata: {
      ...options.metadata,
      customMetadata: {
        ...options.metadata?.customMetadata,
        userId,
        purpose: 'avatar',
      },
    },
  });
};

export const uploadServiceImage = async (
  serviceId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const path = `services/${serviceId}/images`;
  return uploadFile(file, path, {
    ...options,
    generateUniqueName: true,
    metadata: {
      ...options.metadata,
      customMetadata: {
        ...options.metadata?.customMetadata,
        serviceId,
        purpose: 'service-image',
      },
    },
  });
};

export const uploadReceiptDocument = async (
  orderId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const path = `orders/${orderId}/receipts`;
  return uploadFile(file, path, {
    ...options,
    generateUniqueName: true,
    metadata: {
      ...options.metadata,
      customMetadata: {
        ...options.metadata?.customMetadata,
        orderId,
        purpose: 'receipt',
      },
    },
  });
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    const storageError = error as StorageError;
    throw new Error(STORAGE_ERRORS[storageError.code] || storageError.message);
  }
};

export const deleteUserFiles = async (userId: string): Promise<void> => {
  try {
    const userFolderRef = ref(storage, `avatars/${userId}`);
    const files = await listAll(userFolderRef);
    
    await Promise.all(
      files.items.map(fileRef => deleteObject(fileRef))
    );
  } catch (error) {
    const storageError = error as StorageError;
    throw new Error(STORAGE_ERRORS[storageError.code] || storageError.message);
  }
};

export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    const storageError = error as StorageError;
    throw new Error(STORAGE_ERRORS[storageError.code] || storageError.message);
  }
};
