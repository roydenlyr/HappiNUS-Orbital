import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AdminLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
        <Stack.Screen name='addMentor' options={{
          title: 'Register Mentor', 
          headerBackTitle: 'back', 
          headerShadowVisible: false,
        }}/>
        <Stack.Screen name='editMentor' options={{
          title: 'Edit Mentor',
          headerBackTitle: 'Dashboard',
          headerShadowVisible: false
        }}/>
    </Stack>
  )
}

export default AdminLayout