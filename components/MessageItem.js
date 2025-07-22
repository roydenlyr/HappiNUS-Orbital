import { View, Text, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';


const MessageItem = ({message, currentUser, otherUserId, lastSeen}) => {

    const time = message?.createdAt?.toDate?.().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

    const messageTime = message?.createdAt?.toDate?.();
    const seenTime = lastSeen ? new Date(lastSeen) : null;
    const isRead = seenTime && seenTime > messageTime;

    const theme = Colors[useColorScheme()] ?? Colors.light;

    const fade = useSharedValue(0);

    useEffect(() => {
        fade.value = withTiming(1, {duration: 300});
    }, [isRead]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fade.value,
    }));


  if(currentUser?.userId === message?.userId){
    // Only show for sender
    // Check createdAt against lastseen of the other user
    // If last seen is later than createdAt --> message read (icon: check-all or eye-check [MaterialCommunityIcons])
    // If last seen is earlier or equal to creatAt --> message not read (icon: check-underline or eye-arrow-right [MaterialCommunityIcons]) 

    return (
        <View className='flex-row justify-end mb-2 mr-3'>
            <View style={{width: wp(80)}}>
                <View style={{backgroundColor: theme.chatBubbleUser}} className='flex self-end p-3 rounded-2xl'>
                    <Text style={{fontSize: hp(2), color: theme.chatText}}>
                        {message?.text}
                    </Text>
                    <View className='flex-row items-center justify-end mt-1 gap-1'>
                        <Text style={{ fontSize: hp(1.3), color: theme.chatMetaText}}>
                            {time}
                        </Text>
                        <Animated.View style={animatedStyle}>
                            <MaterialCommunityIcons name={isRead ? 'check-all' : 'check-underline'} color={theme.chatMetaText} size={hp(1.3)}/>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    )
  } else if (otherUserId === message?.userId) {
    return (
        <View style={{width: wp(80)}} className='ml-3 mb-2'>
            <View style={{backgroundColor: theme.chatBubbleOthers}} className='flex self-start p-3 px-4 rounded-2xl'>
                <Text style={{fontSize: hp(2), color: theme.chatText}}>
                    {message?.text}
                </Text>
                <Text style={{ fontSize: hp(1.3), color: theme.chatMetaText, marginTop: 4, alignSelf: 'flex-end' }}>
                    {time}
                </Text>
            </View>
        </View>
    )
  } else if (message.type !== 'system' && currentUser?.role === 'mentor') {
    return (
        <View className='flex-row justify-end mb-2 mr-3'>
            <View style={{width: wp(80)}}>
                <View style={{backgroundColor: theme.chatBubbleTransfer}} className='flex self-end p-3 rounded-2xl'>
                    <Text style={{fontSize: hp(2), color: theme.chatText}}>
                        {message?.text}
                    </Text>
                    <View className='flex-row items-center justify-end mt-1 gap-1'>
                        <Text style={{ fontSize: hp(1.3), color: theme.chatMetaText}}>
                            {time}
                        </Text>
                        <Animated.View style={animatedStyle}>
                            <MaterialCommunityIcons name={isRead ? 'check-all' : 'check-underline'} color={theme.chatMetaText} size={hp(1.3)}/>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    )
  } else if (message.type !== 'system' && currentUser?.role === 'student') {
    return (
        <View style={{width: wp(80)}} className='ml-3 mb-2'>
            <View style={{backgroundColor: theme.chatBubbleTransfer}} className='flex self-start p-3 px-4 rounded-2xl'>
                <Text style={{fontSize: hp(2), color: theme.chatText}}>
                    {message?.text}
                </Text>
                <Text style={{ fontSize: hp(1.3), color: theme.chatMetaText, marginTop: 4, alignSelf: 'flex-end' }}>
                    {time}
                </Text>
            </View>
        </View>
    )
  }
}

export default MessageItem