import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import HomeHeader from '../../../../components/HomeHeader'
import { Feather, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { BlurView } from 'expo-blur'
import { Colors } from '../../../../constants/Colors'

const AdminTabLayout = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <Tabs screenOptions={{animation: 'fade', 
      tabBarStyle: {
        backgroundColor: theme.tabBarBackground
      }
    }}>
      <Tabs.Screen name='home' options={{
        header: () => <HomeHeader/>,
        title: 'Home',
        tabBarIcon: ({focused}) => (
          <Ionicons size={hp(2)}
            name={focused? 'home' : 'home-outline'}
            color={focused ? theme.tabBarFocused : theme.tabBarNotFocused}
          />
        ),
        tabBarActiveTintColor: theme.tabBarFocused,
        tabBarInactiveTintColor: theme.tabBarNotFocused
      }} />
      <Tabs.Screen name='mentorList' options={{
        header: () => <HomeHeader/>,
        title: 'Dashboard',
        tabBarIcon: ({focused}) => (
          <Ionicons size={hp(2)} 
            name={focused? 'list' : 'list-outline'} 
            color={focused ? theme.tabBarFocused : theme.tabBarNotFocused}/>
        ),
        tabBarActiveTintColor: theme.tabBarFocused,
        tabBarInactiveTintColor: theme.tabBarNotFocused
      }}/>
    </Tabs>
  )
}

export default AdminTabLayout