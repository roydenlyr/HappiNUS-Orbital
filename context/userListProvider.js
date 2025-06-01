import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db, roomRef, usersRef } from '../firebaseConfig';
import { useAuth } from './authContext';

const UserListContext = createContext();

export const UserListProvider = ({ children }) => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);

  useEffect(() => {
  if (!user?.uid) return;

  const q = query(usersRef, where('userId', '!=', user.uid));

  const unsub = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data());
    const mentors = users.filter(user => user.role === 'mentor');
    setMentors(mentors);
  });

  return () => unsub();
}, [user]);

  useEffect(() => {
  if (!user?.uid) return;

  const q = query(roomRef, where('participants', 'array-contains', user.uid));

  const unsub = onSnapshot(q, async (snapshot) => {
    const rooms = snapshot.docs.map(doc => doc.data());

    const getOtherUserId = (participants, currentUserId) =>
      participants.find(id => id !== currentUserId);

    const otherUserIds = rooms.map(room => getOtherUserId(room.participants, user.uid));

    const usersProfiles = await Promise.all(
      otherUserIds.map(async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        return userDoc.exists() ? userDoc.data() : null;
      })
    );

    setChatUsers(usersProfiles.filter(Boolean));
  });

  return () => unsub();
}, [user]);


  return (
    <UserListContext.Provider value={{ mentors, chatUsers }}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserList = () => {
  const context = useContext(UserListContext);
  if (!context) {
    throw new Error('useUserList must be used within a UserListProvider');
  }
  return context;
};
