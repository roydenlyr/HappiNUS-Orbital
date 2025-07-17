import { StatusBar, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs } from 'expo-router'
import HomeHeader from '../../../../components/HomeHeader'
import { Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Colors } from '../../../../constants/Colors'

const StudentTabLayout = () => {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <>
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
            <Tabs.Screen name='chats' options={{ title: 'Chat', header: () => <HomeHeader/>, tabBarIcon: ({focused}) => (
                <Ionicons size={hp(2)} 
                name={focused? 'chatbubble' : 'chatbubble-outline'}
                color={focused ? theme.tabBarFocused : theme.tabBarNotFocused}
                />
            ),
            tabBarActiveTintColor: theme.tabBarFocused,
            tabBarInactiveTintColor: theme.tabBarNotFocused
            }} />
        </Tabs>
        <StatusBar barStyle={'auto'}/>
    </>
  )
}

export default StudentTabLayout