import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../../components/HomeHeader'

const StudentLayout = () => {

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
    </Stack>
  )
}
 
export default StudentLayout

