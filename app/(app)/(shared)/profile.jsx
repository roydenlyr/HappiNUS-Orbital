import { View, Text, TouchableOpacity, Alert, ScrollView, Keyboard, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Image } from 'expo-image'
import { useAuth } from '../../../context/authContext'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { blurhash } from '../../../components/common';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { auth, db, app, functions } from '../../../firebaseConfig';
import { TextInput } from 'react-native-paper';
import CustomKeyBoardView from '../../../components/CustomKeyboardView';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';

const Profile= () => {

    const {user, logout} = useAuth();
    const [profilePicture, setProfilePicture] = useState(user?.profileUrl);
    const [showChangePw, setShowChangePw] = useState(false);

    const passwordRef = useRef("");
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");

    const theme = Colors[useColorScheme()] ?? Colors.light;

    const changeProfilePicture = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Please allow photo access to change profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) return;

        const selectedImageUri = result.assets[0].uri;
        const downloadURL = await uploadImageToFirebase(selectedImageUri, user?.userId);
        if (!downloadURL) {
            Alert.alert('Upload failed', 'Unable to upload image');
            return;
        }

        try {
            await updateDoc(doc(db, 'users', user?.userId), {
            profileUrl: downloadURL,
            });
            setProfilePicture(downloadURL);
            console.log('Profile updated with image:', downloadURL);
        } catch (error) {
            console.error('Error updating Firestore:', error);
            Alert.alert('Error updating profile', error.message);
        }
    };

    const uploadImageToFirebase = async (uri, userId) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
            });

            const blob = await fetch(`data:image/jpeg;base64,${base64}`).then(res => res.blob());
            const storage = getStorage(app);
            const imageRef = ref(storage, `profilePictures/${userId}.jpg`);

            console.log('Ref: ', imageRef);
            

            await uploadBytes(imageRef, blob);
            const downloadURL = await getDownloadURL(imageRef);
            return downloadURL;
        } catch (error) {
            console.error('Failed to upload image:', error);
            return null;
        }
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const changePassword = async () => {
        if (!passwordRef.current || !newPasswordRef.current || !confirmPasswordRef.current){
            Alert.alert('Change Password', 'Please fill in all the fields!');
            return;
        }
        if (newPasswordRef.current !== confirmPasswordRef.current){
            Alert.alert('Change Password', 'Password do not match!');
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user?.email, passwordRef.current);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await updatePassword(auth.currentUser, newPasswordRef.current);
            Alert.alert('Success', 'Password updated successfully!');
            setShowChangePw(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }

    }

    const handleDeleteAccount = () => {
        Alert.alert('Delete Confirmation', 'Are you sure you want to proceed? This action cannot be undone', [{
            text: 'Dismiss'
        }, {
            text: 'Proceed',
            onPress: () => proceedWithDeletion()
        }])
    }

    const proceedWithDeletion = async () => {
        try {
            const roomQuery = query(collection(db, 'rooms'),
                where('participants', 'array-contains', user.userId),
                where('active', '==', true));

            const roomSnap = await getDocs(roomQuery);

            if (!roomSnap.empty) {
                Alert.alert('You have an Active Chat', 'Your chat will be permanently deleted. Do you wish to proceed?', [{
                    text: 'Cancel'
                }, {
                    text: 'Proceed anyway',
                    onPress: () => handleForceDelete(roomSnap.docs, user.userId)
                }])
            } else {
                await callDeleteAccount(user.userId);
            }
        } catch (error) {
            console.error('Error checking student chat: ', error);
            Alert.alert('Error', 'Could not complete deletion');
        }
    }

    const handleForceDelete = async (docs, userId) => {
        try {
            for (const docSnap of docs) {
                const roomRef = doc(db, 'rooms', docSnap.id);
                await updateDoc(roomRef, {
                    active: false,
                    inactiveOn: Timestamp.now()
                });

                const msgRef = collection(roomRef, 'messages');
                await addDoc(msgRef, {
                    type: 'system',
                    subType: 'removed',
                    text: '⚠️ This user account has been deleted.',
                    createdAt: Timestamp.now(),
                    senderName: 'system'
                });
            }

            await callDeleteAccount(userId);
        } catch (error) {
            console.error('Error ending student chat: ', error);
            Alert.alert('Error', 'Failed to clean up student chat.');
        }
    }

    const callDeleteAccount = async (userId) => {
        try {
            const deleteUser = httpsCallable(functions, 'deleteAccount');
            const result = await deleteUser({userId: userId});

            if (result.data.success) {
                Alert.alert('Success', result.data.message);
                await logout();
            }
        } catch (error) {
            console.error('User deletion error: ', error);
            Alert.alert('Error', error?.message || 'Failed to delete user.');
        }
    }

  return (
    <CustomKeyBoardView inProfile={true}>
    <ScrollView style={{backgroundColor: theme.appBackground}}>
    <View className='justify-start px-10 flex-1'>
        <View className='flex-row self-center'>
            <Image
                source={{uri: profilePicture}}
                style={{height: hp(15), aspectRatio: 1, borderRadius: 100, marginVertical: 20}}
                onTouchEnd={changeProfilePicture}
                placeholder={blurhash}
                transition={{effect: 'flip-from-bottom', duration: 500}}
            />
            <TouchableOpacity onPress={changeProfilePicture} className='rounded-full self-end mb-8 -ml-8 justify-center' style={{height: hp(3), width: hp(3), backgroundColor: theme.button}}>
                <Feather name='edit-2' size={hp(2)} color={theme.textContrast} className='self-center'/>
            </TouchableOpacity>
        </View>
        <View className='items-center'>
            <Text className='font-bold my-1' style={{fontSize: hp(3), color: theme.text}}>{user?.username}</Text>
            <Text className='font-medium' style={{color: 'gray', fontSize: hp(1.8)}}>{capitalizeFirstLetter(user?.role)}</Text>
        </View>

        {/* Email */}
        <View className='pt-10'>
            <Text className='font-medium pb-2' style={{fontSize: hp(2.5), color: theme.text}}>Email Address</Text>
            <Text className='font-medium pb-2' style={{fontSize: hp(2.2), color: 'gray'}}>{user?.email}</Text>
            <View style={{borderColor: theme.questionBorder}} className='border-b -mt-1'/>
            { !showChangePw && (
                <TouchableOpacity onPress={() => setShowChangePw(true)} className='rounded-xl mt-3 justify-center items-center flex-row gap-5 p-2' style={{backgroundColor: theme.button}}>
                    <Text className='font-semibold' style={{fontSize: hp(2.5), color: theme.textContrast}}>Change Password</Text>
                    <MaterialCommunityIcons name='key-change' size={hp(2.5)} color={theme.textContrast}/>
                </TouchableOpacity>
            )}
        </View>
        {
            showChangePw && (
                <View style={{backgroundColor: theme.cardBackground}} className='mt-3 rounded-lg p-3 gap-3'>
                    <View className='flex-row gap-3 items-center'>
                    <Text className='font-semibold flex-1' style={{fontSize: hp(2.2), color: theme.text}}>Change Password</Text>
                        <TouchableOpacity onPress={() => setShowChangePw(false)} style={{backgroundColor: theme.selectionActive}} className='rounded-xl items-center flex-1 p-1'>
                            <Text className='font-semibold' style={{fontSize: hp(2), color: theme.text}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput activeOutlineColor={theme.selectionActive} onChangeText={value => passwordRef.current = value} label={'Current Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    <TextInput activeOutlineColor={theme.selectionActive} onChangeText={value => newPasswordRef.current = value} label={'New Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    <TextInput activeOutlineColor={theme.selectionActive} onChangeText={value => confirmPasswordRef.current = value} label={'Confirm New Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    <TouchableOpacity onPress={() => changePassword()} style={{backgroundColor: theme.button}} className='rounded-xl items-center flex-1 p-2'>
                        <Text className='font-semibold' style={{fontSize: hp(2), color: theme.textContrast}}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        {
            user?.role === 'student' && (
                <View className='justify-end items-end'>
                <TouchableOpacity onPress={handleDeleteAccount} style={{backgroundColor: theme.deactivateButton}} className='rounded-xl mt-3 justify-center items-center flex-row gap-1 p-2'>
                    <Text style={{fontSize: hp(1.5), color: theme.textContrast}} className='font-medium'>Delete Account</Text>
                    <MaterialIcons name='delete-outline' size={hp(2)} color={theme.textContrast}/>
                </TouchableOpacity>
                </View>
            )
        }
    </View>
    </ScrollView>
    </CustomKeyBoardView>
  )
}

export default Profile