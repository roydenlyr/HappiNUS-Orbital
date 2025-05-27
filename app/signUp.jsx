import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../components/CustomKeyboardView';
import {useAuth} from '../context/authContext'
import Loading from '../components/Loading';

const SignUp = () => {

  const router = useRouter();
  const {register} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileRef = useRef("");

  const handleRegister = async () => {
    if(!emailRef.current || !passwordRef.current || !usernameRef.current || !profileRef.current){
      Alert.alert('Sign Up', 'Please fill in all the fields!');
      return;
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileRef.current, 'student');
    setLoading(false);

    console.log('got results: ', response);
    if (!response.success){
      Alert.alert('Sign Up', response.msg);
    }
  }

  return (
    <CustomKeyboardView>
      <StatusBar style='dark' />
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        {/* SignIn Image */}
        <View className='items-center'>
          <Image style={styles.logo} source={require('../assets/images/HappiNUS2.png')}/>
        </View>

        <View className='gap-10'>
          <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-950'>Sign Up</Text>

          <View className='gap-4'>
            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Feather name='user' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => usernameRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Username' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Octicons name='mail' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => emailRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Email Address' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Octicons name='lock' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => passwordRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' secureTextEntry placeholder='Password' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Feather name='image' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => profileRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Profile url' placeholderTextColor={'gray'}/>
            </View>

            {/* SignUp Button */}

            <View>
              {loading ? (
                <View className='flex-row justify-center'>
                  <Loading size={hp(10)}/>
                </View>
              ) : (
                <TouchableOpacity onPress={handleRegister} style={{height: hp(6.5)}} className='bg-indigo-500 rounded-xl justify-center items-center'>
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
                <Text style={{fontSize: hp(1.8)}} className='font-bold text-indigo-500'>Sign In</Text>
              </Pressable>
            </View>
            
          </View>
        </View>
      </View>
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