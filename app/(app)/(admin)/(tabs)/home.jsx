import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../../context/authContext';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FontAwesome, FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

const AdminHome = () => {

  const mapRef = useRef(null);
  const {user, refreshUser} = useAuth();
  const router = useRouter();

  const [alerts, setAlerts] = useState([]);
  const [previousAlertIds, setPreviousAlertIds] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalActiveChats, setTotalActiveChats] = useState(0)

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), where('active', '==', true));

    const unsub = onSnapshot(q, snapshot => {
      const activeAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const newAlert = activeAlerts.find(a => !previousAlertIds.includes(a.id));

      if (newAlert) {
        if (newAlert && newAlert.triggeredBy !== user.username) {
          Toast.show({
            type: 'info',
            text1: '🚨 New Red Alert',
            text2: `Triggered by ${newAlert.triggeredBy}`,
            position: 'top',
            onPress: () => {router.push('/(admin)/(tabs)/home'); Toast.hide();}
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
      setPreviousAlertIds(activeAlerts.map(a => a.id));
    });
    return () => unsub();
  }, []);

  const focusOnAlert = (alert) => {
    if (mapRef.current && alert?.location) {
      mapRef.current.animateToRegion({
        latitude: alert.location.latitude,
        longitude: alert.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  }

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      let studentCount = 0;
      let mentorCount = 0;

      snapshot.forEach(doc => {
        const role = doc.data().role;
        if (role === 'student') studentCount++;
        else if (role === 'mentor') mentorCount++;
      });
      setTotalStudents(studentCount);
      setTotalMentors(mentorCount);
    });

    const unsubChats = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      let activeChatCount = 0;

      snapshot.forEach(doc => {
        if (doc.data().active) activeChatCount++;
      });
      setTotalActiveChats(activeChatCount);
    });
    return () => {
      unsubUsers();
      unsubChats();
    }
  })

  return (
    <View className='flex-1 bg-white p-5'>
      <View className='mb-5 rounded-xl overflow-hidden'>
        <MapView key={alerts.map(a=> a.id).join(',')} style={{height: hp(25), width: '100%'}}
          initialRegion={{
            latitude: 1.29773,
            longitude: 103.77667,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15
          }}
          ref={mapRef}
        >
          {
            alerts?.map((alert) => (
              <Marker key={alert?.id}
              coordinate={{latitude: alert.location.latitude, longitude: alert.location.longitude}}
              title={alert.triggeredBy}
              description={`Triggered at ${alert.timestamp.toDate().toLocaleString()}`}
              />
            ))
          }
        </MapView>
      </View>
      <View style={{maxHeight: hp(15)}} className='bg-neutral-200 rounded-xl'>
        <ScrollView className='p-3'>
          {
            alerts.length > 0 ? alerts.map((alert, index) => (
              <Pressable key={alert.id} className='justify-center' onPress={() => focusOnAlert(alert)}>
                <Text className='font-semibold'>Triggered By: {alert.triggeredBy}</Text>
                <Text className='mt-1 mb-1'>Location: {alert.locationName}</Text>
                <Text>Time: {alert.timestamp.toDate().toLocaleString()}</Text>
                {
                  index !== alerts.length - 1 ? (<View className='mt-2 mb-2 border-b border-neutral-400'/>) : <View className='mb-2'/>
                }
              </Pressable>
            )) : <Text className='self-center font-semibold'>No Active Alerts...</Text>
          }
        </ScrollView>
      </View>
      <Text className='mt-16 border-b-2 border-neutral-300 text-center font-bold pb-2' style={{fontSize: hp(3)}}>Platform Summary</Text>
      <View className='flex-row pt-5'>
          <View className='flex-1 items-center justify-center'>
            <FontAwesome6 name='user-graduate' size={hp(5)} color={'black'}/>
            <Text className='font-light mb-10 mt-2' style={{fontSize: hp(2)}}>Students</Text>
            <Text className='font-extrabold' style={{fontSize: hp(3.5)}}>{totalStudents}</Text>
          </View>
          <View className='flex-1 items-center justify-center border-x-2 border-neutral-300'>
            <FontAwesome5 name='chalkboard-teacher' size={hp(5)} color={'black'}/>
            <Text className='font-light mb-10 mt-2' style={{fontSize: hp(2)}}>Mentors</Text>
            <Text className='font-extrabold' style={{fontSize: hp(3.5)}}>{totalMentors}</Text>
          </View>
          <View className='flex-1 items-center justify-center'>
            <FontAwesome6 name='comments' size={hp(5)} color={'black'}/>
            <Text className='font-light mb-10 mt-2' style={{fontSize: hp(2)}}>Ongoing Chats</Text>
            <Text className='font-extrabold' style={{fontSize: hp(3.5)}}>{totalActiveChats}</Text>
          </View>
      </View>
    </View>
  )
}

export default AdminHome