import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, useSegments, useRouter } from 'expo-router'
import '../global.css'
import { AuthContextProvider, useAuth } from '../context/authContext'
import { Provider as PaperProvider } from 'react-native-paper';
import { UserListProvider } from '../context/userListProvider'
import Toast from 'react-native-toast-message';
import CustomToastConfig from '../components/CustomToastConfig'
import { ChatContextProvider } from '../context/chatContext';

const MainLayout = () => {
  const {isAuthenticated, user} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated    
    if(typeof isAuthenticated == 'undefined'){
      return;
    }
      
    const inApp = segments[0] === '(app)';
    const isAuthPage = segments[0] === 'signIn' || segments[0] === 'signUp';
    const role = user?.role;

    if(isAuthenticated && !inApp){
      // Redirect to Home      
      if (role === 'student')
        router.replace('/(app)/(student)/(tabs)/home');
      else if (role === 'mentor')
        router.replace('/(app)/(mentor)/(tabs)/home');
      else if (role === 'admin')
        router.replace('/(app)/(admin)/(tabs)/addMentor');
    } else if (!isAuthenticated && !isAuthPage){
      // Redirect to Sign in
      router.replace('/signIn');
    }
  }, [isAuthenticated, router, segments, user])

  return <Slot/>
}

const RootLayout = () => {
  return (
    <PaperProvider>
      <AuthContextProvider>
        <UserListProvider>
          <ChatContextProvider>
            <MainLayout/>
            <Toast config={CustomToastConfig}/>
          </ChatContextProvider>
        </UserListProvider>
      </AuthContextProvider>
    </PaperProvider>
  )
}

export default RootLayout