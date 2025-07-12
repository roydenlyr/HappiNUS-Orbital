import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { addDoc, collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db, functions } from '../../../firebaseConfig';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

const EditMentor = () => {

    const mentor = useLocalSearchParams();
    const router = useRouter();

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
                console.log('mentor has no active chats');
                
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

  return (
    <View className='flex-1 bg-white p-5'>
      <TouchableOpacity onPress={handleDelete} className='bg-rose-400 rounded-xl p-3 justify-center items-center'>
        <Text className='font-semibold text-white' style={{fontSize: hp(2)}}>Delete mentor</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditMentor