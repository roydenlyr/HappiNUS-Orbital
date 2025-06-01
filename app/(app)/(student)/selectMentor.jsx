import { View, Text, Dimensions, useWindowDimensions, StatusBar } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Carousel from 'react-native-reanimated-carousel'
import { useUserList } from '../../../context/userListProvider'
import MentorCard from '../../../components/MentorCard'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router'

const SelectMentor = () => {

    const {width: screenWidth } = useWindowDimensions();
    
    // Fetch Mentor profile from users
    const {mentors} = useUserList();
    //const mentors = users.filter(user => user.role === 'mentor');

  return (
    <View className='flex-1 justify-center' style={{width: screenWidth}}>
      <StatusBar barStyle={'auto'}/>
      <Carousel 
        key={screenWidth}
        data={mentors}
        renderItem={({item}) => (<MentorCard mentor={item} />)}
        pagingEnabled={true}
        snapEnabled={true}
        slideStyle={{overflow: 'visible'}}
        height={hp(50)}
        width={screenWidth}
        mode='parallax'
        modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: wp(25),
        }}
        
        />
    </View>
  )
}

export default SelectMentor