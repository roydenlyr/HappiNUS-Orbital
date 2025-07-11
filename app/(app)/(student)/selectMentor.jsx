import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MentorCard from '../../../components/MentorCard';
import { useUserList } from '../../../context/userListProvider';

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
        <TouchableOpacity onPress={() => setFilterVisible(true)} className='flex-row bg-indigo-500 rounded-full items-center justify-center gap-3' style={{width: wp(55), maxWidth: 600, padding: hp(1)}}>
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
        height={hp(55)}
        width={wp(100)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: wp(25),
        }}
        style = {{
          paddingTop: hp(6)
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
            <Picker.Item label="NUS Business School" value="NUS Business School" />
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
