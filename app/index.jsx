import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';
import Loading from '../components/Loading';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const StartPage = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Loading size={hp(10)}/>
    </View>
  )
}

export default StartPage
