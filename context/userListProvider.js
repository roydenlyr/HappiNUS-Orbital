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
        return userDoc.exists() ? userDoc.data() : {
          username: 'Account Deleted',
          userId: uid,
          profileUrl: (
            user.role === 'mentor' ? 
            'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile2.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23' :
            'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23'
          ),
          role: (
            user.role === 'mentor' ? 'student' : 'mentor'
          ),
          deleted: true
        };
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
