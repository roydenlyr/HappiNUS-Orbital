import { View, Text, Alert, useColorScheme, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useAuth } from '../../../../context/authContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { Colors } from '../../../../constants/Colors';
import { Sloth } from '../../../../components/Animation';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold_Italic, Poppins_600SemiBold, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import { ImageBackground } from 'expo-image';
import { AntDesign, Feather } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { SYMPTOMS, COPING_TECHNIQUES } from '../../../../constants/Data';
import TitleCard from '../../../../components/TitleCard';
import Modal from 'react-native-modal';
import ModalCard from '../../../../components/ModalCard';
import { useRouter } from 'expo-router';

const Home = () => {

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const { user, refreshUser } = useAuth();
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [picture, setPicture] = useState('');
  
  const [cardsSelection, setCardsSelection] = useState(SYMPTOMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold_Italic,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light
  });

  const callUploadQuotes = async () => {
    try {
      console.log('Uploading quotes...');
      const response = await fetch('https://us-central1-happinus-ba24a.cloudfunctions.net/uploadQuotes', {
        method: 'POST'
      });

      const json = await response.json();

      if (json.success) {
        Alert.alert('Success', json.message);
      } else {
        Alert.alert('Error', json.message);
      }
      console.log('Upload Complete');
      
    } catch (error) {
      console.error('Failed to upload quotes:', error);
      Alert.alert('Error', error.message || 'An error occurred while uploading quotes.');
    }
  };

  const retrieveQuote = async () => {
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today - start;
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

      const ref = doc(db, 'quotes', dayOfYear.toString());
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()){
        setQuote('At the end of the day, the day ends. - LAWD');
        return;
      }
      const quote = snapshot.data();
      setQuote(quote.text);
    } catch (error) {
      console.error('Failed to retrieve quote: ', error);
      setQuote('Asking for help is a brave step toward healing.')
    }
  }

  const retrieveDisneyQuotes = async () => {
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today - start;
      let dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) % 74;
      
      if (dayOfYear === 0) {
        dayOfYear = 74;
      }

      const ref = doc(db, 'disney_quotes', dayOfYear.toString());
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()){
        setQuote('At the end of the day, the day ends. - LAWD');
        return;
      }
      const quote = snapshot.data();
      setQuote(quote.text);
      setAuthor(quote.author);
      setPicture(quote.picture);
      
    } catch (error) {
      console.error('Failed to retrieve quote: ', error);
      setQuote('Asking for help is a brave step toward healing.')
    }
  }

  useEffect(() => {
    refreshUser();
    // callUploadQuotes();
    // retrieveQuote();
    retrieveDisneyQuotes();
  }, []);

  const handleSelection = () => {
    if (cardsSelection === SYMPTOMS) {
      setCardsSelection(COPING_TECHNIQUES);
    } else {
      setCardsSelection(SYMPTOMS);
    }
  }

  const handleSelectedCard = (item) => {
    setSelectedCard(item);
  }

  return (
    <View style={{backgroundColor: theme.appBackground}} className='items-center pt-5  flex-1 justify-center'>
      <View style={{width: wp(90)}}>
          <ImageBackground source={{uri: picture}} style={{height: hp(20), width: wp(90), resizeMode: 'cover', overflow: 'hidden'}} imageStyle={{borderRadius: 20}}>
            <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20}} className='justify-center items-center gap-3'>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), fontSize: hp(2.3)}} className='text-center text-white px-2'>{quote}</Text>
              <Text style={{fontSize: hp(1.4)}} className='font-semibold text-white'>{author}</Text>
            </View>
          </ImageBackground>

        <View className='flex-row justify-center mt-3'>
          <View className='-ml-6'>
            <Sloth size={hp(20)}/>
          </View>
          
          <View className='flex-1 justify-center items-center gap-5 -ml-6'>
            <TouchableOpacity onPress={() => router.push('/resources')} style={{backgroundColor: theme.button, height: hp(5)}} className='rounded-3xl justify-center items-center w-full'>
              <View className='flex-row justify-center items-center gap-3'>
                <Feather name='info' size={hp(2.3)} color={theme.textContrast}/> 
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), fontSize: hp(2.3), color: theme.textContrast}}>Resources</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/contacts')} style={{backgroundColor: theme.button, height: hp(5)}} className='rounded-3xl justify-center items-center w-full'>
              <View className='flex-row justify-center items-center gap-3'>
                <AntDesign name='contacts' size={hp(2.3)} color={theme.textContrast}/>
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), fontSize: hp(2.3), color: theme.textContrast}}>Contacts</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className='items-start mt-3'>
          <View className='flex-row gap-3'>
            <TouchableOpacity onPress={handleSelection} style={{backgroundColor: cardsSelection === SYMPTOMS ? theme.selectionActive : theme.selectionInactive}} className='rounded-full p-3 justify-center items-center'>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light': undefined), fontSize: hp(1.3), color: cardsSelection === SYMPTOMS ? theme.selectionActiveText : theme.selectionInactiveText}}>Recognise the Signs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSelection} style={{backgroundColor: cardsSelection === COPING_TECHNIQUES ? theme.selectionActive : theme.selectionInactive}} className='rounded-full p-3 justify-center items-center'>
              <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light': undefined), fontSize: hp(1.3), color: cardsSelection === COPING_TECHNIQUES ? theme.selectionActiveText : theme.selectionInactiveText}}>Coping Techniques</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* <Text className='self-center text-neutral-400 -mb-2 mt-1'>Tap to find out more</Text> */}
      <Carousel
          data={cardsSelection}
          renderItem={({ item }) => <TitleCard selection={item} onPress={() => handleSelectedCard(item)} />}
          pagingEnabled
          snapEnabled
          height={hp(24)}
          width={wp(100)}
          loop={true}
          autoPlay={true}
          autoPlayInterval={5000}
          autoPlayReverse={false}
          onProgressChange={(_, absoluteProgress) => {
            setCurrentIndex(Math.round(absoluteProgress) % cardsSelection.length);
          }}
        />

        <View className='flex-row justify-center gap-1'>
          {
            cardsSelection.map((_, i) => (
              <View 
                key={i}
                style = {[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive
                ]}
              />
            ))
          }
        </View>
        { selectedCard && (
          <Modal
            isVisible={selectedCard}
            onBackdropPress={() => setSelectedCard(null)}
            onBackButtonPress={() => setSelectedCard(null)}
            hideModalContentWhileAnimating={true}
            animationIn={'zoomIn'}
            animationOut='fadeOut'
            backdropOpacity={0.5}
            propagateSwipe={true}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <ModalCard card={selectedCard} cards={cardsSelection} closeModal={() => setSelectedCard(null)}/>
          </Modal>
        )}
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: '#B6856C',
    },
    dotInactive: {
      backgroundColor: '#ccc',
    }
})