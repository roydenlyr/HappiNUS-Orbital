import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { useUserList } from '../../../../context/userListProvider';
import { Image } from 'expo-image';
import { blurhash } from '../../../../components/common';

const MentorList = () => {

    const router = useRouter();
    const { mentors } = useUserList();    

  return (
    <View className='flex-1 bg-white p-5'>
      <TouchableOpacity onPress={() => router.push('/addMentor')} className='bg-emerald-400 rounded-xl p-3 items-center mb-3'>
        <Text className='font-semibold text-white' style={{fontSize: hp(2)}}>Add new mentor</Text>
      </TouchableOpacity>

      <FlatList
        data={mentors}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => 
            <TouchableOpacity
                onPress={() => router.push({pathname: '/editMentor', params: {...item, profileUrl: encodeURIComponent(item.profileUrl)}})}
                className={`flex-row justify-start mx-4 items-center gap-5 mb-4 pb-2 
                    ${index + 1 === mentors.length ? "" : "border-b border-b-neutral-200"}`}
            >
                <Image 
                    style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
                    source={item?.profileUrl}
                    placeholder={blurhash}
                    transition={500}
                />

                <Text className='font-medium' style={{fontSize: hp(1.5)}}>
                    {item?.username}
                </Text>
            </TouchableOpacity>
        }
      />
    </View>
  )
}

export default MentorList