import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'

const AdminTabLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name='home' options={{headerShown: false}} />
      <Tabs.Screen name='addMentor' options={{headerShown: false}} />
    </Tabs>
  )
}

export default AdminTabLayout