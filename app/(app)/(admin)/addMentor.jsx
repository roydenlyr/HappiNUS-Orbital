import { Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import CustomKeyboardView from '../../../components/CustomKeyboardView';
import {useAuth} from '../../../context/authContext';
import { Loading, LoadingSmile } from '../../../components/Animation';
import { Dropdown } from 'react-native-element-dropdown';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../firebaseConfig';
import { Colors } from '../../../constants/Colors';
import Logo from '../../../assets/images/SplashScreen.svg'
import LogoDark from '../../../assets/images/SplashScreen(Dark).svg'
import { GENDER, FACULTY } from '../../../constants/FilterOptions'

const genderOptions = GENDER.map(item => ({ label: item, value: item }));
const facultyOptions = FACULTY.map(item => ({ label: item, value: item }));

const AddMentor = () => {

  const [loading, setLoading] = useState(false);

  // Dropdown List
  const [gender, setGender] = useState('');
  const [faculty, setFaculty] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [matricYear, setMatricYear] = useState('');

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const registerMentor = httpsCallable(functions, 'registerMentor');

  const handleRegister = async () => {
    if(!email || !faculty || !username || !gender || !dob || !matricYear){
      Alert.alert('Sign Up', 'Please fill in all the fields!');
      return;
    }

    setLoading(true);

    let response = await registerMentor({
      email: email,
      password: '123456',
      username: username,
      faculty: faculty,
      gender: gender,
      dob: dob,
      matricYear: matricYear
    })

    if (!response.data.success){
      Alert.alert('Register', response.data.msg || 'Mentor creation failed.');
    } else {
      Alert.alert('Register', 'Mentor added successfully!');
      setUsername('');
      setEmail('');
      setFaculty('');
      setGender('');
      setDob('');
      setMatricYear('');
    }
    setLoading(false);
  }

  return (
    <CustomKeyboardView inAddMentor={true}>
      <ScrollView style={{backgroundColor: theme.appBackground}}>
      <StatusBar style='auto' />
      <View style={{paddingTop: hp(7), paddingHorizontal: wp(5)}} className='flex-1 gap-12'>
        <View className='items-center -mb-20 -mt-20'>
          {
            colorScheme === 'light' ? (
              <Logo width={'100%'} height={hp(20)}/>
            ) : (
              <LogoDark width={'100%'} height={hp(20)}/>
            )
          }
        </View>

        <View className='gap-8'>
          <View className='gap-4'>
            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Feather name='user' size={hp(2.7)} color={'gray'}/>
              <TextInput value={username} onChangeText={value => setUsername(value)} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold text-neutral-700' placeholder='Name' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Octicons name='mail' size={hp(2.7)} color={'gray'}/>
              <TextInput value={email} onChangeText={value => setEmail(value)} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold text-neutral-700' placeholder='Email Address (NUS)' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Ionicons name='school-outline' size={hp(2.7)} color={'gray'}/>
              <Dropdown style={{flex: 1}} containerStyle={{borderRadius: 12}} data={facultyOptions} labelField={'label'} valueField={'value'} placeholder='Faculty' placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                selectedTextStyle={{fontSize: hp(2), color: theme.text, fontWeight: '600'}} itemTextStyle={{fontSize: hp(2)}} value={faculty} onChange={item => setFaculty(item.value)} />
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Ionicons name='transgender-outline' size={hp(2.7)} color={'gray'}/>
              <Dropdown style={{flex: 1}} containerStyle={{borderRadius: 12}} data={genderOptions} labelField={'label'} valueField={'value'} placeholder='Gender' placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                selectedTextStyle={{fontSize: hp(2), color: theme.text, fontWeight: '600'}} itemTextStyle={{fontSize: hp(2)}} value={gender} onChange={item => setGender(item.value)} />
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Feather name='calendar' size={hp(2.7)} color={'gray'}/>
              <TextInput keyboardType='numeric' maxLength={4} value={dob} onChangeText={value => setDob(value)} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold text-neutral-700' placeholder='Year of Birth' placeholderTextColor={'gray'}/>
            </View>

            <View style={{height: hp(7), backgroundColor: theme.selectionInactive}} className='flex-row gap-4 px-4 items-center rounded-xl'>
              <Feather name='calendar' size={hp(2.7)} color={'gray'}/>
              <TextInput keyboardType='numeric' maxLength={4} value={matricYear} onChangeText={value => setMatricYear(value)} style={{fontSize: hp(2), color: theme.text}} className='flex-1 font-semibold text-neutral-700' placeholder='Matriculation Year' placeholderTextColor={'gray'}/>
            </View>

            {loading ? (
              <View className='items-center justify-center -mt-14'>
                <LoadingSmile size={hp(15)}/>
              </View>
            ) : (
              <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: theme.button}} className='rounded-xl justify-center items-center p-3'>
                <Text style={{fontSize: hp(2.7), color: theme.textContrast}} className='font-semibold tracking-wider'>
                  Add Mentor
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      </ScrollView>
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