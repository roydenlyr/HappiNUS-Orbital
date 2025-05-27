import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import ChatList from '../../../../components/ChatList';
import Loading from '../../../../components/Loading';
import { useUserList } from '../../../../context/userListProvider';


const Chats = () => {

  const {users} = useUserList();
  const {user} = useAuth();

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

export default Chats