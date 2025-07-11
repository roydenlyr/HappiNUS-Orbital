import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import MessageItem from './MessageItem'

const MessageList = ({messages, currentUser, scrollViewRef, otherUserId, lastSeen, isActive, chatEndDate}) => {
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
                <Text className="text-xs text-neutral-500 bg-neutral-200 px-4 py-1 rounded-full">
                  {currentDate}
                </Text>
              </View>
            )}
            {
              message.type === 'system' && (
                <View className="items-center mb-3">
                  <Text className="text-xs text-neutral-500 bg-neutral-200 px-4 py-1 rounded-full">
                    🔔 This is the beginning of your new chat.
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
        !isActive && (
          <View className="items-center mb-3 pb-5">
            <Text className="text-xs text-neutral-500 bg-neutral-200 px-4 py-1 rounded-full text-center">
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