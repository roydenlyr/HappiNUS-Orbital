import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../../constants/Colors'

const AdminLayout = () => {

  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: theme.homeHeaderBackground},
        headerTintColor: theme.header
      }}
    >
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