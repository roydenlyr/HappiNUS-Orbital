import { Slot, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { AuthContextProvider, useAuth } from '../context/authContext'
import '../global.css'


const MainLayout = () => {
  const {isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if(typeof isAuthenticated == 'undefined')
      return;

    const inApp = segments[0] === '(app)';
    const isAuthPage = segments[0] === 'signIn' || segments[0] === 'signUp';

    if(isAuthenticated && !inApp){
      // Redirect to Home
      router.replace('/home');
    } else if (!isAuthenticated && !isAuthPage){
      // Redirect to Sign in
      router.replace('/signIn');
    }
  }, [isAuthenticated, router, segments])

  return <Slot/>
}

const RootLayout = () => {
  return (
    <PaperProvider>
      <AuthContextProvider>
        <MainLayout/>
      </AuthContextProvider>
    </PaperProvider>
  )
}

export default RootLayout
