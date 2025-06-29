import { View, Text, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { summariseChat } from '../services/summariseChat';
import { rephraseMessage } from '../services/rephraseMessage';
import Loading from './Loading';

const ChatRoomHeader = ({user, router, messages, textRef, inputRef}) => {

    const [summaryLoading, setSummaryLoading] = useState(false);
    const [rephraseLoading, setRephraseLoading] = useState(false);
    
    user.profileUrl = decodeURIComponent(user.profileUrl);
    
    const handleSummary = async () => {
        
        if (messages && messages.length > 0){
            setSummaryLoading(true);
            try {
                const summary = await summariseChat(messages, user.userId);
                console.log('Summary: ', summary);
                Alert.alert('Summary', summary);
            } catch (error) {
                console.error('Failed to summarise: ', error.message);
                Alert.alert('Error', 'Failed to summarise chat. Please try again.');
            } finally {
                setSummaryLoading(false);
            }
        } else{
            Alert.alert('Summary Failed', 'No messages to summarise');
        }
    }

    const handleRephrase = async () => {
        if (textRef.current && textRef.current.trim() !== ''){
            setRephraseLoading(true);
            try {
                const rephrased = await rephraseMessage(textRef.current);
                console.log('Rephrased text: ', rephrased);
                Alert.alert('Rephrased', rephrased,
                    [{
                        text: 'Dismiss',
                        style: 'cancel'
                    },
                    {
                        text: 'Use',
                        onPress: () => {
                            textRef.current = rephrased;
                            if (inputRef?.current){
                                inputRef.current.setNativeProps({text: rephrased});
                            }
                        }
                }],
                {cancelable: true}
                );
            } catch (error) {
                console.error('Failed to rephrase: ', error.message);
                Alert.alert('Error', 'Failed to rephrase text. Please try again.');
            } finally {
                setRephraseLoading(false);
            }
        } else{
            Alert.alert('Rephrasing Failed', 'Please type a message first.');
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
                        <Image source={{uri: user.profileUrl}} style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}} />

                        <Text style={{fontSize: hp(2.5)}} className='text-neutral-700 font-medium'>
                            {user?.username}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: user?.role === 'student' ? () => (
                <View className='flex-row items-center gap-8'>
                    <Pressable onPress={handleRephrase}>
                        {
                            rephraseLoading ? (
                                <Loading size={hp(5)}/>
                            ) : (
                                <FontAwesome name='stack-exchange' size={hp(2.8)} color={'#737373'}/>
                            )
                        }
                    </Pressable>
                    <Pressable onPress={handleSummary} disabled={summaryLoading}>
                        {
                            summaryLoading ? (
                                <Loading size={hp(5)}/>
                            ) : (
                                <Feather name='clipboard' size={hp(2.8)} color={'#737373'}/>
                            )
                        }
                    </Pressable>
                </View>
            ) : undefined
    }} />
  )
}

export default ChatRoomHeader