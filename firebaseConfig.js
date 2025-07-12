// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection} from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB1AbjAcoSW7XBLFpgUSqaSuaI2jwS-qk",
  authDomain: "happinus-ba24a.firebaseapp.com",
  projectId: "happinus-ba24a",
  storageBucket: "happinus-ba24a.firebasestorage.app",
  messagingSenderId: "336113733319",
  appId: "1:336113733319:web:2f2584e3becd24452a38e2"
};

// Initialize Firebase app once
const app = initializeApp(firebaseConfig);

export { app };

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
export const functions = getFunctions(app);