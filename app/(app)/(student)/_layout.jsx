import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../../components/HomeHeader'

const StudentLayout = () => {

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{headerShown: false, title: 'Home'}}/>
      <Stack.Screen name='selectMentor' options={{title: ''}}/>
    </Stack>
  )
}
 
export default StudentLayout

