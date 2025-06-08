import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '../../../components/ChatRoomHeader';
import MessageList from '../../../components/MessageList';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import CustomKeyboardView from '../../../components/CustomKeyboardView'
import {useAuth} from '../../../context/authContext'
import { getRoomId } from '../../../components/common';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { summariseChat } from '../../../services/summariseChat';

const ChatRoom = () => {
    const item = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        createRoomIfNotExists();

        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, 'rooms', roomId);
        const messagesRef = collection(docRef, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => {
                return doc.data();
            })
            setMessages([...allMessages]);
        });

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', updateScrollView)

        return () => {
            unsub();
            keyboardDidShowListener.remove();
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
        // Room id
        let roomId = getRoomId(user?.userId, item?.userId);
        await setDoc(doc(db, 'rooms', roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date()),
            participants: [user.userId, item.userId]
        })
    }

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if(!message) return;
        try{
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messagesRef = collection(docRef, 'messages');
            textRef.current = '';
            if(inputRef) inputRef?.current?.clear();

            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });

            console.log('new message id: ', newDoc.id);
        } catch (err){
            Alert.alert('Message',err.message)
        }
    }

  return (
    <CustomKeyboardView inChat={true}>
        <View className='flex-1 bg-white'>
            <StatusBar style='dark' />
            <ChatRoomHeader user={item} router={router} messages={messages} textRef={textRef} inputRef={inputRef}/>
            <View className='h-3 border-b border-neutral-300' />
            <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
                <View className='flex-1'>
                    <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                </View>
                <View style={{marginBottom: hp(3)}} className='pt-2'>
                    <View className='flex-row justify-between bg-white border p-2 border-neutral-300 rounded-full pl-5 mx-3'>
                        <TextInput ref={inputRef} onChangeText={value => textRef.current = value} placeholder='Type message...' style={{fontSize: hp(2)}} className='flex-1 mr-2' />
                        <TouchableOpacity onPress={handleSendMessage} className='bg-neutral-200 p-2 mr-[1px] rounded-full'>
                            <Feather name='send' size={hp(2.7)} color={'#737373'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </CustomKeyboardView>
  )
}

export default ChatRoom