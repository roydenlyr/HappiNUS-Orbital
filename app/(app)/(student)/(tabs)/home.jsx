import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

const Home = () => {

  const { user, refreshUser } = useAuth();

  const callUploadQuotes = async () => {
    try {
      console.log('Uploading quotes...');
      const response = await fetch('https://us-central1-happinus-ba24a.cloudfunctions.net/uploadQuotes', {
        method: 'POST'
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert('Success', json.message);
      } else {
        Alert.alert('Error', json.message);
      }
    } catch (error) {
      console.error('Failed to upload quotes:', error);
      Alert.alert('Error', error.message || 'An error occurred while uploading quotes.');
    }
  };

  const retrieveQuote = async () => {
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today - start;
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

      const ref = doc(db, 'quotes', 'daily', 'days', dayOfYear.toString());
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()){
        Alert.alert('Quote', `No quote found for day ${dayOfYear}`);
        return;
      }
      const quote = snapshot.data();

      Alert.alert('Daily Quote', `${quote.text}`)
    } catch (error) {
      console.error('Failed to retrieve quote: ', error);
      Alert.alert('Error', 'Could not retrieve quote');
    }
  }


  useEffect(() => {
    refreshUser();
    retrieveQuote();
  }, []);

  return (
    <View className='justify-center items-center flex-1'>
      <Text>Student HOME</Text>
    </View>
  )
}

export default Home