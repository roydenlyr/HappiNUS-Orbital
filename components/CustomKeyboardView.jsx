import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React from 'react';

const CustomKeyoardView = ({ children, inChat }) => {
  const ios = Platform.OS === 'ios';

  let kavConfig = {};
  let scrollViewConfig = {};
  if (inChat){
    kavConfig = {keyboardVerticalOffset: 70};
    scrollViewConfig = {contentContainerStyle: {flex: 1}};
  }

  return (
    <KeyboardAvoidingView 
      behavior={ios ? 'padding' : 'height'} 
      style={{ flex: 1 }}
      {...kavConfig}
    >
        <ScrollView
          style={{flex: 1}}
          bounces={false}
          showsVerticalScrollIndicator={false}
          {...scrollViewConfig}
        >
          {children}
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyoardView;
