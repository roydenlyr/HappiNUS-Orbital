import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ImageBackground } from 'expo-image'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Poppins_400Regular, useFonts } from '@expo-google-fonts/poppins';

const TitleCard = ({selection, onPress}) => {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular
  })

  return (
    <TouchableOpacity onPress={onPress} className='justify-center items-center mt-3'>
      <ImageBackground source={{uri: selection.wallpaper}} style={{height: hp(22), width: wp(90), resizeMode: 'cover', overflow: 'hidden'}} imageStyle={{borderRadius: 20}}>
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20}} className='justify-center items-center gap-3'>
          <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), fontSize: hp(2.3)}} className='text-center text-white px-2'>{selection.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default TitleCard