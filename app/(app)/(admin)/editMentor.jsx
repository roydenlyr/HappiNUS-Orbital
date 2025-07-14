import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db, functions } from '../../../firebaseConfig';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import CustomKeyBoardView from '../../../components/CustomKeyboardView';
import { Image } from 'expo-image';
import { blurhash } from '../../../components/common';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather, Ionicons } from '@expo/vector-icons';
import Loading from '../../../components/Loading';

const genderOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Others', value: 'Others' },
]

const facultyOptions = [
  { label: 'College of Design & Engineering', value: 'Collge of Design & Engineering' },
  { label: 'School of Computing', value: 'School of Computing' },
  { label: 'NUS Business School', value: 'NUS Business School' },
  { label: 'Faculty of Arts & Social Sciences', value: 'Faculty of Arts & Social Sciences' },
  { label: 'Yong Loo Lin School of Medicine', value: 'Yong Loo Lin School of Medicine' },
  { label: 'Faculty of Law', value: 'Faculty of Law' },
]

const EditMentor = () => {

    const mentor = useLocalSearchParams();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);
    const [faculty, setFaculty] = useState(mentor.faculty);
    const [gender, setGender] = useState(mentor.gender);
    const [name, setName] = useState(mentor.username);
    const [dob, setDob] = useState(mentor.dob);
    const [matricYear, setMatricYear] = useState(mentor.matricYear);
    const [originalMentor, setOriginalMentor] = useState(mentor);

    const handleDelete = () => {
        Alert.alert('Delete Confirmation', 'Are you sure you want to proceed? This action cannot be undone.', [{
            text:'Dismiss'
        }, {
            text: 'Proceed',
            onPress: () => proceedWithDeletion()
        }])
    }

    const proceedWithDeletion = async () => {
        try {
            const roomQuery = query(collection(db, 'rooms'), 
                where('participants', 'array-contains', mentor.userId),
                where('active', '==', true));

            const roomSnap = await getDocs(roomQuery);

            if (!roomSnap.empty) {
                Alert.alert('Mentor has Active Chats', 
                    `Mentor is currently in ${roomSnap.size} active chat${roomSnap.size > 1 ? 's' : ''}. Proceeding will end all of them.`,
                    [{
                        text: 'Cancel'
                    }, {
                        text: 'Proceed Anyway',
                        onPress: () => handleForceDelete(roomSnap.docs, mentor.userId)
                    }]
                );
            } else {                
                await callDeleteMentor(mentor.userId);
            }
        } catch (error) {
            console.error('Error checking mentor chats: ', error);
            Alert.alert('Error', 'Could not complete deletion');
        }
    }

    const handleForceDelete = async (docs, mentorId) => {
        try {
            for (const docSnap of docs){
                const roomRef = doc(db, 'rooms', docSnap.id);
                await updateDoc(roomRef, {
                    active: false // Don't set inactiveOn to allow student to retain the chatroom until student initiates handover
                });

                const msgRef = collection(roomRef, 'messages');
                await addDoc(msgRef, {
                    type: 'system',
                    subType: 'removed',
                    text: `⚠️ This mentor is no longer available as their account has been removed by an admin.${'\n'}Please select a new mentor to continue, or end the chat if you wish.`,
                    createdAt: Timestamp.now(),
                    senderName: 'system'
                });
            }

            await callDeleteMentor(mentorId);
        } catch (error) {
            console.error('Error ending mentor chats: ', error);
            Alert.alert('Error', 'Failed to clean up mentor chats.');
        }
    }

    const callDeleteMentor = async (mentorId) => {
        try {
            const deleteMentor = httpsCallable(functions, 'deleteAccount');
            const result = await deleteMentor({userId: mentorId});

            if (result.data.success) {
                Alert.alert('Success', result.data.message);
                router.back();
            }
        } catch (error) {
            console.error('Mentor deletion error: ', error);
            Alert.alert('Error', error?.message || 'Failed to delete mentor.');
        }
    }

    const handleUpdate = async () => {
        if (!name || !faculty || !gender || !dob || !matricYear) {
            Alert.alert('Update Mentor', 'Please fill in all fields!');
            return;
        }
        
        try {
            setLoading(true);
            await updateDoc(doc(db, 'users', mentor.userId), {
                username: name,
                faculty: faculty,
                gender: gender,
                dob: dob,
                matricYear: matricYear
            })

            setOriginalMentor({
                username: name,
                faculty,
                gender,
                dob,
                matricYear,
            })
            Alert.alert('Success', 'Mentor profile updated.');
            setEnableEdit(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update mentor');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
     if (!enableEdit) {
        setName(originalMentor.username);
        setFaculty(originalMentor.faculty);
        setGender(originalMentor.gender);
        setDob(originalMentor.dob);
        setMatricYear(originalMentor.matricYear);
     }   
    }, [enableEdit]);

  return (
    <CustomKeyBoardView>
        <ScrollView className='bg-white'>
            <View className='flex-1 px-10'>
                <View className='items-center'>
                    <Image
                        source={{uri: mentor.profileUrl}}
                        style={{height: hp(15), aspectRatio: 1, borderRadius: 100, marginVertical: 20}}
                        placeholder={blurhash}
                        transition={{effect: 'flip-from-bottom', duration: 500}}
                    />
                </View>

                <View className='gap-8'>
                    <TouchableOpacity onPress={() => setEnableEdit(prev => !prev)} className='bg-indigo-500 rounded-xl p-3 justify-center items-center'>
                        <Text className='font-semibold text-white' style={{fontSize: hp(2)}}>{enableEdit ? 'Cancel Changes' : 'Enable Edit'}</Text>
                    </TouchableOpacity>
                    
                    <View className='gap-4'>
                        <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                            <Feather name='user' size={hp(2.7)} color={enableEdit ? 'black' : 'gray'}/>
                            <TextInput editable={enableEdit} value={name} onChangeText={setName} style={{fontSize: hp(2), color: (enableEdit ? 'black' : 'gray')}} className='flex-1' placeholder={name} placeholderTextColor={'gray'} />
                        </View>
                        <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                            <Ionicons name='school-outline' size={hp(2.7)} color={enableEdit ? 'black' : 'gray'}/>
                            <Dropdown disable={!enableEdit} style={{flex: 1}} containerStyle={{borderRadius: 12}} data={facultyOptions} labelField={'label'} valueField={'value'} placeholder={'Faculty'} placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                                selectedTextStyle={{fontSize: hp(2), color: (enableEdit ? 'black' : 'gray')}} itemTextStyle={{fontSize: hp(2)}} value={faculty} onChange={item => setFaculty(item.value)} />
                        </View>
                        <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                            <Ionicons name='transgender-outline' size={hp(2.7)} color={enableEdit ? 'black' : 'gray'}/>
                            <Dropdown disable={!enableEdit} style={{flex: 1}} containerStyle={{borderRadius: 12}} data={genderOptions} labelField={'label'} valueField={'value'} placeholder={'Gender'} placeholderStyle={{color: 'gray', fontSize: hp(2)}}
                                selectedTextStyle={{fontSize: hp(2), color: (enableEdit ? 'black' : 'gray')}} itemTextStyle={{fontSize: hp(2), color: (enableEdit? 'black' : 'gray')}} value={gender} onChange={item => setGender(item.value)} />
                        </View>
                        <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                            <Feather name='calendar' size={hp(2.7)} color={enableEdit ? 'black' : 'gray'}/>
                            <TextInput editable={enableEdit} keyboardType='numeric' maxLength={4} value={dob} onChangeText={setDob} style={{fontSize: hp(2), color: (enableEdit ? 'black' : 'gray')}} className='flex-1 text-neutral-700' placeholder={`Year of Birth`} placeholderTextColor={'gray'}  />
                        </View>
                        <View style={{height: hp(7)}} className='flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl'>
                            <Feather name='calendar' size={hp(2.7)} color={enableEdit ? 'black' : 'gray'}/>
                            <TextInput editable={enableEdit} keyboardType='numeric' maxLength={4} value={matricYear} onChangeText={setMatricYear} style={{fontSize: hp(2), color: (enableEdit ? 'black' : 'gray')}} className='flex-1 text-neutral-700' placeholder={`Matriculation Year: ${mentor.matricYear}`} placeholderTextColor={'gray'}  />
                        </View>
                        {
                            loading ? (
                                <View className='justify-center items-center'>
                                    <Loading size={hp(10)}/>
                                </View>
                            ) : enableEdit && (
                                <TouchableOpacity onPress={handleUpdate} className='bg-green-500 rounded-xl p-3 justify-center items-center'>
                                    <Text className='font-semibold text-white' style={{fontSize: hp(2)}}>Update Mentor</Text>
                                </TouchableOpacity>
                            )
                        }
                        {
                            enableEdit && (
                                <TouchableOpacity onPress={handleDelete} className='bg-rose-500 rounded-xl p-3 justify-center items-center'>
                                    <Text className='font-semibold text-white' style={{fontSize: hp(2)}}>Delete mentor</Text>
                                </TouchableOpacity>
                            )
                        }
                        
                    </View>
                </View>
                
                
            </View>
        </ScrollView>
    </CustomKeyBoardView>
    
  )
}

export default EditMentor