import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useUserList } from '../../../context/userListProvider';
import MentorCard from '../../../components/MentorCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';

const SelectMentor = () => {
  const { mentors } = useUserList();

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const filteredMentors = mentors.filter(
    m =>
      (!selectedGender || m.gender === selectedGender) &&
      (!selectedFaculty || m.faculty === selectedFaculty)
  );

  return (
    <View className="flex-1 justify-center">
      <StatusBar barStyle='auto' />

      {/* Filter Button */}
      <View className='justify-center items-center mb-20'>
        <TouchableOpacity onPress={() => setFilterVisible(true)} className='flex-row bg-indigo-500 rounded-full items-center justify-center gap-3' style={{width: wp(55), maxWidth: 600}}>
          <Feather name='filter' color={'white'} size={hp(3)}/>
          <Text className='font-semibold text-white'>Open Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <Carousel
        data={filteredMentors}
        renderItem={({ item }) => <MentorCard mentor={item} />}
        pagingEnabled
        snapEnabled
        slideStyle={{ overflow: 'visible' }}
        height={hp(50)}
        width={wp(100)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: wp(25),
        }}
      />

      {/* Slide-In Filter Modal */}
      <Modal
        isVisible={isFilterVisible}
        onBackdropPress={() => setFilterVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        style={{ margin: 0, justifyContent: 'flex-end', alignItems: 'flex-end' }}
      >
        <View style={{ width: wp(80), height: hp(100) }} className='bg-white p-2 justify-center'>
          <Text className="text-lg font-bold mb-4">Filter Mentors</Text>

          <Text>Gender:</Text>
          <Picker selectedValue={selectedGender} onValueChange={setSelectedGender}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Others" value="Others" />
          </Picker>

          <Text>Faculty:</Text>
          <Picker selectedValue={selectedFaculty} onValueChange={setSelectedFaculty}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="College of Design & Engineering" value="College of Design & Engineering" />
            <Picker.Item label="School of Computing" value="School of Computing" />
            <Picker.Item label="Nus Business School" value="NUS Business School" />
            <Picker.Item label="Faculty of Arts and Social Sciences" value="Faculty of Arts and Social Sciences" />
            <Picker.Item label="Yong Loo Lin School of Medicine" value="Yoo Long Lin School of Medicine" />
            <Picker.Item label="Faculty of Law" value="Faculty of Law" />
          </Picker>

          <TouchableOpacity onPress={() => setFilterVisible(false)} className="mt-6 bg-indigo-500 p-3 rounded-full">
            <Text className="text-white text-center font-semibold">Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setFilterVisible(false); setSelectedFaculty(''); setSelectedGender('')}} className="mt-3 bg-white p-3 rounded-full">
            <Text className="text-center text-indigo-500 font-semibold">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SelectMentor;
