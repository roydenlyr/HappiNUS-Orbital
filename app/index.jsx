import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';
import { Loading, LoadingSmile } from '../components/Animation';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const StartPage = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <LoadingSmile size={hp(20)}/>
    </View>
  )
}

export default StartPage
