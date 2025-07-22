import { View, Text, FlatList, useColorScheme, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { CONTACTS } from '../../../constants/Contacts'
import { Colors } from '../../../constants/Colors'
import { Poppins_200ExtraLight_Italic, Poppins_300Light, Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons'

const Contacts = () => {

  const theme = Colors[useColorScheme()] ?? Colors.light;

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
    })
  }

  return (
    <View style={{backgroundColor: theme.appBackground, flex: 1}}>
      <FlatList
        data={CONTACTS}
        keyExtractor={item => item.category}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(5)}}
        renderItem={({item}) => (
          <View className='px-5'>
            <Text style={{fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), fontSize: hp(2), color: theme.header}} className='self-center mt-3'>{item.category}</Text>
            {
              item.contacts.map((contact, index) => (
                <View key={index} style={{backgroundColor: theme.cardBackground}} className='rounded-3xl my-1'>
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
                    <View className='justify-center items-center'>
                      <TouchableOpacity onPress={() => handleCall(contact.number)} className='flex-row justify-center items-center gap-2 p-2'>
                        <Ionicons name='call-sharp' color={theme.icon} size={hp(1.5)}/>
                        <Text style={{color: theme.bodyText}}>{contact.number}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        )}
      />
    </View>
  )
}

export default Contacts