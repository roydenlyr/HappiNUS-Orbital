import { View, Text, TouchableOpacity, FlatList, useColorScheme } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { useUserList } from '../../../../context/userListProvider';
import { Image } from 'expo-image';
import { blurhash } from '../../../../components/common';
import { Colors } from '../../../../constants/Colors'

const MentorList = () => {

    const router = useRouter();
    const { mentors } = useUserList();  
    
    const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <View style={{backgroundColor: theme.appBackground}} className='flex-1 p-5'>
      <TouchableOpacity onPress={() => router.push('/addMentor')} style={{backgroundColor: theme.activateButton}} className='rounded-xl p-3 items-center mb-5'>
        <Text className='font-semibold text-white' style={{fontSize: hp(2), color: theme.textContrast}}>Add new mentor</Text>
      </TouchableOpacity>

      <FlatList
        data={mentors}
        keyExtractor={item => item.userId}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => 
            <TouchableOpacity
                onPress={() => router.push({pathname: '/editMentor', params: {...item, profileUrl: encodeURIComponent(item.profileUrl)}})}
                style={{borderColor: theme.questionBorder}}
                className={`flex-row justify-start mx-4 items-center gap-5  
                    ${index + 1 === mentors.length ? "" : "border-b mb-3 pb-3"}`}
            >
                <Image 
                    style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                    source={item?.profileUrl}
                    placeholder={blurhash}
                    transition={500}
                />

                <Text className='font-medium' style={{fontSize: hp(1.5), color: theme.text}}>
                    {item?.username}
                </Text>
            </TouchableOpacity>
        }
      />
    </View>
  )
}

export default MentorList