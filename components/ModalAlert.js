import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_500Medium_Italic, Poppins_600SemiBold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';

const ModalAlert = ({header, text, isVisible, theme, onClose, onUse}) => {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_300Light,
        Poppins_600SemiBold,
        Poppins_800ExtraBold,
        Poppins_500Medium_Italic
    })
  return (
    <Modal 
        isVisible={isVisible}
        onBackdropPress={onClose}
        hideModalContentWhileAnimating={true}
        animationIn={'zoomIn'}
        animationOut={'fadeOut'}
        backdropOpacity={0.5}
        propagateSwipe={true}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
    >
        <View style={{width: wp(80), maxWidth: 600, maxHeight: hp(40), borderRadius: 20, backgroundColor: theme.modalCardBackground}} className='items-center p-2 justify-center'>
            <ScrollView className='w-full p-3' contentContainerStyle={{justifyContent: 'center'}} showsVerticalScrollIndicator={false}>
                <Text className='text-center mb-3' style={{ fontFamily: (fontsLoaded ? 'Poppins_500Medium': undefined), color: theme.header}}>{header}</Text>
                <Text style={{color: theme.text, textAlign: 'justify'}}>{text}</Text>
                {
                    header === 'Summary' ? (
                        <TouchableOpacity onPress={onClose} style={{backgroundColor: theme.button}} className='p-3 rounded-xl justify-center items-center mt-3'>
                            <Text style={{color: theme.textContrast, fontSize: hp(1.8)}}>OK</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className='flex-row justify-end items-center gap-3 mt-3'>
                            <TouchableOpacity onPress={onClose} style={{backgroundColor: theme.button}} className='p-3 rounded-xl justify-center items-center flex-1'>
                                <Text style={{color: theme.textContrast, fontSize: hp(1.8)}}>Dismiss</Text>
                            </TouchableOpacity>
                            {
                                !text.includes('This message cannot be rephrased because it does not appear to be a peer support context.') && (
                                    <TouchableOpacity onPress={onUse} style={{backgroundColor: theme.button}} className='p-3 rounded-xl justify-center items-center flex-1'>
                                        <Text style={{color: theme.textContrast, fontSize: hp(1.8)}}>Use</Text>
                                    </TouchableOpacity>
                                )
                            }
                            
                        </View>
                    )
                }
                
            </ScrollView>
        </View>
    </Modal>
  )
}

export default ModalAlert