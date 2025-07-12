import { View, Text, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AntDesign, Entypo, Feather, FontAwesome, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { summariseChat } from '../services/summariseChat';
import { rephraseMessage } from '../services/rephraseMessage';
import Loading from './Loading';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ChatRoomHeader = ({user, roomId, messages, textRef, inputRef, isActive, chatEndDate}) => {

    const [summaryLoading, setSummaryLoading] = useState(false);
    const [rephraseLoading, setRephraseLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [endChatLoading, setEndChatLoading] = useState(false);

    const router = useRouter();
    
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

    const handleEndChat = () => {
        // Add a active status for chatroom --> set to false to represent chat closed
        // Add a timestamp for time of end convo
        // Retain chatroom for 3 days from chat end
        // Add a pill saying 'Chat has ended on {inactiveOn}'
        // Once 3 days up, delete chatroom
        setEndChatLoading(true);
        Alert.alert('End Chat Confirmation', 'Are you sure you want to proceed? This action is permanent and cannot be undone.', [{
            text: 'Dismiss',
        }, {
            text: 'Proceed',
            onPress: async () => {
                try {
                    await updateDoc(doc(db, 'rooms', roomId), {
                        active: false,
                        inactiveOn: Timestamp.now()
                    });
                } catch (error) {
                    console.error('End Chat Failed: ', error);
                    Alert.alert('Error', 'Unable to end chat.');
                }
            }
        }]);
    }

    const handleChangeMentor = () => {
        // Does student want to retain message for the next selected mentor to see?
        
        setChangeLoading(true);
        Alert.alert('Change Mentor', 'Are you sure you want to proceed?', 
            [{
                text: 'Dismiss',
                //style: 'cancel'
            },{
                text: 'Proceed',
                onPress: () => {
                    Alert.alert('Keep Chat History', 'Would you like your new mentor to see this chat for better context?', 
                        [{
                            text: 'No', 
                            onPress: () => {
                                proceedWithMentorChange(false);
                            }
                        },{
                            text: 'Yes',
                            onPress: () => {
                                proceedWithMentorChange(true);
                            }
                        }]
                    );
                }
            }], {
                cancelable: true
            }
        );
        setChangeLoading(false);
    }

    const proceedWithMentorChange = async (keepChat) => {
        if (keepChat === null){
            Alert.alert('Failed to change mentor', 'Please try again...');
            return;
        }

        try {
            await updateDoc(doc(db, 'rooms', roomId), {
                active: false,
                inactiveOn: Timestamp.now()
            });

            router.replace({
                pathname: '/(student)/selectMentor',
                params: {
                    fromRoom: roomId,
                    keepChat: keepChat ? 'true' : 'false',
                }
            });
        } catch (error) {
            console.error('Mentor change failed: ', error);
            Alert.alert('Error', 'Unable to initiate mentor change.');
        }
    }

  return (
    <Stack.Screen 
        options={{
            title: '', 
            headerShadowVisible: false,
            headerLeft: () => (
                <View className='flex-row items-center gap-3 -ml-3'>
                    <TouchableOpacity
                    onPress={() => {
                        if (user.role === 'mentor') {
                            router.navigate('/(student)/(tabs)/chats');
                        } else {
                            router.navigate('/(mentor)/(tabs)/chats');
                        }
                    }}>
                        <Entypo name='chevron-left' size={hp(3)} color='#737373' />
                    </TouchableOpacity>
                    <View className='flex-row items-center gap-3'>
                        <Image source={{uri: user.profileUrl}} style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}} />

                        <Text style={{fontSize: hp(2.5)}} className='text-neutral-700 font-medium'>
                            {user?.username}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => {
                if (!isActive && chatEndDate) return null;

                if (user?.role === 'student') {
                return (
                <View className='flex-row items-center gap-8'>
                    <Pressable onPress={handleRephrase} disabled={rephraseLoading}>
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
            ) } else { return (
                <View className='flex-row items-center gap-8'>
                    {/* <Pressable onPress={handleFeedBack}>
                        {
                            <AntDesign name='staro' size={hp(2.8)}  color={'gray'}/>
                        }
                    </Pressable> */}
                    <Pressable onPress={handleChangeMentor} disabled={changeLoading}>
                        {
                            changeLoading ? (
                                <Loading size={hp(5)}/>
                            ) : (
                                <MaterialIcons name='switch-account' size={hp(2.8)}  color={'gray'}/>
                            )
                        }
                    </Pressable>
                    <Pressable onPress={handleEndChat}>
                        {
                            <Octicons name='x-circle' size={hp(2.8)}  color={'gray'}/>
                        }
                    </Pressable>
                </View>
            )}
    }}} />
  )
}

export default ChatRoomHeader