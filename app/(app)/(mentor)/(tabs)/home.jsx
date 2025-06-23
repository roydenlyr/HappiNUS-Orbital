import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';
import { addDoc, collection, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAuth } from '../../../../context/authContext';
import MapView, { Marker } from 'react-native-maps';

const Home = () => {

  const [activateAlert, setActivateAlert] = useState(undefined);
  const [alerts, setAlerts] = useState([]);
  const {user} = useAuth();

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

      await addDoc(collection(db, 'alerts'), {
        active: true,
        triggeredBy: user.username,
        location: coords,
        timestamp: Timestamp.now()
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
        Alert.alert('Red Alert', 'Your Alert has been deactivated.');      
        setActivateAlert(null);
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'alerts'), where('active', '==', true));

    const unsub = onSnapshot(q, snapshot => {
      const activeAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(activeAlerts);
      // console.log('Updating Alerts...');
      
    });
    return () => unsub();
  }, []);

//   useEffect(() => {
//   console.log('Active Alerts: ', alerts);
// }, [alerts]);

  useEffect(() => {
    // console.log('Alert Status: ', activateAlert);
    handleAlert();
  }, [activateAlert]);

  return (
    <View className='flex-1 bg-white p-10'>
      <View className='mb-5 rounded-xl overflow-hidden'>
      <MapView key={alerts.map(a => a.id).join(',')} style={{height: hp(25), width: '100%'}} initialRegion={{
        latitude: 1.29773,
        longitude: 103.77667,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15
      }}>
        {          
        alerts && alerts.length > 0 && alerts?.map((alert) => (
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
          <TouchableOpacity onPress={() => setActivateAlert(false)} className='flex-row rounded-xl bg-red-500 justify-center items-center gap-5 p-5'>
            <Feather name='bell-off' size={hp(3)} color={'white'}/>
            <Text className='font-semibold text-white' size={hp(3)}>Deactivate</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setActivateAlert(true)} className='flex-row rounded-xl bg-green-500 justify-center items-center gap-5 p-5'>
            <Feather name='bell' size={hp(3)} color={'white'}/>
            <Text className='font-semibold text-white' size={hp(3)}>Activate</Text>
          </TouchableOpacity>
        )
      }
      
    </View>
  )
}

export default Home