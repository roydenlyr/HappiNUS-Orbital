import { View, Text, TouchableOpacity, Alert, ScrollView, useColorScheme } from 'react-native'
import React, { useState } from 'react'
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
import { Colors } from '../../../constants/Colors';
import { LoadingSmile } from '../../../components/Animation';

const Profile= () => {

    const {user, logout} = useAuth();
    const [profilePicture, setProfilePicture] = useState(user?.profileUrl);
    const [showChangePw, setShowChangePw] = useState(false);

    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [changePwLoading, setChangePwLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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
        } catch (error) {
            console.error('Error updating Firestore:', error);
            Alert.alert('Error updating profile', error.message);
        }
    };

    const uploadImageToFirebase = async (uri, userId) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const storage = getStorage(app);
            const imageRef = ref(storage, `profilePictures/${userId}.jpg`);            

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
        if (!currentPw || !newPw || !confirmPw){
            Alert.alert('Change Password', 'Please fill in all the fields!');
            return;
        }
        if (newPw !== confirmPw){
            Alert.alert('Change Password', 'Password do not match!');
            return;
        }

        try {
            setChangePwLoading(true);
            const credential = EmailAuthProvider.credential(user?.email, currentPw);
            await reauthenticateWithCredential(auth.currentUser, credential);
            
            if (currentPw === newPw) {
                Alert.alert('Password Unchanged', 'Your new password is the same as your current one. Please choose a different password.');
                return;
            }

            await updatePassword(auth.currentUser, newPw);
            Alert.alert('Success', 'Password updated successfully!');
            setShowChangePw(false);
        } catch (error) {
            // console.error(error);
            Alert.alert('Invalid Password', 'The password entered is incorrect. Please try again.');
        } finally {
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
            setChangePwLoading(false);
        }

    }

    const handleDeleteAccount = () => {
        Alert.alert('Delete Confirmation', 'Are you sure you want to proceed? This action cannot be undone', [{
            text: 'Dismiss'
        }, {
            text: 'Proceed',
            onPress: () => proceedWithDeletion()
        }])
        setDeleteLoading(false);
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
        } finally {
            setDeleteLoading(false);
        }
    }

    const handleForceDelete = async (docs, userId) => {
        setDeleteLoading(true);
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
                    senderName: 'system',
                    delete: user.userId
                });
            }

            await callDeleteAccount(userId);
        } catch (error) {
            console.error('Error ending student chat: ', error);
            Alert.alert('Error', 'Failed to clean up student chat.');
        }
    }

    const callDeleteAccount = async (userId) => {
        setDeleteLoading(true);
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
        } finally {
            setDeleteLoading(false);
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
                    <TextInput value={currentPw} activeOutlineColor={theme.selectionActive} onChangeText={value => setCurrentPw(value)} label={'Current Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    <TextInput value={newPw} activeOutlineColor={theme.selectionActive} onChangeText={value => setNewPw(value)} label={'New Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    <TextInput value={confirmPw} activeOutlineColor={theme.selectionActive} onChangeText={value => setConfirmPw(value)} label={'Confirm New Password'} mode='outlined' fontSize={hp(2)} secureTextEntry></TextInput>
                    {
                        changePwLoading ? (
                            <View className='justify-center items-center'>
                                <LoadingSmile size={hp(15)}/>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => changePassword()} style={{backgroundColor: theme.button}} className='rounded-xl items-center flex-1 p-2'>
                                <Text className='font-semibold' style={{fontSize: hp(2), color: theme.textContrast}}>Confirm</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            )
        }
        {
            user?.role === 'student' && (
                deleteLoading ? (
                    <View className='items-center justify-center'>
                        <LoadingSmile size={hp(20)} />
                        <Text style={{color: theme.header, fontSize: hp(2)}} className='-mt-10'>Loading</Text>
                    </View>
                ) : (
                    <View className='justify-end items-end'>
                        <TouchableOpacity onPress={handleDeleteAccount} style={{backgroundColor: theme.deactivateButton}} className='rounded-xl mt-3 justify-center items-center flex-row gap-1 p-2'>
                            <Text style={{fontSize: hp(1.5), color: theme.textContrast}} className='font-medium'>Delete Account</Text>
                            <MaterialIcons name='delete-outline' size={hp(2)} color={theme.textContrast}/>
                        </TouchableOpacity>
                    </View>
                )
            )
        }
        {
            user?.role === 'mentor' && (
                <View className='mt-3 gap-5'>
                    <View style={{borderColor: theme.questionBorder}} className='border-b -mt-1'>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.5), color: theme.text}}>Faculty</Text>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.2), color: 'gray'}}>{user?.faculty}</Text>
                    </View>
                    <View style={{borderColor: theme.questionBorder}} className='border-b -mt-1'>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.5), color: theme.text}}>Gender</Text>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.2), color: 'gray'}}>{user?.gender}</Text>
                    </View>
                    <View style={{borderColor: theme.questionBorder}} className='border-b -mt-1'>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.5), color: theme.text}}>Date of Birth</Text>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.2), color: 'gray'}}>{user?.dob}</Text>
                    </View>
                    <View style={{borderColor: theme.questionBorder}} className='border-b -mt-1'>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.5), color: theme.text}}>Matriculation Year</Text>
                        <Text className='font-medium pb-2' style={{fontSize: hp(2.2), color: 'gray'}}>{user?.matricYear}</Text>
                    </View>
                    <Text className='font-medium pb-2 text-center' style={{fontSize: hp(1.2), color: 'gray'}}>
                        If any of the information is inaccurate, kindly reach out to the admin to request an update.
                    </Text>
                </View>
            )
        }
    </View>
    </ScrollView>
    </CustomKeyBoardView>
  )
}

export default Profile