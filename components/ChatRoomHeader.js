import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { summariseChat } from '../services/summariseChat';

const ChatRoomHeader = ({user, router, messages}) => {

    const handleSummary = async () => {
        if (messages){
            try {
                const summary = await summariseChat(messages, user.userId);
                console.log('Summary: ', summary);
            } catch (error) {
                console.error('Failed to summarise: ', error.message);
            }
        } else{
            
        }
    }

  return (
    <Stack.Screen 
        options={{
            title: '', 
            headerShadowVisible: false,
            headerLeft: () => (
                <View className='flex-row items-center gap-4'>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Entypo name='chevron-left' size={hp(4)} color='#737373' />
                    </TouchableOpacity>
                    <View className='flex-row items-center gap-3'>
                        <Image source={user?.profileUrl} style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}} />

                        <Text style={{fontSize: hp(2.5)}} className='text-neutral-700 font-medium'>
                            {user?.username}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: user?.role === 'student' ? () => (
                <View className='flex-row items-center gap-8'>
                    <FontAwesome name='stack-exchange' size={hp(2.8)} color={'#737373'}/>
                    <Pressable onPress={handleSummary}>
                        <Feather name='clipboard' size={hp(2.8)} color={'#737373'}/>
                    </Pressable>
                </View>
            ) : undefined
    }} />
  )
}

export default ChatRoomHeader