import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, useColorScheme } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../components/CustomKeyboardView';
import {useAuth} from '../context/authContext'
import { Loading, LoadingSmile } from '../components/Animation';
import { Colors } from '../constants/Colors';
import Logo from '../assets/images/SplashScreen.svg';
import LogoDark from '../assets/images/SplashScreen(Dark).svg';
import { Poppins_500Medium, Poppins_600SemiBold, useFonts } from '@expo-google-fonts/poppins'

const SignUp = () => {

  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const [fontsLoaded] = useFonts ({
    Poppins_500Medium,
    Poppins_600SemiBold,
  })

  const handleRegister = async () => {
    if(!emailRef.current || !passwordRef.current || !usernameRef.current){
      Alert.alert('Sign Up', 'Please fill in all the fields!');
      return;
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, 'https://firebasestorage.googleapis.com/v0/b/happinus-ba24a.firebasestorage.app/o/profilePictures%2Fsmile2.jpg?alt=media&token=54944b3f-caa7-4066-b8e1-784d4c341b23', 'student');
    setLoading(false);

    console.log('got results: ', response);
    if (!response.success){
      Alert.alert('Sign Up', response.msg);
    }
  }

  return (
    <CustomKeyboardView inSignUp={true}>
      <ScrollView style={{backgroundColor: theme.appBackground}}>
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        {/* SignIn Image */}
        <View className='items-center'>
          {
            colorScheme === 'light' ? (
              <Logo width={'100%'} height={hp(20)}/>
            ) : (
              <LogoDark width={'100%'} height={hp(20)}/>
            )
          }
        </View>

        <View className='gap-5'>
          <Text style={{fontSize: hp(4), fontFamily: (fontsLoaded ? 'Poppins_600SemiBold' : undefined), color: theme.header}} className='text-center'>Sign Up</Text>

          <View className='gap-4'>
            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Feather name='user' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => usernameRef.current = value} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold' placeholder='Username' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Octicons name='mail' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => emailRef.current = value} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold' placeholder='Email Address' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Octicons name='lock' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => passwordRef.current = value} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold' secureTextEntry placeholder='Password' placeholderTextColor={'gray'}/>
            </View>

            {/* SignUp Button */}

            <View>
              {loading ? (
                <View className='flex-row justify-center'>
                  <LoadingSmile size={hp(10)}/>
                </View>
              ) : (
                <TouchableOpacity onPress={handleRegister} style={{backgroundColor: theme.button}} className='rounded-xl justify-center items-center p-3'>
                  <Text style={{fontSize: hp(2.7)}} className='text-white font-bold tracking-wider'>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* SignIn */}
            <View className='flex-row justify-center'>
              <Text style={{fontSize: hp(1.8)}} className='font-semibold text-neutral-500'>Already have an account? </Text>
              <Pressable onPress={() => {console.log('Navigating to Sign Ip'); router.push('./signIn');}}>
                <Text style={{fontSize: hp(1.8), color: theme.header}} className='font-bold'>Sign In</Text>
              </Pressable>
            </View>
            
          </View>
        </View>
      </View>
      </ScrollView>
    </CustomKeyboardView>
  )
}

export default SignUp

const styles = StyleSheet.create({
  logo: {
    width: wp(80),
    resizeMode: 'contain',
  }
})