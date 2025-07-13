import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { useRouter } from 'expo-router';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db, roomRef } from '@/firebaseConfig';
import Toast from 'react-native-toast-message';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (!currentUser?.userId) return;

  const unsubMessages = []; 

  const unsubRooms = onSnapshot(roomRef, (roomSnapshot) => {
    roomSnapshot.docs.forEach((roomDoc) => {
      const roomId = roomDoc.id;

      if (roomId === activeRoomId) return;

      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));

      const unsubMsg = onSnapshot(q, async (snapshot) => {
        const docSnap = snapshot.docs[0];
        const msg = docSnap?.data();
        const msgId = docSnap?.id;

        if (!msg || msg.userId === currentUser.userId || msg.notificationSent) return;

        const roomData = roomDoc.data();
        const lastSeen = roomData?.lastSeen?.[currentUser.userId]?.toMillis?.();

        if (msg.createdAt?.toMillis() > lastSeen) {

            const messageDocRef = doc(db, 'rooms', roomId, 'messages', msgId);
            await updateDoc(messageDocRef, { notificationSent: true });

            Toast.show({
            type: 'info',
            text1: `New message from ${msg.senderName}`,
            text2: msg.text,
            position: 'top',
            onPress: () => {
                router.push({
                pathname: '/chatRoom',
                params: {
                    userId: msg.userId,
                    username: msg.senderName,
                    profileUrl: encodeURIComponent(msg.profileUrl),
                    role: (currentUser.role === 'mentor' ? 'student' : 'mentor')
                },
                });
                Toast.hide();
            },
            });
        }
        });
      unsubMessages.push(unsubMsg);
    });
  });

  return () => {
    unsubRooms(); 
    unsubMessages.forEach((fn) => fn()); 
    
  };
}, [activeRoomId, currentUser?.userId]);

  return (
    <ChatContext.Provider value={{ activeRoomId, setActiveRoomId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used inside ChatContextProvider');
  return context;
};
