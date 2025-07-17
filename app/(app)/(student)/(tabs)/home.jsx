import { View, Text, Alert, ScrollView, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { Colors } from '../../../../constants/Colors';
import { Sloth } from '../../../../components/Animation';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold_Italic, Poppins_600SemiBold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { ImageBackground } from 'expo-image';
import { AntDesign, Feather } from '@expo/vector-icons';

const Home = () => {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const { user, refreshUser } = useAuth();
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [picture, setPicture] = useState('');

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold_Italic,
    Poppins_600SemiBold,
    Poppins_500Medium
  });

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

      const ref = doc(db, 'quotes', dayOfYear.toString());
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()){
        setQuote('At the end of the day, the day ends. - LAWD');
        return;
      }
      const quote = snapshot.data();
      setQuote(quote.text);
    } catch (error) {
      console.error('Failed to retrieve quote: ', error);
      setQuote('Askinf for help is a brave step toward healing.')
    }
  }

  const retrieveDisneyQuotes = async () => {
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today - start;
      let dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) % 74;
      
      if (dayOfYear === 0) {
        dayOfYear = 74;
      }
      const ref = doc(db, 'disney_quotes', dayOfYear.toString());
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()){
        setQuote('At the end of the day, the day ends. - LAWD');
        return;
      }
      const quote = snapshot.data();
      setQuote(quote.text);
      setAuthor(quote.author);
      setPicture(quote.picture);
      
    } catch (error) {
      console.error('Failed to retrieve quote: ', error);
      setQuote('Asking for help is a brave step toward healing.')
    }
  }


  useEffect(() => {
    refreshUser();
    // callUploadQuotes();
    // retrieveQuote();
    retrieveDisneyQuotes();
  }, []);

  return (
    <View style={{backgroundColor: theme.appBackground}} className='items-center pt-5  flex-1'>
    <View className='items-center self-center' style={{width: wp(90)}}>
      {/* <View className='justify-center items-center mb-5'> */}
        <ImageBackground source={{uri: picture}} style={{height: hp(20), width: wp(90), resizeMode: 'cover', overflow: 'hidden'}} imageStyle={{borderRadius: 20}}>
          <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20}} className='justify-center items-center gap-3'>
            <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), fontSize: hp(2.3)}} className='text-center text-white px-2'>{quote}</Text>
            <Text style={{fontSize: hp(1.4)}} className='font-semibold text-white'>{author}</Text>
          </View>
        </ImageBackground>
      {/* </View> */}
      <View className='flex-row justify-center mt-3'>
        <View className='-ml-6'>
          <Sloth size={hp(20)}/>
        </View>
        
        <View className='flex-1 justify-center items-center gap-5 -ml-6'>
          <TouchableOpacity style={{backgroundColor: theme.button, height: hp(5)}} className='rounded-3xl justify-center items-center w-full'>
            <View className='flex-row justify-center items-center gap-3'>
              <Feather name='info' size={hp(2.3)} color={'white'}/> 
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium': undefined), fontSize: hp(2.3)}} className='text-white'>Resources</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: theme.button, height: hp(5)}} className='rounded-3xl justify-center items-center w-full'>
            <View className='flex-row justify-center items-center gap-3'>
              <AntDesign name='contacts' size={hp(2.3)} color={'white'}/>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium': undefined), fontSize: hp(2.3)}} className='text-white'>Contacts</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
    </View>
    </View>
  )
}

export default Home