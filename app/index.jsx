import { ActivityIndicator, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router';

const StartPage = () => {
  return (
    <View className="flex-1 justify-center align-middle">
      <ActivityIndicator size={'large'} color={'gray'} />
    </View>
  )
}

export default StartPage
