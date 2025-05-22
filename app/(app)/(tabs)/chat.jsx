import { StatusBar } from 'expo-status-bar';
import { getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../../../components/ChatList';
import Loading from '../../../components/Loading';
import { useAuth } from '../../../context/authContext';
import { usersRef } from '../../../firebaseConfig';

const Chat = () => { 

  const {logout, user} = useAuth();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if(user?.uid)
      getUsers();
  }, [])
  const getUsers = async () => {
    // Fetch users
    const q = query(usersRef, where('userId', '!=', user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach(doc => {
      data.push({...doc.data()});
    });
    setUsers(data);
  }

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='light' />
      {
        users.length > 0 ? (
          <ChatList currentUser={user} users={users} />
        ) : (
          <View className='flex items-center' style={{top: hp(30)}}>
            {/* <ActivityIndicator size='large'/> */}
            <Loading size={hp(15)} />
          </View>
        )
      }
    </View>
  )
}

export default Chat