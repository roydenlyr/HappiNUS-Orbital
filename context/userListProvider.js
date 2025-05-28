import { createContext, useContext, useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import { roomRef, usersRef } from '../firebaseConfig';
import { useAuth } from './authContext';

const UserListContext = createContext();

export const UserListProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(usersRef, where('userId', '!=', user?.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setUsers(data);
    };

    if (user?.uid) {
      fetchUsers();
    }
  }, [user]);

  return (
    <UserListContext.Provider value={{ users }}>
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
