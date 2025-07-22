import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const CustomKeyBoardView = ({ children, inChat, inSignUp, inProfile }) => {
  const ios = Platform.OS === 'ios';

  let kavConfig = {keyboardVerticalOffset: 0};
  if (inChat){
    kavConfig = {keyboardVerticalOffset: hp(8)};
  }
  if (inSignUp) kavConfig = {keyboardVerticalOffset: 0}
  if (inProfile) kavConfig = {keyboardVerticalOffset: 70}

  // console.log('offset: ', kavConfig.keyboardVerticalOffset);
  
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

export default CustomKeyBoardView;