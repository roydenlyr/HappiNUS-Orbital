import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { Loading } from '../components/Animation';
import { useAuth } from '../context/authContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if(!emailRef.current || !passwordRef.current){
      Alert.alert('Sign In', 'Please fill in all the fields!');
      return;
    }

    // Login Process
    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    console.log('sign in response: ', response);
    if(!response.success){
      Alert.alert('Sign In', response.msg);
    }
  }

  const handleForgetPassword = async () => {
    if (!emailRef.current){
      Alert.alert('Reset Password', 'Please enter your email address first.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailRef.current);
      Alert.alert('Reset Password', `A password reset link has been sent to ${emailRef.current}.`);
    } catch (error) {
      console.log('Password reset error: ', error);
      Alert.alert('Reset Failed', error.message);
    }
  }

  return (
    <CustomKeyboardView>
      <StatusBar style='dark' />
      <View style={{paddingTop: hp(8), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        {/* SignIn Image */}
        <View className='items-center'>
          <Image style={styles.logo} source={require('../assets/images/HappiNUS2.png')}/>
        </View>

        <View className='gap-10'>
          <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-950'>Sign In</Text>

          <View className='gap-4'>
            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Octicons name='mail' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => emailRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Email Address' placeholderTextColor={'gray'}/>
            </View>

            <View className='gap-2'>
              <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                <Octicons name='lock' size={hp(2.7)} color={'gray'}/>
                <TextInput onChangeText={value => passwordRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' secureTextEntry placeholder='Password' placeholderTextColor={'gray'}/>
              </View>
              <Pressable onPress={() => handleForgetPassword()}>
                <Text style={{fontSize: hp(1.8)}} className='font-semibold text-right text-neutral-500'>Forgot password?</Text>
              </Pressable>
            </View>

            {/* SignIn Button */}
            <View>
              {loading ? (
                <View className='flex-row justify-center'>
                  <Loading size={hp(10)}/>
                </View>
              ) : (
                <TouchableOpacity onPress={handleLogin} style={{height: hp(6.5)}} className='bg-indigo-500 rounded-xl justify-center items-center'>
                  <Text style={{fontSize: hp(2.7)}} className='text-white font-bold tracking-wider'>
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* SignUp */}
            <View className='flex-row justify-center'>
              <Text style={{fontSize: hp(1.8)}} className='font-semibold text-neutral-500'>Don&apos;t have an account? </Text>
              <Pressable onPress={() => {console.log('Navigating to Sign Up'); router.push('./signUp');}}>
                <Text style={{fontSize: hp(1.8)}} className='font-bold text-indigo-500'>Sign Up</Text>
              </Pressable>
            </View>
            
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  logo: {
    width: wp(80),
    resizeMode: 'contain',
  }
})