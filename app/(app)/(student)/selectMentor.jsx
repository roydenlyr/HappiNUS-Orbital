import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Modal from 'react-native-modal';
import Carousel from 'react-native-reanimated-carousel';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MentorCard from '../../../components/MentorCard';
import { useUserList } from '../../../context/userListProvider';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/Colors';

const SelectMentor = () => {

  const { fromRoom, keepChat } = useLocalSearchParams();

  const { mentors } = useUserList();

  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const filteredMentors = mentors.filter(
    m =>
      (!selectedGender || m.gender === selectedGender) &&
      (!selectedFaculty || m.faculty === selectedFaculty)
  );

  return (
    <View style={{backgroundColor: theme.appBackground}} className="flex-1 justify-center">
      {/* Filter Button */}
      <View className='justify-center items-center mb-20'>
        <TouchableOpacity onPress={() => setFilterVisible(true)} className='flex-row rounded-full items-center justify-center gap-3 p-3' style={{width: wp(55), maxWidth: 600, backgroundColor: theme.ctaButton}}>
          <Feather name='filter' color={theme.textContrast} size={hp(3)}/>
          <Text style={{color: theme.textContrast}} className='font-semibold'>Open Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <Carousel
        data={filteredMentors}
        renderItem={({ item }) => <MentorCard mentor={item} fromRoom={fromRoom} keepChat={keepChat}/>}
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
      />

      {/* Slide-In Filter Modal */}
      <Modal
        isVisible={isFilterVisible}
        onBackdropPress={() => setFilterVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.3}
        style={{ margin: 0, justifyContent: 'center', alignItems: 'flex-end' }}
      >
        <View style={{ width: wp(80), height: hp(100), backgroundColor: theme.cardBackground }} className='p-2 justify-center rounded-3xl'>
          <Text style={{color: theme.header}} className="text-lg font-bold mb-4 self-center">Filter Mentors</Text>

          <Text style={{color: theme.text}}>Gender:</Text>
          <Picker selectedValue={selectedGender} onValueChange={setSelectedGender}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Others" value="Others" />
          </Picker>

          <Text style={{color: theme.text}}>Faculty:</Text>
          <Picker selectedValue={selectedFaculty} onValueChange={setSelectedFaculty}>
            <Picker.Item label="All" value="" />
            <Picker.Item label="College of Design & Engineering" value="College of Design & Engineering" />
            <Picker.Item label="School of Computing" value="School of Computing" />
            <Picker.Item label="NUS Business School" value="NUS Business School" />
            <Picker.Item label="Faculty of Arts and Social Sciences" value="Faculty of Arts and Social Sciences" />
            <Picker.Item label="Yong Loo Lin School of Medicine" value="Yoo Long Lin School of Medicine" />
            <Picker.Item label="Faculty of Law" value="Faculty of Law" />
          </Picker>

          <TouchableOpacity onPress={() => setFilterVisible(false)} style={{backgroundColor: theme.button}} className="mt-6 p-3 rounded-full">
            <Text style={{color: theme.textContrast}} className="text-white text-center font-semibold">Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setFilterVisible(false); setSelectedFaculty(''); setSelectedGender('')}} style={{backgroundColor: theme.ctaButton}} className="mt-3 bg-white p-3 rounded-full">
            <Text style={{color: theme.textContrast}} className="text-center font-semibold">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default SelectMentor;
