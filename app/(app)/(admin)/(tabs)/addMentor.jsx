import { Alert, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../../../../components/CustomKeyboardView';
import {useAuth} from '../../../../context/authContext';
import Loading from '../../../../components/Loading';
import { Dropdown } from 'react-native-element-dropdown';

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Others', value: 'Others' },
]

const facultyOptions = [
  { label: 'College of Design & Engineering', value: 'Collge of Design & Engineering' },
  { label: 'School of Computing', value: 'School of Computing' },
  { label: 'NUS Business School', value: 'NUS Business School' },
  { label: 'Faculty of Arts & Social Sciences', value: 'Faculty of Arts & Social Sciences' },
  { label: 'Yong Loo Lin School of Medicine', value: 'Yong Loo Lin School of Medicine' },
  { label: 'Faculty of Law', value: 'Faculty of Law' },
]

const AddMentor = () => {

  const router = useRouter();
  const {registerMentor, logout} = useAuth();
  const [loading, setLoading] = useState(false);

  // Dropdown List
  const [gender, setGender] = useState('');
  const [faculty, setFaculty] = useState('');

  const emailRef = useRef("");
  const usernameRef = useRef("");
  const facultyRef = useRef("");
  const genderRef = useRef("");
  const dobRef = useRef("");
  const matricYearRef = useRef("");

  const handleLogout = async () => {
      await logout();
  }

  const handleRegister = async () => {
    if(!emailRef.current || !facultyRef.current || !usernameRef.current || !genderRef.current || !dobRef.current || !matricYearRef.current){
      console.log('Email: ', emailRef.current);
      console.log('Faculty: ', facultyRef.current);
      console.log('Username: ', usernameRef.current);
      console.log('Gender: ', genderRef.current);
      console.log('Date of Birth: ', dobRef.current);
      console.log('Matriculation Year: ', matricYearRef.current);
      Alert.alert('Sign Up', 'Please fill in all the fields!');
      return;
    }

    setLoading(true);

    let response = await registerMentor(emailRef.current, '123456', usernameRef.current, 'https://cdn.pixabay.com/photo/2023/10/03/10/49/anonymous-8291223_1280.png', 'mentor', 
      facultyRef.current, genderRef.current, dobRef.current, matricYearRef.current
    );
    setLoading(false);

    console.log('got results: ', response);
    if (!response.success){
      Alert.alert('Register', response.msg);
    }
  }

  return (
    <CustomKeyboardView>
      <StatusBar style='dark' />
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12 bg-white'>
        {/* SignIn Image */}
        <View className='items-center'>
          <Image style={styles.logo} source={require('../../../../assets/images/HappiNUS2.png')}/>
        </View>

        <View className='gap-8'>
          <Text style={{fontSize: hp(4)}} className='font-bold tracking-wider text-center text-neutral-950'>Register New Mentor</Text>

          <View className='gap-4'>
            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Feather name='user' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => usernameRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Name' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Octicons name='mail' size={hp(2.7)} color={'gray'}/>
              <TextInput onChangeText={value => emailRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Email Address (NUS)' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Ionicons name='school-outline' size={hp(2.7)} color={'gray'}/>
              {/* <TextInput onChangeText={value => facultyRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Faculty' placeholderTextColor={'gray'}/> */}
              <Dropdown style={{flex: 1}} containerStyle={{borderRadius: 12}} data={facultyOptions} labelField={'label'} valueField={'value'} placeholder='Faculty' placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                selectedTextStyle={{fontSize: hp(2), color: '#404040', fontWeight: '600'}} itemTextStyle={{fontSize: hp(2)}} value={faculty} onChange={item => {setFaculty(item.value); facultyRef.current = item.value;}} />
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Ionicons name='transgender-outline' size={hp(2.7)} color={'gray'}/>
              {/* <TextInput onChangeText={value => genderRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Gender' placeholderTextColor={'gray'}/> */}
              <Dropdown style={{flex: 1}} containerStyle={{borderRadius: 12}} data={genderOptions} labelField={'label'} valueField={'value'} placeholder='Gender' placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                selectedTextStyle={{fontSize: hp(2), color: '#404040', fontWeight: '600'}} itemTextStyle={{fontSize: hp(2)}} value={gender} onChange={item => {setGender(item.value); genderRef.current = item.value;}} />
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Feather name='calendar' size={hp(2.7)} color={'gray'}/>
              <TextInput keyboardType='numeric' maxLength={4} onChangeText={value => dobRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Year of Birth' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
              <Feather name='calendar' size={hp(2.7)} color={'gray'}/>
              <TextInput keyboardType='numeric' maxLength={4} onChangeText={value => matricYearRef.current = value} style={{fontSize: hp(2)}} className='flex-1 font-semibold text-neutral-700' placeholder='Matriculation Year' placeholderTextColor={'gray'}/>
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
                    Add Mentor
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Temp Sign Out */}
            <View className='flex-row justify-center'>
              <Pressable onPress={handleLogout}>
                <Text style={{fontSize: hp(1.8)}} className='font-bold text-indigo-500'>Sign Out</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}

export default AddMentor

const styles = StyleSheet.create({
  logo: {
    width: wp(80),
    resizeMode: 'contain',
  }
})