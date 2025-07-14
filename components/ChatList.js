import { View, Text, FlatList } from 'react-native'
import React from 'react'
import ChatItem from './ChatItem'
import { useRouter } from 'expo-router'

const ChatList = ({users, currentUser}) => {
    const router = useRouter();
  return (
    <View>
        <FlatList 
            data={users} 
            contentContainerStyle={{paddingVertical: 15}} 
            keyExtractor={item => Math.random()} 
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => <ChatItem 
                noBorder={index + 1 === users.length} 
                item={item} 
                index={index} 
                router={router}
                currentUser={currentUser}
            />}
        />
    </View>
  )
}

export default ChatList