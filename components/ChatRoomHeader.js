import { View, Text, TouchableOpacity, Pressable, Alert, useColorScheme, Platform } from 'react-native'
import React, { use, useEffect, useRef, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AntDesign, Entypo, Feather, FontAwesome, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Image } from 'expo-image';
import { summariseChat } from '../services/summariseChat';
import { rephraseMessage } from '../services/rephraseMessage';
import { Loading, LoadingSmile } from './Animation';
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db, roomRef } from '../firebaseConfig';
import { Colors } from '../constants/Colors';
import ModalAlert from './ModalAlert';

const ChatRoomHeader = ({user, roomId, messages, textRef, inputRef, isActive, chatEndDate, currentUser}) => {

    const [summaryLoading, setSummaryLoading] = useState(false);
    const [rephraseLoading, setRephraseLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const [endChatLoading, setEndChatLoading] = useState(false);
    const [reopenChatLoading, setReopenChatLoading] = useState(false);

    const [rephraseButtonSize, setRephraseButtonSize] = useState({bottom: 15});
    const [summaryButtonSize, setSummaryButtonSize] = useState({bottom: 15});
    const [changeMentorButtonSize, setChangeMentorButtonSize] = useState({bottom: 15});
    const [endChatButtonSize, setEndChatButtonSize] = useState({bottom: 15});
    const [reopenButtonSize, setReopenButtonSize] = useState({bottom: 15});
    const [backButtonSize, setBackButtonSize] = useState({bottom: 15});

    const [header, setHeader] = useState('');
    const [text, setText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const router = useRouter();
    
    const theme = Colors[useColorScheme()] ?? Colors.light;
    
    user.profileUrl = decodeURIComponent(user.profileUrl);

    const handleReopenChat = async () => {
        setReopenChatLoading(true);

        try {
            const q = query(roomRef, 
                where('participants', 'array-contains', currentUser.userId),
                where('active', '==', true)
            );
            const snapShot = await getDocs(q);

            if (!snapShot.empty) {
                Alert.alert('Cannot Reopen', 'You already have an active chat. Please end your current chat before reopening this one.');
                setReopenChatLoading(false);
                return;
            }

            Alert.alert('Reopen Chat', 'Are you sure you want to proceed?', 
                [
                    {
                        text: 'Cancel',
                    },
                    {
                        text: 'Proceed',
                        onPress: () => proceedReopenChat()
                    }
                ],
                {cancelable: true} 
            )
        } catch (error) {
            console.error('Failed to reopen chat: ', error);
            Alert.Alert('Error', 'An error occurred while trying to reopen the chat.');
        } finally {
            setReopenChatLoading(false);
        }
    }

    const proceedReopenChat = async () => {
        await updateDoc(doc(db, 'rooms', roomId), {
            active: true,
            inactiveOn: null
        });

        const messagesRef = collection(db, 'rooms', roomId, 'messages');
        const snapShot = await getDocs(messagesRef);

        const batchDeletions = snapShot.docs.filter(docSnap => {
            const data = docSnap.data();
            return data.subType === 'reopen';
        });

        const deletePromises = batchDeletions.map(docSnap => 
            deleteDoc(doc(db, 'rooms', roomId, 'messages', docSnap.id))
        );

        await Promise.all(deletePromises);

        const now = new Date();        
        const dateString = now.toLocaleString('en-SG', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        await addDoc(collection(db, 'rooms', roomId, 'messages'), {
            text: `Chat reopened on ${dateString}`,
            type: 'system',
            subType: 'reopen',
            createdAt: Timestamp.now(),
            senderName: 'system'
        });

        Alert.alert('Chat Reopened', 'This chat has been reopened successfully');
    }
    
    const handleSummary = async () => {
        if (messages && messages.length > 0){
            setSummaryLoading(true);
            try {
                const summary = await summariseChat(messages, user.userId);
                setHeader('Summary');
                setText(summary);
                setModalVisible(true);
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
                setHeader('Rephrased');
                setText(rephrased);
                setModalVisible(true);
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
        setEndChatLoading(true);
        const warn = user?.deleted ? 'This chat history can’t be reopened or transferred once you proceed. To preserve it, please select a new mentor' : 'This action is permanent and cannot be undone.';
        Alert.alert('End Chat Confirmation', 'Are you sure you want to proceed? \n\n' + warn, [{
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
                } finally {
                    setEndChatLoading(false);
                }
            }
        }]);
        setEndChatLoading(false);
    }

    const handleChangeMentor = async () => {
        setChangeLoading(true);

        const q = query(roomRef, 
            where('participants', 'array-contains', currentUser.userId),
            where('active', '==', true)
        );
        const snapShot = await getDocs(q);

        if (!snapShot.empty) {
            Alert.alert('Unable to Transfer', 'You already have an active chat. Please end your current chat before transferring.');
            setChangeLoading(false);
            return;
        }

        Alert.alert('Change Mentor', 'Are you sure you want to proceed?', 
            [{
                text: 'Dismiss',
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
                    prevMentorId: user.userId
                }
            });
        } catch (error) {
            console.error('Mentor change failed: ', error);
            Alert.alert('Error', 'Unable to initiate mentor change.');
        }
    }

    const generateHitSlopLayoutHandler = (setState) => (event) => {
        const {height} = event.nativeEvent.layout;
        const size = {
            bottom: height
        };
        setState(size);
    }

    const setHitSlop = (state) => {
        return Platform.OS === 'android' ? state : undefined
    }

  return (
    <>
    <Stack.Screen 
        options={{
            title: '', 
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: theme.chatRoomHeaderBackground,
            },
            headerLeft: () => (
                <View className='flex-row items-center gap-3 -ml-3'>
                    <TouchableOpacity
                    onPress={() => {                        
                        if (user.role === 'mentor') {
                            router.navigate('/(student)/(tabs)/chats');
                        } else {
                            router.navigate('/(mentor)/(tabs)/chats');
                        }
                    }}
                    onLayout={generateHitSlopLayoutHandler(setBackButtonSize)}
                    hitSlop={setHitSlop(backButtonSize)}
                    >
                        <Ionicons name='chevron-back-sharp' size={hp(3)} color={theme.icon} />
                    </TouchableOpacity>
                    <View className='flex-row items-center gap-3'>
                        <Image source={{uri: user.profileUrl}} style={{height: hp(4.5), aspectRatio: 1, borderRadius: 100}} />

                        <Text style={{fontSize: hp(2.5), color: theme.text}} className='font-medium'>
                            {user?.username}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => {

                if (user?.role === 'student') {
                    return (
                        <View className='flex-row items-center gap-8'>
                            {
                                rephraseLoading || summaryLoading ? (
                                    <LoadingSmile size={hp(8)}/>
                                ) : (
                                    <>
                                        {
                                            isActive && (
                                                <TouchableOpacity onPress={handleRephrase} disabled={rephraseLoading}
                                                    onLayout={generateHitSlopLayoutHandler(setRephraseButtonSize)}
                                                    hitSlop={setHitSlop(rephraseButtonSize)}
                                                >
                                                    <FontAwesome name='stack-exchange' size={hp(2.8)} color={theme.icon}/>
                                                </TouchableOpacity>
                                            )
                                        }
                                        
                                        <TouchableOpacity onPress={handleSummary} disabled={summaryLoading}
                                            onLayout={generateHitSlopLayoutHandler(setSummaryButtonSize)}
                                            hitSlop={setHitSlop(summaryButtonSize)}
                                        >
                                            <Feather name='clipboard' size={hp(2.8)} color={theme.icon}/>
                                        </TouchableOpacity>
                                    </>
                                )
                            }
                        </View>
                    )
                }
                
                if (!isActive && chatEndDate && !user?.deleted) {
                    return (
                        <TouchableOpacity onPress={handleReopenChat} disabled={reopenChatLoading} className='self-end'
                            onLayout={generateHitSlopLayoutHandler(setReopenButtonSize)}
                            hitSlop={setHitSlop(reopenButtonSize)}
                        >
                            {
                                reopenChatLoading ? (
                                    <LoadingSmile size={hp(8)}/>
                                ) : (
                                    <Ionicons name='chatbubble-outline' size={hp(2.8)} color={theme.icon}/>
                                )
                            }
                        </TouchableOpacity>
                    )                    
                }

                if (isActive || (user?.deleted && !isActive && chatEndDate === undefined)) {
                    return (
                        <View className='flex-row items-center gap-8'>
                            {
                                changeLoading || endChatLoading ? (
                                    <LoadingSmile size={hp(8)}/>
                                ) : (
                                    <>
                                        <TouchableOpacity onPress={handleChangeMentor} disabled={changeLoading}
                                            onLayout={generateHitSlopLayoutHandler(setChangeMentorButtonSize)}
                                            hitSlop={setHitSlop(changeMentorButtonSize)}
                                        >
                                            <MaterialIcons name='switch-account' size={hp(2.8)}  color={theme.icon}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleEndChat} disabled={endChatLoading}
                                            onLayout={generateHitSlopLayoutHandler(setEndChatButtonSize)}
                                            hitSlop={setHitSlop(endChatButtonSize)}
                                        >
                                            <Octicons name='x-circle' size={hp(2.8)}  color={theme.icon}/>
                                        </TouchableOpacity>
                                    </> 
                                )
                            }
                        </View>
                    )
                }
            }
    }} />
    <ModalAlert 
        isVisible={modalVisible}
        header={header}
        text={text}
        onClose={() => setModalVisible(false)}
        theme={theme}
        onUse={() => {
            textRef.current = text;
            if (inputRef?.current){
                inputRef.current.setNativeProps({text: text});
            }
            setModalVisible(false);
        }}
    />
    </>
  )
}

export default ChatRoomHeader