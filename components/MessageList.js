import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import MessageItem from './MessageItem'
import { Colors } from '../constants/Colors'

const MessageList = ({messages, currentUser, scrollViewRef, otherUserId, lastSeen, isActive, chatEndDate}) => {  
  const theme = Colors[useColorScheme()] ?? Colors.light;
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 10}}>
      {
        messages.map((message, index) => {

          const currentDate = message.createdAt.toDate().toDateString();
          const prevDate = index > 0 ? messages[index - 1].createdAt.toDate().toDateString() : null;

          const showDatePill = currentDate !== prevDate;

          return (
            <View key={index}>
            {showDatePill && (
              <View className="items-center my-3">
                <Text style={{backgroundColor: theme.pillBackground, color: theme.pillText}} className="text-xs px-4 py-1 rounded-full">
                  {currentDate}
                </Text>
              </View>
            )}
            {
              message.type === 'system' && (
                <View className="items-center mb-3">
                  <Text style={{backgroundColor: theme.pillBackground, color: theme.pillText}} className="text-xs px-4 py-1 rounded-full mx-2 text-center">
                    {message.text}
                  </Text>
                </View>
              )
            }
              <MessageItem message={message} key={index} currentUser={currentUser} otherUserId={otherUserId} lastSeen={lastSeen}/>
            </View>
          )
        })
      }
      {
        !isActive && chatEndDate && (
          <View className="items-center mb-3 pb-5">
            <Text style={{backgroundColor: theme.pillBackground, color: theme.pillText}} className="text-xs px-4 py-1 rounded-full text-center">
              Chat has ended on {chatEndDate.toDate().toLocaleString() + '.\n'}
              Messages will be deleted after 3 days.
            </Text>
          </View>
        )
      }
    </ScrollView>
  )
}

export default MessageList