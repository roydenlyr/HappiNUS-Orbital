import { Pressable, Text, View, StatusBar, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChatList from '../../../../components/ChatList';
import { Loading, LoadingSmile } from '../../../../components/Animation';
import { useUserList } from '../../../../context/userListProvider';
import { useRouter } from 'expo-router';
import { getRoomId } from '../../../../components/common';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { Colors } from '../../../../constants/Colors';


const Chats = () => {

  const {chatUsers} = useUserList();
  const {user, refreshUser} = useAuth();

  const router = useRouter();

  const [activeChats, setActiveChats] = useState([]);
  const [inactiveChats, setInactiveChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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

        if (roomDoc.exists()){
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
    <View className='flex-1' style={{backgroundColor: theme.appBackground}}>
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
                <View style={{backgroundColor: theme.cardBackground}} className='items-center rounded-xl mx-5 py-3 mt-3'>
                  <Text style={{color: theme.text}}  className='px-5 text-center mb-2'>It looks like you haven’t connected with a mentor yet. Find someone to chat with when you’re ready.</Text>
                  <Pressable onPress={() => {router.push('../selectMentor');}}>
                    <Text style={{fontSize: hp(1.8), color: theme.header}} className='font-bold'>Connect with Mentor</Text>
                  </Pressable>
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