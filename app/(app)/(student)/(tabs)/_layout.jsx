import { StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import HomeHeader from '../../../../components/HomeHeader'
import { Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../../../context/authContext'
import { getDocs, query, where } from 'firebase/firestore'
import { usersRef } from '../../../../firebaseConfig'


const StudentTabLayout = () => {
  return (
    <>
        <Tabs screenOptions={{animation: 'fade'}}>
            <Tabs.Screen name='home' options={{
                header: () => <HomeHeader/>,
                title: 'Home',
                tabBarIcon: ({focused}) => (
                    <Ionicons size={hp(2)} 
                    name={focused? 'home' : 'home-outline'}
                    color={'#6366F1'}
                    />
                )
            }} />
            <Tabs.Screen name='chats' options={{ title: 'Chat', header: () => <HomeHeader/>, tabBarIcon: ({focused}) => (
                <Ionicons size={hp(2)} 
                name={focused? 'chatbubble' : 'chatbubble-outline'}
                color={'#6366F1'}
                />
            )
            }} />
        </Tabs>
        <StatusBar barStyle={'auto'}/>
    </>
  )
}

export default StudentTabLayout