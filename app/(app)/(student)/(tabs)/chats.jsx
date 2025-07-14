import { Pressable, Text, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChatList from '../../../../components/ChatList';
import Loading from '../../../../components/Loading';
import { useUserList } from '../../../../context/userListProvider';
import { useRouter } from 'expo-router';
import { getRoomId } from '../../../../components/common';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';


const Chats = () => {

  const {chatUsers} = useUserList();
  const {user} = useAuth();

  const router = useRouter();

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

  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'auto'} />
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
              inactiveChats.length > 0 && (
                <>
                  <Text className='text-center text-lg font-bold mt-3 italic'>Inactive Chats</Text>
                  <ChatList currentUser={user} users={inactiveChats}/>
                </>
              )
            }
            {
              activeChats.length === 0 && (
                <View className='items-center bg-slate-300 rounded-xl mx-5 py-3'>
                  <Text className='px-5 text-center mb-2'>It looks like you haven’t connected with a mentor yet. Find someone to chat with when you’re ready.</Text>
                  <Pressable onPress={() => {router.push('../selectMentor');}}>
                    <Text style={{fontSize: hp(1.8)}} className='font-bold text-indigo-500'>Connect with Mentor</Text>
                  </Pressable>
                </View>
              )
            }
          </View>
        )
      }
    </View>
  )
}

export default Chats