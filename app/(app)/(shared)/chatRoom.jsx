import { View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native'
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
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useChatContext } from '../../../context/chatContext';

const ChatRoom = () => {
    const item = useLocalSearchParams();
    const {user} = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [otherUserLastSeen, setOtherUserLastSeen] = useState(null);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const {setActiveRoomId} = useChatContext();    

    useEffect(() => {
        createRoomIfNotExists();

        let roomId = getRoomId(user?.userId, item?.userId);
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
                }).catch(err => console.error('Failed to update lastSeen', err));            
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
        // Room id
        let roomId = getRoomId(user?.userId, item?.userId);
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
                }
            });
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

            console.log('new message id: ', newDoc.id);
        } catch (err){
            Alert.alert('Message',err.message)
        }
    }

    useEffect(() => {
        const roomId = getRoomId(user?.userId, item?.userId);
        const roomDoc = doc(db, 'rooms', roomId);

        return () => {
            updateDoc(roomDoc, {
                [`lastSeen.${user.userId}`]: serverTimestamp()
            }).catch(err => console.error('Failed to update lastSeen', err));
        };
    }, []);

    useEffect(() => {
        const roomId = getRoomId(user?.userId, item?.userId);
        const roomRef = doc(db, 'rooms', roomId);

        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                const lastSeenTimestamp = data?.lastSeen?.[item?.userId];
                if (lastSeenTimestamp) {
                    setOtherUserLastSeen(lastSeenTimestamp.toDate());
                }
            }
        });

        return unsubscribe;
    }, []);

  return (
    <CustomKeyboardView inChat={true}>
        <View className='flex-1'>
            <StatusBar style='dark' />
            <ChatRoomHeader user={{...item, profileUrl: encodeURIComponent(item.profileUrl)}} messages={messages} textRef={textRef} inputRef={inputRef}/>
            <View className='h-1 border-b border-neutral-300' />
            <View className='flex-1 justify-between bg-neutral-100 overflow-visible'>
                <View className='flex-1'>
                    <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} otherUserId={item?.userId} lastSeen={otherUserLastSeen} />
                </View>

                <View style={{marginBottom: hp(3)}} className='flex-row pt-2 justify-center items-center px-5'>
                    <View className='flex-row justify-between bg-white border p-2 border-neutral-300 rounded-xl pl-5 mx-3'>
                        <TextInput multiline={true} ref={inputRef} onChangeText={value => textRef.current = value} placeholder='Type message...' 
                        style={{fontSize: hp(2), maxHeight: hp(20), overflow: 'scroll'}} className='flex-1 mr-2' />
                    </View>
                    <TouchableOpacity onPress={handleSendMessage} className='bg-green-600 p-2 mr-3 rounded-full self-end' hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                        <FontAwesome name='send' size={hp(2.7)} color={'white'}/>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    </CustomKeyboardView>
  )
}

export default ChatRoom