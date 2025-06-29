import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../../../context/authContext';

const Home = () => {

  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <View className='justify-center items-center flex-1'>
      <Text>Student HOME</Text>
    </View>
  )
}

export default Home