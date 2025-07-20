import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

export function Loading({size}) {
  return (
    <View style={{height: size, aspectRatio: 1}}>
      <LottieView style={{flex: 1}} source={require('../assets/images/LoadingAnimation.json')} autoPlay loop/>
    </View>
  )
}

export function Sloth({size}) {
  return (
    <View style={{height: size, aspectRatio: 1}}>
      <LottieView style={{flex: 1}} source={require('../assets/images/SlothMeditate.json')} autoPlay loop/>
    </View>
  )
}

export function LoadingSmile({size}) {
  return (
    <View style={{height: size, aspectRatio: 1}}>
      <LottieView style={{flex: 1}} source={require('../assets/images/LoadingSmile.json')} autoPlay loop/>
    </View>
  )
}