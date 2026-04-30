import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Message } from '../types';

export const saveMessage = async (userId: string, chatId: string, message: Message) => {
  try {
    await addDoc(collection(db, 'users', userId, 'chats', chatId, 'messages'), {
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

export const getChatMessages = (userId: string, chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, 'users', userId, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })) as Message[];
    callback(messages);
  });
};

export const getUserChats = (userId: string, callback: (chats: any[]) => void) => {
  const q = query(collection(db, 'users', userId, 'chats'), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};

export const createNewChat = async (userId: string, title: string) => {
  const docRef = await addDoc(collection(db, 'users', userId, 'chats'), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};
