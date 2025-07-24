import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './authContext';
import { useRouter } from 'expo-router';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db, roomRef } from '@/firebaseConfig';
import Toast from 'react-native-toast-message';
import { useUserList } from './userListProvider';

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [activeRoomId, setActiveRoomId] = useState(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const {chatUsers} = useUserList();

  const extractOtherUserId = (roomId, currentUserId) => {
    const ids = roomId.split('-');
    return ids.find(id => id !== currentUserId);
  }

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

        if (!msg || msg.userId === currentUser.userId || msg.notificationSent || msg?.delete === currentUser.userId) return;

        const roomData = roomDoc.data();
        const lastSeen = roomData?.lastSeen?.[currentUser.userId]?.toMillis?.();

        if (msg.createdAt?.toMillis() > lastSeen) {

            const messageDocRef = doc(db, 'rooms', roomId, 'messages', msgId);
            await updateDoc(messageDocRef, { notificationSent: true });

            const otherUserId = extractOtherUserId(roomId, currentUser.userId);
            const otherUser = chatUsers.find(user => user.userId === otherUserId) || {
              userId: otherUserId,
              username: 'Account Deleted',
              profileUrl: (
                currentUser.role === 'mentor' ?
                  'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile2.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23' :
                  'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23'
              )
            }

            Toast.show({
            type: 'customAlert',
            text1: `New message from ${msg.senderName}`,
            text2: msg.text,
            position: 'top',
            props: {
              type: 'info',
            },
            onPress: () => {
                router.push({
                pathname: '/chatRoom',
                params: {
                    userId: (msg.senderName === 'system' ? otherUserId : msg.userId),
                    username: (msg.senderName === 'system' ? otherUser.username : msg.senderName),
                    profileUrl: encodeURIComponent(msg.senderName === 'system' ? otherUser.profileUrl : msg.profileUrl),
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
