import { Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../../components/HomeHeader'
import { Searchbar } from 'react-native-paper'
import { Colors } from '../../../constants/Colors'

const StudentLayout = () => {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Stack 
      screenOptions={{
        headerStyle: {backgroundColor: theme.homeHeaderBackground,},
        headerTintColor: theme.header
        }}>
      <Stack.Screen name='(tabs)' options={{headerShown: false, title: 'Chats'}}/>
      <Stack.Screen name='selectMentor' options={{title: ''}}/>
      <Stack.Screen name='GAD' options={{title: 'Anxiety Self-Assessment Tool', headerBackTitle: 'Back', headerShadowVisible: false}}/>
      <Stack.Screen name='PHQ' options={{title: 'Depression Self-Assessment Tool', headerBackTitle: 'Back', headerShadowVisible: false}}/>
    </Stack>
  )
}
 
export default StudentLayout

