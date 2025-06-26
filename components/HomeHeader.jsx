import { View, Text, Platform, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from './common';
import { useAuth } from '../context/authContext';
import { Menu } from 'react-native-paper';
import { MenuItem, Divider } from './CustomMenuItems';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HomeHeader = () => {

    const {user, logout} = useAuth();
    const ios = Platform.OS === 'ios';
    const {top} = useSafeAreaInsets();
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleProfile = () => {
      router.push({pathname: '/profile'});
    }

    const handleLogout = async () => {
        await logout();
    }

  return (
    <View className='bg-white'>
    <View style={{paddingTop: ios? top : top + 10}} className='flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl' >
      <View className='justify-center'>
        <Text style={{fontSize: hp(3)}} className='font-medium text-white'>HappiNUS</Text>
      </View>
        
      <View className='items-end'>
       <Menu
            visible={visible} onDismiss={closeMenu} anchor={
                <Image
                    onTouchEnd={openMenu}
                    style={{height: hp(4.3), aspectRatio: 1, borderRadius: 100}}
                    source={{uri: user?.profileUrl}}
                    placeholder={blurhash}
                    transition={500}
                />
            }
            contentStyle={{borderRadius: 10, borderCurve: 'continuous', marginTop: 40, marginLeft: -30, backgroundColor: 'white', 
                shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}}}
            >
            <MenuItem text='Profile' action={handleProfile} value={null} icon={<Feather name='user' size={hp(2.5)} color='#737373' />}/>
            <Divider/>
            <MenuItem text='Sign out' action={handleLogout} value={null} icon={<AntDesign name='logout' size={hp(2.5)} color='#737373' />}/>
        </Menu>
      </View>
    </View>
    </View>
  )
}

export default HomeHeader