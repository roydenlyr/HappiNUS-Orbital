import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AdminLayout = () => {
  return (
    <Stack>
        <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
    </Stack>
  )
}

export default AdminLayout