import { Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import HomeHeader from '../../components/HomeHeader'

const AppLayout = () => {

  return (
    <Stack>
      <Stack.Screen name='home' options={{
        header: () => <HomeHeader />
      }} />
    </Stack>
  )
}
 
export default AppLayout

