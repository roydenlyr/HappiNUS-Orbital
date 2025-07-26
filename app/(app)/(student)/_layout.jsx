import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import HomeHeader from '../../../components/HomeHeader'
import { Searchbar } from 'react-native-paper'
import { Colors } from '../../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const StudentLayout = () => {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Stack 
      screenOptions={{
        headerStyle: {backgroundColor: theme.homeHeaderBackground,},
        headerTintColor: theme.header,
        headerTitleAlign: 'center',
        }}>
      <Stack.Screen name='(tabs)' options={{headerShown: false, title: ''}}/>
      <Stack.Screen name='selectMentor' options={{title: 'Choose Your Mentor'}}/>
      <Stack.Screen name='GAD' options={{title: 'Anxiety Self-Assessment Tool', headerBackTitle: 'Back', headerShadowVisible: false}}/>
      <Stack.Screen name='PHQ' options={{title: 'Depression Self-Assessment Tool', headerBackTitle: 'Back', headerShadowVisible: false}}/>
      <Stack.Screen name='resources' options={{title: 'Resources', headerBackTitle: 'Back', headerShadowVisible: false}}/>
      <Stack.Screen name='contacts' options={{title: 'Contacts', headerBackTitle: 'Back', headerShadowVisible: false}}/>
    </Stack>
  )
}
 
export default StudentLayout

