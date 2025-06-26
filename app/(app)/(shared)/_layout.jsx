import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '../../../context/authContext';
import { Entypo } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const SharedLayout = () => {

  const router = useRouter();
  const {user} = useAuth();

  const goBackHome = () => {
   if (user.role === 'student')
        router.replace('/(app)/(student)/(tabs)/home');
      else if (user.role === 'mentor')
        router.replace('/(app)/(mentor)/(tabs)/home');
      else if (user.role === 'admin')
        router.replace('/(app)/(admin)/(tabs)/home');
  }

  return (
    <Stack>
        <Stack.Screen name='profile' 
        options={{
          title: 'Edit Profile', 
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={goBackHome}>
              <View className='flex-row'>
                <Entypo name='chevron-left' size={hp(2.5)} color={'black'}/>
                <Text className='font-semibold' style={{fontSize: hp(2.3)}}>back</Text>
              </View>
            </TouchableOpacity>
          ),
          }}/>
    </Stack>
  )
}

export default SharedLayout