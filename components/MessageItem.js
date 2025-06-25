import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


const MessageItem = ({message, currentUser, otherUserId, lastSeen}) => {

    const time = message?.createdAt?.toDate?.().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

    const messageTime = message?.createdAt?.toDate?.();
    const seenTime = lastSeen ? new Date(lastSeen) : null;
    const isRead = seenTime && seenTime > messageTime;

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
                <View className='flex self-end p-3 rounded-2xl bg-indigo-100 border border-indigo-200'>
                    <Text style={{fontSize: hp(2)}}>
                        {message?.text}
                    </Text>
                    <View className='flex-row items-center justify-end mt-1 gap-1'>
                        <Text style={{ fontSize: hp(1.3), color: '#666'}}>
                            {time}
                        </Text>
                        <Animated.View style={animatedStyle}>
                            <MaterialCommunityIcons name={isRead ? 'check-all' : 'check-underline'} color={'#666'} size={hp(1.3)}/>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    )
  } else {
    return (
        <View style={{width: wp(80)}} className='ml-3 mb-2'>
            <View className='flex self-start p-3 px-4 rounded-2xl bg-white border-neutral-200 border'>
                <Text style={{fontSize: hp(2)}}>
                    {message?.text}
                </Text>
                <Text style={{ fontSize: hp(1.3), color: '#666', marginTop: 4, alignSelf: 'flex-end' }}>
                    {time}
                </Text>
            </View>
        </View>
    )
  }
}

export default MessageItem