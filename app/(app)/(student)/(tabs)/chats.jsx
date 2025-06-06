import { Pressable, Text, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import ChatList from '../../../../components/ChatList';
import Loading from '../../../../components/Loading';
import { useUserList } from '../../../../context/userListProvider';
import { useRouter } from 'expo-router';


const Chats = () => {

  const {chatUsers} = useUserList();
  const {user} = useAuth();

  const router = useRouter();

  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'auto'} />
      {
        chatUsers.length > 0 ? (
          <ChatList currentUser={user} users={chatUsers} />
        ) : (
          <View className='flex items-center' style={{top: hp(30)}}>
            {/* <ActivityIndicator size='large'/> */}
            {/* <Loading size={hp(15)} /> */}
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

export default Chats