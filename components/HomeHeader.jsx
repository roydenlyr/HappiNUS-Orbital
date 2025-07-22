import { View, Text, Platform, StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { blurhash } from './common';
import { useAuth } from '../context/authContext';
import { Menu } from 'react-native-paper';
import { MenuItem, Divider } from './CustomMenuItems';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Logo from '../assets/images/SplashScreen.svg';
import LogoDark from '../assets/images/SplashScreen(Dark).svg';
import { Colors } from '../constants/Colors';

const HomeHeader = () => {

    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const {user, logout} = useAuth();
    const ios = Platform.OS === 'ios';
    const {top} = useSafeAreaInsets();
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleProfile = () => {
      router.push({pathname: '/profile', params: {router}});
      closeMenu();
    }

    const handleLogout = async () => {
        await logout();
        closeMenu();
    }

  return (
    <View style={{backgroundColor: theme.appBackground}}>
    <View style={{paddingTop: ios? top : top + 10, backgroundColor: theme.homeHeaderBackground}} className='flex-row justify-between px-5 pb-6 rounded-b-3xl' >
      <View className='justify-center flex-1 items-center -my-20'>
        {
          colorScheme === 'light' ? (
            <Logo width={'100%'} height={hp(20)}/>
          ) : (
            <LogoDark width={'100%'} height={hp(20)}/>
          )
        }
      </View>
        
      <View className='items-end justify-center'>
       <Menu
            visible={visible} onDismiss={closeMenu} anchor={
                <Image
                    onTouchEnd={openMenu}
                    style={{height: hp(4.8), aspectRatio: 1, borderRadius: 100, borderColor: theme.border, borderWidth: '0.8'}}
                    source={{uri: user?.profileUrl}}
                    placeholder={blurhash}
                    transition={500}
                />
            }
            contentStyle={{borderRadius: 10, borderCurve: 'continuous', marginTop: 40, marginLeft: -30, backgroundColor: theme.cardBackground, 
                shadowOpacity: 0.2, shadowOffset: {width: 0, height: 0}}}
            >
            <MenuItem text='Profile' action={handleProfile} value={null} icon={<Feather name='user' size={hp(2.5)} color={theme.icon} />}/>
            <Divider/>
            <MenuItem text='Sign out' action={handleLogout} value={null} icon={<AntDesign name='logout' size={hp(2.5)} color={theme.icon} />}/>
        </Menu>
      </View>
    </View>
    </View>
  )
}

export default HomeHeader