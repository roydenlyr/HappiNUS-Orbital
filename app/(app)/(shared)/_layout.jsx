import { View, Text, TouchableOpacity, useColorScheme, Alert } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '../../../context/authContext';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Colors } from '../../../constants/Colors';

const SharedLayout = () => {

  const router = useRouter();
  const {user, logout} = useAuth();

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const goBackHome = () => {
   if (user.role === 'student')
        router.replace('/(app)/(student)/(tabs)/home');
      else if (user.role === 'mentor')
        router.replace('/(app)/(mentor)/(tabs)/home');
      else if (user.role === 'admin')
        router.replace('/(app)/(admin)/(tabs)/home');
  }

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Confirm sign out?',
      [
      {
          text: 'Cancel',
          style: 'cancel',
      },
      {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
          await logout();
          },
      },
      ],
      { cancelable: true }
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: theme.homeHeaderBackground},
        headerTintColor: theme.header
      }}
    >
        <Stack.Screen name='profile' 
        options={{
          title: 'Edit Profile', 
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          headerLeft: () => (
            <TouchableOpacity onPress={goBackHome}>
              <Ionicons name='home' size={hp(2.3)} color={theme.header} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout}>
              <AntDesign name='logout' size={hp(2.3)} color={theme.header} />
            </TouchableOpacity>
          )
          }}/>
    </Stack>
  )
}

export default SharedLayout