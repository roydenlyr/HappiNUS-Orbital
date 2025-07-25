import { View, Text, useColorScheme, ScrollView, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Colors } from '../constants/Colors';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_500Medium_Italic, Poppins_600SemiBold, Poppins_800ExtraBold, useFonts } from '@expo-google-fonts/poppins';
import { SYMPTOMS, COPING_TECHNIQUES } from '../constants/Data';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/authContext';

const ModalCard = ({card, cards, closeModal}) => {
    
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;

    const [showSymptoms, setShowSymptoms] = useState(false);
    const routeRef = useRef('/GAD');

    const {user} = useAuth();

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_300Light,
        Poppins_600SemiBold,
        Poppins_800ExtraBold,
        Poppins_500Medium_Italic
    })

    const router = useRouter();

  return (
    <View style={{width: wp(80), height: hp(60), maxWidth: 600, borderRadius: 20, backgroundColor: theme.modalCardBackground}} className='items-center py-2 px-4'>
        <ScrollView className='flex-1 w-full' showsVerticalScrollIndicator={false}>
        <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium': undefined), fontSize: hp(2), color: theme.text}}>{card?.title}</Text>
        <Text style={{textAlign: 'justify', color: theme.text}}>{card?.content}</Text>
        {
            card?.triggers?.map((section, index) => (
                <View key={index} className='py-2'>
                        <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium_Italic' : undefined), fontSize: hp(1.5), color: theme.text}} className='text-center'>{section?.header}</Text>
                        {
                            section?.points?.map((point, idx) => (
                                <Text key={idx} style={{color: theme.text}} className='mt-1'>{point}</Text>
                            ))
                        }
                    </View>
            ))
        }
        {
            (cards === COPING_TECHNIQUES || showSymptoms) && (
                card?.bullets?.map((section, index) => (
                    <View key={index} className='py-2'>
                        <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium_Italic' : undefined), fontSize: hp(1.5), color: theme.text}} className='text-center'>{section?.category}</Text>
                        {
                            section?.points?.map((point, idx) => {
                                if (section.category.includes('How Is It Different from Other Conditions?') && idx % 2 === 0) {
                                    return (
                                        <View key={idx} style={{borderColor: (idx === 0 ? theme.tableHeading : theme.tableBody)}} className={`flex-row py-1 border-b gap-4 ${idx === 0 ? 'border-t' : ''}`}>
                                            <Text style={{color: theme.text}} className='flex-1 self-center'>{section.points[idx]}</Text>
                                            <Text style={{color: theme.text}} className='flex-1 self-center'>{section.points[idx + 1]}</Text>
                                        </View>
                                    )
                                } else if (!section.category.includes('Different')) {
                                    return <Text key={idx} style={{color: theme.text}} className='mt-1'>{point}</Text>
                                } 
                            })
                        }
                    </View>
                ))
            )
        }
        {
            cards === SYMPTOMS && (
                <TouchableOpacity onPress={() => setShowSymptoms(!showSymptoms)} style={{backgroundColor: theme.ctaButton}} className='rounded-full justify-center items-center my-3 p-2'>
                    <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light' : undefined), color: theme.textContrast}}>{showSymptoms ? 'Hide' : 'Show'} Symptoms</Text>
                </TouchableOpacity>
            )
        }
        {
            cards === SYMPTOMS && (card?.title === 'Anxiety' || card?.title === 'Depression') &&  user?.role === 'student' && (
                <View>
                    <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium': undefined), fontSize: hp(2), color: theme.text}}>What You Can Do Next: </Text>
                    {
                        card?.NCOA?.map((section, index) => (
                            <View key={index} className='py-2'>
                                <Text style={{fontFamily: (fontsLoaded ? 'Poppins_500Medium_Italic' : undefined), fontSize: hp(1.5), color: theme.text}} className='text-center'>{section?.category}</Text>
                                {
                                    section?.points?.map((point, idx) => {
                                        if (point.includes('PHQ')){
                                            routeRef.current = '/PHQ';
                                        }
                                        return <Text key={idx} style={{color: theme.text}} className={`mt-1 ${point.includes('• ') ? '' : 'text-center'}`}>{point}</Text>
                                    })
                                }
                            </View>
                        ))
                    }
                    <TouchableOpacity onPress={() => {closeModal(); router.push(routeRef.current)}} className='justify-center items-center'>
                        <Text style={{fontFamily: (fontsLoaded ? 'Poppins_300Light' : undefined), backgroundColor: theme.ctaButton, color: theme.textContrast}} className='rounded-full p-2 mb-2'>Take Test</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        </ScrollView>
    </View>
  )
}

export default ModalCard