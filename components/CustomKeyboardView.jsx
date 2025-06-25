import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';

const CustomKeyoardView = ({ children, inChat }) => {
  const ios = Platform.OS === 'ios';

  let kavConfig = {};
  if (inChat){
    kavConfig = {keyboardVerticalOffset: 70};
  }

  return (
    <KeyboardAvoidingView 
      behavior={ios ? 'padding' : 'height'} 
      style={{ flex: 1 }}
      {...kavConfig}
    >
        {children}
    </KeyboardAvoidingView>
  );
};

export default CustomKeyoardView;
