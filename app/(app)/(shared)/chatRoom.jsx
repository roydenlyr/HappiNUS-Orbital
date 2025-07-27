import { View, TextInput, TouchableOpacity, Alert, Keyboard, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../../components/ChatRoomHeader';
import MessageList from '../../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, FontAwesome } from '@expo/vector-icons';
import CustomKeyboardView from '../../../components/CustomKeyboardView'
import {useAuth} from '../../../context/authContext'
import { getRoomId } from '../../../components/common';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useChatContext } from '../../../context/chatContext';
import { Colors } from '../../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatRoom = () => {
    const item = useLocalSearchParams();
    const {user, refreshUser} = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [otherUserLastSeen, setOtherUserLastSeen] = useState(null);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const {setActiveRoomId} = useChatContext();
    const roomId = getRoomId(user?.userId, item?.userId);

    const fromRoom = item?.fromRoom || null;
    const keepChat = item?.keepChat === 'true'; // Convert string to boolean
    const prevMentorId = item?.prevMentorId || null;

    const [isActive, setIsActive] = useState(true);
    const [chatEndDate, setChatEndDate] = useState(null);

    const insets = useSafeAreaInsets();

    const theme = Colors[useColorScheme()] ?? Colors.light;

    useEffect(() => {
        refreshUser();
        createRoomIfNotExists();
        
        setActiveRoomId(roomId);
        const docRef = doc(db, 'rooms', roomId);
        const messagesRef = collection(docRef, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            })
            setMessages([...allMessages]);

            const roomDoc = doc(db, 'rooms', roomId);
            updateDoc(roomDoc, {
                [`lastSeen.${user.userId}`]: serverTimestamp()
                });
                //.catch(err => console.error('(1) Failed to update lastSeen', err));
        });

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', updateScrollView)

        return () => {
            unsub();
            keyboardDidShowListener.remove();
            setActiveRoomId(null);
        }
    }, []);

    useEffect(() => {
        updateScrollView();
    }, [messages])

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({animated: true});
        }, 100)
    }

    const createRoomIfNotExists = async () => {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()){
            await setDoc(doc(db, 'rooms', roomId), {
                roomId,
                createdAt: Timestamp.fromDate(new Date()),
                participants: [user.userId, item.userId],
                lastSeen: {
                    [user.userId]: serverTimestamp(),
                    [item.userId]: serverTimestamp()
                },
                active: true
            });

            await transferChat();
        } else {
            const data = roomSnap.data();

            if (!data.active && fromRoom && keepChat) {
                Alert.alert('Chat Closed', 'This chat has been closed by you previously. Do you want to reopen this chat?', 
                    [
                        {
                            text: 'Select another mentor',
                            onPress: () => {
                                router.replace({
                                    pathname: '/selectMentor',
                                    params: {
                                        fromRoom,
                                        keepChat,
                                        prevMentorId
                                    }
                                })
                            }
                        },
                        {
                            text: 'Reopen',
                            onPress: async () => {await reopenChat();}
                        }
                    ]
                );
            } else if (!data.active && prevMentorId) {
                const roomsRef = collection(db, 'rooms');
                const q = query(roomsRef, 
                    where('participants', 'array-contains', user.userId),
                    where('active', '==', true)
                );
                const snapShot = await getDocs(q);
    
                if (snapShot.empty) {
                    Alert.alert('Chat Closed', 'This chat has been closed by you previously. Do you want to reopen this chat?', 
                    [
                        {
                            text: 'Select another mentor',
                            onPress: () => {
                                router.replace({
                                    pathname: '/selectMentor',
                                    params: {
                                        fromRoom,
                                        keepChat,
                                        prevMentorId
                                    }
                                })
                            }
                        },
                        {
                            text: 'Reopen',
                            onPress: async () => {await reopenChat();}
                        }
                    ]
                );
                    return;
                }
            }
        }
    }

    const reopenChat = async () => {
        await updateDoc(doc(db, 'rooms', roomId), {
            active: true,
            inactiveOn: null
        });

        await transferChat();

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

    const transferChat = async () => {
        if (fromRoom && keepChat) {            
            const oldMessagesSnap = await getDocs(collection(db, 'rooms', fromRoom, 'messages'));
            const batch = writeBatch(db);

            oldMessagesSnap.forEach((message) => {
                const data = message.data();

                if (data?.subType === 'removed' || data?.subType === 'reopen') return;

                const isPrevMentor = data.userId !== item.userId && data.userId !== user.userId;

                batch.set(doc(db, 'rooms', roomId, 'messages', message.id), {
                    ...data,
                    fromPreviousMentor: isPrevMentor
                });
            });

            batch.set(doc(db, 'rooms', roomId, 'messages', 'sys-divider'), {
                text: `This chat has been handed over successfully 😊.${'\n'}This is the beginning of your new chat`,
                type: 'system',
                subType: 'handover',
                createdAt: Timestamp.now(),
                senderName: 'system'
            });

            await batch.commit();
        }
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if(!message) return;
        try{
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messagesRef = collection(docRef, 'messages');
            textRef.current = '';
            if(inputRef){
                inputRef?.current?.clear();
            } 

            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });

        } catch (err){
            Alert.alert('Message',err.message)
        }
    }

    useEffect(() => {
        const roomDoc = doc(db, 'rooms', roomId);

        return () => {
            updateDoc(roomDoc, {
                [`lastSeen.${user.userId}`]: serverTimestamp()
            }).catch(err => console.error('(2) Failed to update lastSeen', err));
        };
    }, []);

    useEffect(() => {
        const roomRef = doc(db, 'rooms', roomId);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const lastSeenTimestamp = data?.lastSeen?.[item?.userId];
                if (lastSeenTimestamp) {
                    setOtherUserLastSeen(lastSeenTimestamp.toDate());
                }
                if (typeof data.active !== 'undefined'){
                    setIsActive(data.active);
                    setChatEndDate(data.inactiveOn);
                }
            }
        });

        return unsubscribe;
    }, []);

  return (
    <CustomKeyboardView inChat={true}>
        <View className='flex-1'>
            <ChatRoomHeader key={user?.activeAlert ?? user.userId} user={{...item, profileUrl: encodeURIComponent(item.profileUrl)}} roomId={roomId} messages={messages} textRef={textRef} inputRef={inputRef} isActive={isActive} chatEndDate={chatEndDate} currentUser={user}/>
            <View style={{backgroundColor: theme.chatRoomBorder}} className='h-0.5 border-b border-neutral-300' />
            <View style={{backgroundColor: theme.chatRoomBackground}} className='flex-1 justify-between overflow-visible'>
                <View className='flex-1'>
                    <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} otherUserId={item?.userId} lastSeen={otherUserLastSeen} isActive={isActive} chatEndDate={chatEndDate} />
                </View>
                {
                    isActive && (
                        <View style={{ paddingBottom: insets.bottom > 0 ? insets.bottom: 10}} className='flex-row pt-2 justify-center items-center px-8'>
                            <View style={{backgroundColor: theme.chatInputBackground}} className='flex-row justify-between border p-2 border-neutral-300 rounded-xl pl-5 mx-3'>
                                <TextInput multiline={true} ref={inputRef} onChangeText={value => textRef.current = value} placeholder='Type message...' 
                                style={{fontSize: hp(2), maxHeight: hp(20), overflow: 'scroll', color: theme.chatInputText}} className='flex-1 mr-2'/>
                            </View>
                            <TouchableOpacity style={{backgroundColor: theme.chatSendButtonBackground}} onPress={handleSendMessage} className='bg-green-600 p-2 mr-3 rounded-full self-end' hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                                <FontAwesome name='send' size={hp(2.7)} color={theme.chatSendIcon}/>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        </View>
    </CustomKeyboardView>
  )
}

export default ChatRoom