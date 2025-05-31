import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

const Home = () => {

  const router = useRouter();

  return (
    <View>
      <Text>Student HOME</Text>
      <Pressable onPress={() => {router.push('../selectMentor');}}>
        <Text style={{fontSize: hp(1.8)}} className='font-bold text-indigo-500'>Select Mentor</Text>
      </Pressable>
    </View>
  )
}

export default Home