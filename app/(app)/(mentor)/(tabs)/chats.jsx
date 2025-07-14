import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import ChatList from '../../../../components/ChatList';
import Loading from '../../../../components/Loading';
import { useUserList } from '../../../../context/userListProvider';
import { getRoomId } from '../../../../components/common';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';


const Chats = () => {

  const {chatUsers} = useUserList();
  const {user} = useAuth();

  const [activeChats, setActiveChats] = useState([]);
  const [inactiveChats, setInactiveChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    const fetchChatStatus = async () => {
      if (chatUsers.length === 0) {
        setLoadingChats(false);
        return;
      }

      const active = [];
      const inactive = [];

      for (const chatUser of chatUsers) {
        const roomId = getRoomId(user.userId, chatUser.userId);
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));

        if (roomDoc.exists()) {
          const roomData = roomDoc.data();
          if (roomData.active) {
            active.push(chatUser);
          } else {
            inactive.push(chatUser);
          }
        }
      }
      setActiveChats(active);
      setInactiveChats(inactive);
      setLoadingChats(false);      
    };
    fetchChatStatus();
  }, [chatUsers]);

  useEffect(() => {
    console.log('Active: ', activeChats);
  }, [activeChats]);

  useEffect(() => {
    console.log('Inactive: ', inactiveChats);
  }, [inactiveChats]);

  return (
    <View className='flex-1 bg-white'>
      <StatusBar style='light' />
      {
        loadingChats ? (
          <Loading size={hp(15)} />
        ) : (
          <View>
            {activeChats.length > 0 && (
              <>
                <Text className='text-center text-lg font-bold mt-3 italic'>Active Chats</Text>
                <ChatList currentUser={user} users={activeChats}/>
              </>
            )}
            {
              activeChats.length === 0 && (
                <View className='items-center'>
                  <Text className='bg-slate-300 py-2 px-4 rounded-xl mt-2'>You have not been assigned any students...</Text>
                </View>
              )
            }
            {
              inactiveChats.length > 0 && (
                <>
                  <Text className='text-center text-lg font-bold mt-3 italic'>Inactive Chats</Text>
                  <ChatList currentUser={user} users={inactiveChats}/>
                </>
              )
            }
            
          </View>
        )
      }
    </View>
  )
}

export default Chats