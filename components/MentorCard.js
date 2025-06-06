import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MentorCard = ({mentor}) => {
  // Calculating by academic year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const academicYear = currentMonth >= 7 ? currentYear : currentYear - 1;
  const year = academicYear - parseInt(mentor.matricYear) + 1;

  const age = currentYear - parseInt(mentor.dob);

  const genderIcon = mentor.gender === 'Male' ? 'male-outline' : (mentor.gender === 'Female' ? 'female-outline' : 'transgender-outline');

  const router = useRouter();

  const handleChatNow = () => {
    router.replace({pathname: '/chatRoom', params: mentor});    
  }

  
  return (
    <View style={{borderRadius: 40, height: '100%', width: wp(70), maxWidth: 600}} className='bg-indigo-500 self-center'>
      <View style={{shadowColor: 'black', shadowRadius: 30, shadowOffset: {width: 0, height: 40}, shadowOpacity: 0.8}} className='flex-row justify-center -mt-14'>
        <Image source={{uri: mentor.profileUrl}} className='h-40 w-40' />
      </View>

      <View className='flex-1 justify-center px-5'>
        <View className='flex-row gap-4'>
          <FontAwesome name='user-o' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(3)}} className='font-semibold text-white'>{mentor.username}</Text>
        </View>
        <View style={{marginTop: hp(2)}} className='flex-row gap-4'>
          <Ionicons name={genderIcon} color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(3)}} className='font-semibold text-white'>{mentor.gender}</Text>
        </View>
        <View style={{marginTop: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='birthday-cake' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(3)}} className='font-semibold text-white'>{age}</Text>
        </View>
        <View style={{marginTop: hp(2)}} className='flex-row gap-4'>
          <FontAwesome name='calendar' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(3)}} className='font-semibold text-white'>Year {year}</Text>
        </View>
        <View style={{marginTop: hp(2)}} className='flex-row gap-4'>
          <Ionicons name='school-sharp' color={'white'} size={hp(3)}/>
          <Text style={{fontSize: hp(3)}} className='font-semibold text-white pr-10'>{mentor.faculty}</Text>
        </View>
      </View>
      <View style={{marginTop: hp(2)}} className='flex-row gap-4 justify-end m-3'>
        <TouchableOpacity onPress={handleChatNow} style={{height: hp(4)}} className='bg-white rounded-full items-center flex-row gap-3 px-4'>
          <Text style={{fontSize: hp(2)}} className='font-semibold text-indigo-500'>
            Need to talk?
          </Text>
          <Ionicons name='chatbubble-outline' size={hp(3)} color={'#6366F1'}/>
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default MentorCard