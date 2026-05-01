import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs, doc, deleteDoc, setDoc, getDoc, collectionGroup, limit } from 'firebase/firestore';
import { Message } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveUserSettings = async (userId: string, settings: any) => {
  const path = `users/${userId}/config/settings`;
  try {
    await setDoc(doc(db, path), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserSettings = async (userId: string) => {
  const path = `users/${userId}/config/settings`;
  try {
    const docSnap = await getDoc(doc(db, path));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

export const saveMessage = async (userId: string, chatId: string, message: Message & { isNegative?: boolean }) => {
  const path = `users/${userId}/chats/${chatId}/messages`;
  try {
    // Also save a global notification/active flag if needed, but for now we'll use collectionGroup
    await addDoc(collection(db, path), {
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp(),
      userId: userId, // Added for easier identification in global feed
      userEmail: auth.currentUser?.email || 'anonymous',
      isNegative: message.isNegative || false
    });
    
    // Update chat timestamp for the user
    await setDoc(doc(db, `users/${userId}/chats/${chatId}`), {
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getGlobalRecentMessages = (callback: (messages: any[]) => void) => {
  const q = query(
    collectionGroup(db, 'messages'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      path: doc.ref.path,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'collectionGroup:messages');
  });
};

export const deleteDocumentByPath = async (path: string) => {
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getChatMessages = (userId: string, chatId: string, callback: (messages: Message[]) => void) => {
  const path = `users/${userId}/chats/${chatId}/messages`;
  const q = query(
    collection(db, path),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Message[];
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const getUserChats = (userId: string, callback: (chats: any[]) => void) => {
  const path = `users/${userId}/chats`;
  const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

export const createNewChat = async (userId: string, title: string) => {
  const path = `users/${userId}/chats`;
  try {
    const docRef = await addDoc(collection(db, path), {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getStudents = (callback: (students: any[]) => void) => {
  const q = query(collection(db, 'students'), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'students'));
};

export const addStudent = async (name: string) => {
  try {
    await addDoc(collection(db, 'students'), { name, createdAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'students');
  }
};

export const deleteStudent = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'students', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `students/${id}`);
  }
};

export const updateSystemBroadcast = async (message: string) => {
  try {
    await setDoc(doc(db, 'system', 'config'), { broadcast: message, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'system/config');
  }
};

export const getSystemConfig = (callback: (config: any) => void) => {
  return onSnapshot(doc(db, 'system', 'config'), (docSnap) => {
    callback(docSnap.data());
  }, (err) => handleFirestoreError(err, OperationType.GET, 'system/config'));
};

export const getGalleryImages = (callback: (images: any[]) => void) => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'gallery'));
};

export const addGalleryImage = async (title: string, url: string) => {
  try {
    await addDoc(collection(db, 'gallery'), { title, url, createdAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'gallery');
  }
};

export const deleteGalleryImage = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
  }
};

export const getGalleryVideos = (callback: (videos: any[]) => void) => {
  const q = query(collection(db, 'gallery_videos'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (err) => handleFirestoreError(err, OperationType.LIST, 'gallery_videos'));
};

export const addGalleryVideo = async (title: string, url: string) => {
  try {
    await addDoc(collection(db, 'gallery_videos'), { title, url, createdAt: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'gallery_videos');
  }
};

export const deleteGalleryVideo = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'gallery_videos', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `gallery_videos/${id}`);
  }
};

