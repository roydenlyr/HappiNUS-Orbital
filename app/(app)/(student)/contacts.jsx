import { View, Text, FlatList, useColorScheme, TouchableOpacity, Linking, Platform, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { CONTACTS } from '../../../constants/Contacts'
import { Colors } from '../../../constants/Colors'
import { Poppins_200ExtraLight_Italic, Poppins_300Light, Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons'



const Contacts = () => {

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const [callButtonSize, setCallButtonSize] = useState({});

  let globalIndex = 0;

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_200ExtraLight_Italic
  })

  const handleCall = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch(error => {
      console.error('Error opening dialer', error);
    });
  }


  const handleCall1 = (number) => {
  try {
    if (!number) {
      Alert.alert('Invalid Number', 'No number provided.');
      return;
    }

    // Clean the number: remove spaces, dashes, brackets, etc.
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    const phoneURL = Platform.OS === 'android' ? `tel:${cleanNumber}` : `telprompt:${cleanNumber}`;

    Linking.canOpenURL(phoneURL)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Calling is not supported on this device.');
        } else {
          return Linking.openURL(phoneURL);
        }
      })
      .catch((err) => {
        console.error('Error opening dialer:', err);
        Alert.alert('Error', 'Could not open the phone dialer.');
      });
  } catch (err) {
    console.error('Unexpected call error:', err);
    Alert.alert('Error', 'Something went wrong while trying to call.');
  }
};


  return (
    <View style={{backgroundColor: theme.appBackground, flex: 1}}>
      <FlatList
        data={CONTACTS}
        keyExtractor={item => item.category}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(5)}}
        renderItem={({item, idx}) => (
          <View className='px-5'>
            <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}} className='self-center mt-3'>{item.category}</Text>
            {              
              item.contacts.map((contact) => {
                const currentIndex = globalIndex;
                globalIndex++;

                return (
                <View key={currentIndex} style={{backgroundColor: theme.cardBackground}} className='rounded-3xl my-1'>
                  <View className='flex-row p-3 gap-5'>
                    {/* Left Column */}
                    <View className='flex-1'>
                      <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium' : undefined), color: theme.bodyText, fontSize: hp(1.5)}}>{contact.name}</Text>
                      <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light' : undefined), color: theme.bodyText, fontSize: hp(1.5)}}>{contact.description}</Text>
                      {
                        contact.hours && (
                          <View className='mt-2'>
                            {
                              contact.hours?.map((line, idx) => (
                                <Text key={idx} style={{fontFamily: (fontsLoaded ? 'Poppins_200ExtraLight_Italic' : undefined), color: theme.bodyText}}>{line}</Text>
                              ))
                            }
                          </View>
                        )
                      }
                    </View>
                    {/* Right Column */}
                    <View className='justify-center items-center'
                      onLayout={(event) => 
                        {
                          const {height} = event.nativeEvent.layout; 
                          const size = {
                            bottom: height
                          };
                          setCallButtonSize((prev) => ({...prev, [currentIndex]: size}))
                        }
                      }
                    >
                    <TouchableOpacity onPress={() => handleCall(contact.number)} className='flex-row justify-center items-center gap-2 p-5'
                      hitSlop={Platform.OS === 'android' ? callButtonSize[currentIndex] : undefined}
                    >
                      <Ionicons name='call-sharp' color={theme.icon} size={hp(1.5)}/>
                      <Text style={{color: theme.bodyText}}>{contact.number}</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </View>
                )
              })
            }
          </View>
        )}
      />
    </View>
  )
}

export default Contacts