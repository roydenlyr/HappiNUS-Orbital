import { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MentorCard from '../../../components/MentorCard';
import { useUserList } from '../../../context/userListProvider';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { FACULTY, GENDER } from '../../../constants/FilterOptions';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SelectMentor = () => {

  const { fromRoom, keepChat, prevMentorId } = useLocalSearchParams();
  const { mentors } = useUserList();
  const theme = Colors[useColorScheme()] ?? Colors.light;

  const snapPoints = useMemo(() => ['10%', '50%', '70%', '100%'], []);
  const bottomSheetRef = useRef(null);
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [sheetIndex, setSheetIndex] = useState(1);

  const navigation = useNavigation();

  const [selectedGenders, setSelectedGenders] = useState(Array(GENDER.length).fill(null));
  const [selectedFaculties, setSelectedFaculties] = useState(Array(FACULTY.length).fill(null));
  const activeGenders = selectedGenders.filter(Boolean); // removes nulls
  const activeFaculties = selectedFaculties.filter(Boolean);

  const filteredMentors = mentors.filter(
    m =>
    (activeGenders.length === 0 || activeGenders.includes(m.gender)) &&
    (activeFaculties.length === 0 || activeFaculties.includes(m.faculty)) && 
    m.userId !== prevMentorId
  );

  const toggleSheet = () => {
    const nextIndex = sheetIndex === 3 ? 1 : 3;
    bottomSheetRef.current?.snapToIndex(nextIndex);
  }

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleSheet}>
          <Ionicons name='filter' size={hp(2.3)} color={theme.header}/>
        </TouchableOpacity>
      ),
    });
  })

  const handleGenderFilter = (index) => {
    const updatedSelections = [...selectedGenders];
    if (updatedSelections[index]) {
      updatedSelections[index] = null;
    } else {
      updatedSelections[index] = GENDER[index];
    }
    setSelectedGenders(updatedSelections);
  }

  const handleFacultyFilter = (index) => {
    const updatedSelections = [...selectedFaculties];
    if (updatedSelections[index]) {
      updatedSelections[index] = null;
    } else {
      updatedSelections[index] = FACULTY[index];
    }
    setSelectedFaculties(updatedSelections);
  }

  const handleClearFilter = () => {
    setSelectedFaculties(Array(FACULTY.length).fill(null));
    setSelectedGenders(Array(GENDER.length).fill(null));
  }

  const handleSheetChange = (index) => {
    setSheetIndex(index);
    if (index > 1) {
      Animated.timing(fadeAnimation, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }

  return (
    <View style={{backgroundColor: theme.appBackground}} className="flex-1 justify-center">
      {/* Carousel */}
      <Carousel
        data={filteredMentors}
        renderItem={({ item }) => <MentorCard mentor={item} fromRoom={fromRoom} keepChat={keepChat} prevMentorId={prevMentorId}/>}
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
      
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={1} 
        backgroundStyle={{backgroundColor: theme.bottomSheetBackground}}
        handleIndicatorStyle={{backgroundColor: theme.header}} 
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={4} disappearsOnIndex={1} pressBehavior={1} />
        )}
        onChange={(index) => handleSheetChange(index)}
      >
        <Pressable disabled={sheetIndex > 1} onPress={() => bottomSheetRef.current?.snapToIndex(3)} >
        <BottomSheetView className='items-center'>
          <Text style={{color: theme.header}} className="text-lg font-bold mb-4 self-center">FILTER</Text>
        </BottomSheetView>
        
        {
          // sheetIndex > 1 && (
          <Animated.View style={{opacity: fadeAnimation}}>
            <View className='p-5 gap-2'>
              <Text style={{color: theme.text}} className='font-medium'>Gender</Text>
              <View className='flex-row gap-3'>
                {
                  GENDER.map((gender, index) => (
                    <TouchableOpacity onPress={() => handleGenderFilter(index)} key={index} style={{backgroundColor: (selectedGenders[index] ? theme.selectionActive : theme.selectionInactive )}} className='flex-1 p-3 rounded-3xl items-center justify-center'>
                      <Text style={{color: (selectedGenders[index] ? theme.selectionActiveText : theme.selectionInactiveText)}}>{gender}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
            <View className='p-5 gap-2'>
              <Text style={{color: theme.text}} className='font-medium'>Faculty</Text>
              {
                FACULTY.reduce((rows, faculty, index) => {
                  if (index % 2 === 0) {
                    rows.push([faculty, FACULTY[index + 1]]);
                  }
                  return rows;
                }, []).map((pair, rowIndex) => (
                  <View key={rowIndex} className='flex-row gap-3 p-1'>
                    {pair.map((facultyItem, colIndex) => (
                      facultyItem ? (
                        <TouchableOpacity key={colIndex} onPress={() => handleFacultyFilter(rowIndex * 2 + colIndex)} style={{ backgroundColor: selectedFaculties[rowIndex * 2 + colIndex] ? theme.selectionActive : theme.selectionInactive,}}
                          className='flex-1 p-3 rounded-3xl items-center justify-center'
                        >
                          <Text style={{ textAlign: 'center', color: selectedFaculties[rowIndex * 2 + colIndex] ? theme.selectionActiveText : theme.selectionInactiveText }}>
                            {facultyItem}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View key={colIndex} style={{ flex: 1 }} />
                      )
                    ))
                }
                </View>
              ))}

              <TouchableOpacity onPress={handleClearFilter} style={{backgroundColor: theme.button}} className='p-3 items-center justify-center rounded-xl'>
                <Text style={{color: theme.textContrast}}>Clear Filter</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }
        </Pressable>
      </BottomSheet>
        
    </View>
  );
};

export default SelectMentor;
