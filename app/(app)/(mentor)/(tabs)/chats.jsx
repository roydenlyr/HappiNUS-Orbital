import { Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import ChatList from '../../../../components/ChatList';
import { Loading, LoadingSmile, Sloth } from '../../../../components/Animation';
import { useUserList } from '../../../../context/userListProvider';
import { getRoomId } from '../../../../components/common';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { Colors } from '../../../../constants/Colors';

const Chats = () => {

  const {chatUsers} = useUserList();
  const {user, refreshUser} = useAuth();

  const [activeChats, setActiveChats] = useState([]);
  const [inactiveChats, setInactiveChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const theme = Colors[useColorScheme()] ?? Colors.light;

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
    refreshUser();
  }, []);


  return (
    <View style={{backgroundColor: theme.appBackground}} className='flex-1'>
      {
        loadingChats ? (
          <View className='flex-1 justify-center items-center'>
            <LoadingSmile size={hp(15)} />
          </View>
        ) : (
          <View>
            {activeChats.length > 0 && (
              <>
                <Text style={{color: theme.text}} className='text-center text-lg font-bold mt-3 italic'>Active Chats</Text>
                <ChatList currentUser={user} users={activeChats}/>
              </>
            )}
            {
              activeChats.length === 0 && (
                <View className='items-center justify-center'>
                  <Text style={{backgroundColor: theme.cardBackground, color: theme.text}} className='bg-slate-300 py-2 px-4 rounded-xl mt-2'>You have not been assigned any students...</Text>
                  <Sloth size={hp(20)}/>
                </View>
              )
            }
            {
              inactiveChats.length > 0 && (
                <>
                  <Text style={{color: theme.text}} className='text-center text-lg font-bold mt-3 italic'>Inactive Chats</Text>
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