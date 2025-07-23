import { View, Text, TouchableOpacity, Alert, ScrollView, Pressable, useColorScheme, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';
import { addDoc, collection, doc, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db, usersRef } from '../../../../firebaseConfig';
import { useAuth } from '../../../../context/authContext';
import MapView, { Circle, Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { Colors } from '../../../../constants/Colors';
import { SYMPTOMS, COPING_TECHNIQUES } from '../../../../constants/Data';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold_Italic, Poppins_600SemiBold, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import TitleCard from '../../../../components/TitleCard';
import Modal from 'react-native-modal';
import ModalCard from '../../../../components/ModalCard';
import Carousel from 'react-native-reanimated-carousel';

const Home = () => {

  const mapRef = useRef(null);
  const {user, refreshUser} = useAuth();
  const router = useRouter();

  const [activateAlert, setActivateAlert] = useState(user?.activeAlert);
  const [alerts, setAlerts] = useState([]);
  const [previousAlertIds, setPreviousAlertIds] = useState([]);
  const [toggleAlert, setToggleAlert] = useState(null);

  const [cardsSelection, setCardsSelection] = useState(SYMPTOMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const theme = Colors[useColorScheme()] ?? Colors.light;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold_Italic,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light
  });

  const handleAlert = async () => {
    if (activateAlert){
      console.log('Alert activated...');
      
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        Alert.alert('Permission Denied', 'Location access is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      let locationName = 'undefined';
      try {
        const geocode = await Location.reverseGeocodeAsync(coords);
        if(geocode.length > 0){
          const place = geocode[0];
          locationName = `${place.name}, ${place.city} (${place.isoCountryCode + place.postalCode})`;
        }
      } catch (error) {
        console.error('Failed to reverse geocode: ', error);
      }

      await addDoc(collection(db, 'alerts'), {
        active: true,
        triggeredBy: user.username,
        location: coords,
        locationName,
        timestamp: Timestamp.now()
      });

      await updateDoc(doc(db, 'users', user.userId), {activeAlert: true});

      Toast.show({
        type: 'customAlert',
        text1: 'Red Alert Activated',
        text2: `Triggered by ${user.username}`,
        position: 'top',
        props: {
          type: 'error',
        }
      });
    } else if (activateAlert === false) {
        console.log('Deactivating Alert...');
        const q = query(
          collection(db, 'alerts'),
          where('active', '==', true),
          where('triggeredBy', '==', user.username)
        );

        const snapshot = await getDocs(q);
        const updates = snapshot.docs.map(doc => 
          updateDoc(doc.ref, {
            active: false,
            deactivatedAt: Timestamp.now()
          }));

        await Promise.all(updates);
        await updateDoc(doc(db, 'users', user.userId), {activeAlert: false});
        Alert.alert('Red Alert', 'Your Alert has been deactivated.');      
        //setActivateAlert(null);

        Toast.show({
          type: 'customAlert',
          text1: 'Alert Deactivated',
          text2: 'Your red alert has been turned off.',
          position: 'top',
          props: {
            type: 'success'
          }
        });
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'alerts'), where('active', '==', true));

    const unsub = onSnapshot(q, snapshot => {
      const activeAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const newAlert = activeAlerts.find(a => !previousAlertIds.includes(a.id));

      if (newAlert){

      if (newAlert && newAlert.triggeredBy !== user.username){
        Toast.show({
        type: 'customAlert',
        text1: 'New Red Alert',
        text2: `Triggered by ${newAlert.triggeredBy}`,
        position: 'top',
        props: {
          type: 'error'
        },
        onPress: () => {router.push('/(mentor)/(tabs)/home'); Toast.hide();}
      });
      }

      if (mapRef.current && newAlert?.location) {
        mapRef.current.animateToRegion({
        latitude: newAlert.location.latitude,
        longitude: newAlert.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }, 500);
    }
  }

      setAlerts(activeAlerts);
      setPreviousAlertIds(activeAlerts.map(a => a.id))
      
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (toggleAlert !== null){
      setActivateAlert(toggleAlert);
    }
  }, [toggleAlert]);

  useEffect(() => {
    if (toggleAlert !== null)
    handleAlert();
  }, [activateAlert])

  const focusOnAlert = (alert) => {
    if (mapRef.current && alert?.location){
      mapRef.current.animateToRegion({
        latitude: alert.location.latitude,
        longitude: alert.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  }

  useEffect(() => {
    refreshUser();
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
    <View style={{backgroundColor: theme.appBackground}} className='flex-1 pt-5'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flex: 1}}>
        <View style={{width: wp(90)}} className='self-center'>
          <View className='mb-3 rounded-xl overflow-hidden'>
            <MapView key={alerts.map(a => a.id).join(',')} style={{height: hp(25), width: '100%'}} initialRegion={{
              latitude: 1.29773,
              longitude: 103.77667,
              latitudeDelta: 0.15,
              longitudeDelta: 0.15
            }} ref={mapRef}>
              {
              alerts?.map((alert) => (
                <Marker key={alert?.id}
                coordinate={{latitude: alert?.location?.latitude, longitude: alert?.location?.longitude}}
                title={alert?.triggeredBy}
                description={`Triggered at ${alert.timestamp.toDate().toLocaleString()}`}
                />
              ))}
            </MapView>
          </View>
          {
            activateAlert ? (
              <TouchableOpacity onPress={() => setToggleAlert(false)} style={{backgroundColor: theme.deactivateButton}} className='flex-row rounded-xl justify-center items-center gap-5 p-5'>
                <Feather name='bell-off' size={hp(3)} color={theme.textContrast}/>
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), color: theme.textContrast, fontSize: hp(2.3)}}>Deactivate</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setToggleAlert(true)} style={{backgroundColor: theme.activateButton}} className='flex-row rounded-xl justify-center items-center gap-5 p-5'>
                <Feather name='bell' size={hp(3)} color={theme.textContrast}/>
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_400Regular': undefined), color: theme.textContrast, fontSize: hp(2.3)}}>Activate</Text>
              </TouchableOpacity>
            )
          }
          <View style={{maxHeight: hp(15), backgroundColor: theme.cardBackground}} className='mt-3 rounded-xl'>
            <ScrollView className='p-3'>
              {
                alerts.length > 0 ? alerts.map((alert, index) => (
                  <Pressable key={alert.id} className='justify-center' onPress={() => focusOnAlert(alert)}>
                    <Text style={{color: theme.text}} className='font-semibold'>Triggered By: {alert.triggeredBy}</Text>
                    <Text style={{color: theme.text}} className='my-1'>Location: {alert.locationName}</Text>
                    <Text style={{color: theme.text}}>Time: {alert.timestamp.toDate().toLocaleString()}</Text>
                    {
                      index !== alerts.length - 1 ? (<View className='my-2 border-b border-neutral-400'/>) : <View className='mb-2'/>
                    }
                  </Pressable>
                )) : <Text style={{color: theme.text}} className='self-center font-semibold'>No Active Alerts...</Text>
              }
            </ScrollView>
          </View>

          
          <View className='items-start mt-3'>
            <View className='flex-row gap-3'>
              <TouchableOpacity onPress={handleSelection} style={{backgroundColor: cardsSelection === SYMPTOMS ? theme.selectionActive : theme.selectionInactive}} className='rounded-full p-3 justify-center items-center'>
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light': undefined), fontSize: hp(1.3), color: theme.textContrast}}>Recognise the Signs</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSelection} style={{backgroundColor: cardsSelection === COPING_TECHNIQUES ? theme.selectionActive : theme.selectionInactive}} className='rounded-full p-3 justify-center items-center'>
                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light': undefined), fontSize: hp(1.3), color: theme.textContrast}}>Coping Techniques</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
        containerStyle={{alignSelf: 'center'}}
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
            animationOut={'fadeOut'}
            backdropOpacity={0.5}
            propagateSwipe={true}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          >
            <ModalCard card={selectedCard} cards={cardsSelection} closeModal={() => setSelectedCard(null)}/>
          </Modal>
        )} 
        </ScrollView>
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