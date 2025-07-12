import { View, Text } from 'react-native'
import React from 'react'
import { Stack, Tabs } from 'expo-router'
import HomeHeader from '../../../../components/HomeHeader'
import { Feather, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const AdminTabLayout = () => {
  return (
    <Tabs screenOptions={{animation: 'fade'}}>
      <Tabs.Screen name='home' options={{
        header: () => <HomeHeader/>,
        title: 'Home',
        tabBarIcon: ({focused}) => (
          <Ionicons size={hp(2)}
            name={focused? 'home' : 'home-outline'}
            color={'#6366F1'}
          />
        )}} />
      <Tabs.Screen name='mentorList' options={{
        header: () => <HomeHeader/>,
        title: 'Dashboard',
        tabBarIcon: ({focused}) => (
          <Ionicons size={hp(2)} name={focused? 'list' : 'list-outline'} color={'#6366F1'}/>
        )
      }}/>
    </Tabs>
  )
}

export default AdminTabLayout