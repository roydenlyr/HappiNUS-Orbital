import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, useSegments, useRouter } from 'expo-router'
import '../global.css'
import { AuthContextProvider, useAuth } from '../context/authContext'
import { Provider as PaperProvider } from 'react-native-paper';
import { UserListProvider } from '../context/userListProvider'


const MainLayout = () => {
  const {isAuthenticated, user} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if(typeof isAuthenticated == 'undefined' || !user)
      return;

    const inApp = segments[0] === '(app)';
    const isAuthPage = segments[0] === 'signIn' || segments[0] === 'signUp';
    const isMentor = user?.role === 'mentor';

    if(isAuthenticated && !inApp){
      // Redirect to Home
      console.log('IsMentor: ', user.role);
      
      if (isMentor)
        router.replace('/(app)/(mentor)/(tabs)/home');
      else
        router.replace('/(app)/(student)/(tabs)/home');
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
          <MainLayout/>
        </UserListProvider>
      </AuthContextProvider>
    </PaperProvider>
  )
}

export default RootLayout
