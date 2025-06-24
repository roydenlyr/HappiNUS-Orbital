import { View, Text } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const MessageItem = ({message, currentUser}) => {

    const time = message?.createdAt?.toDate?.().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if(currentUser?.userId === message?.userId){
    return (
        <View className='flex-row justify-end mb-2 mr-3'>
            <View style={{width: wp(80)}}>
                <View className='flex self-end p-3 rounded-2xl bg-indigo-100 border border-indigo-200'>
                    <Text style={{fontSize: hp(2)}}>
                        {message?.text}
                    </Text>
                    <Text style={{ fontSize: hp(1.3), color: '#666', marginTop: 4, alignSelf: 'flex-end' }}>
                        {time}
                    </Text>
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