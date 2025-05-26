import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import ChatList from '../../../../components/ChatList';
import Loading from '../../../../components/Loading';
import { getDocs, query, where } from 'firebase/firestore';
import { usersRef } from '../../../../firebaseConfig';


const Home = () => {

  return (
    <View>
      <Text>HOME</Text>
    </View>
  )
}

export default Home