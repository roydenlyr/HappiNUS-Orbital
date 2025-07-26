import {createContext, useContext, useEffect, useState } from "react";
import { auth, db } from '../firebaseConfig'
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {doc, getDoc, setDoc} from 'firebase/firestore'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {            
            if (user){
                updateUserData(user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (firebaseUser) => {
        const docRef = doc(db, 'users', firebaseUser.uid); 
        const docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();  
            setUser({...firebaseUser, username: data.username, profileUrl: data.profileUrl, userId: data.userId, role: data.role, 
                activeAlert: data.activeAlert || false, dob: data.dob, faculty: data.faculty, gender: data.gender, matricYear: data.matricYear});
            setIsAuthenticated(true);
        } else{
            console.warn('User doc not found');
            setUser(null);
        }       
    }

    const login = async (email, password) => {
        try {
             const response = await signInWithEmailAndPassword(auth, email, password);
             return {success: true};
        } catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) {
                msg = 'Invalid email';
            }
            if(msg.includes('(auth/invalid-credential)')) {
                msg = 'Wrong Credentials';
            }
            return {success: false, msg};
        }
    }

    const logout = async () => {
        try {
             await signOut(auth);
             return {success: true};
        } catch(e){
            return {success: false, msg: e.message, error: e};
        }
    }

    const register = async(email, password, username, profileUrl, role) => {
        try {
             const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', response?.user?.uid), {
                username,
                profileUrl,
                role,
                userId: response?.user?.uid
            });
            return {success: true, data: response?.user};
        } catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) {
                msg = 'Invalid email';
            }
            if(msg.includes('(auth/email-already-in-use)')) {
                msg = 'This email is already in use';
            }
            return {success: false, msg};
        }
    }

    const registerMentor = async(email, password, username, profileUrl, role, faculty, gender, dob, matricYear, activeAlert) => {
        try {
             const response = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, 'users', response?.user?.uid), {
                username,
                profileUrl,
                role,
                userId: response?.user?.uid,
                faculty,
                gender,
                dob,
                matricYear,
                activeAlert
            });
            return {success: true, data: response?.user};
        } catch(e){
            let msg = e.message;
            if(msg.includes('(auth/invalid-email)')) {
                msg = 'Invalid email';
            }
            if(msg.includes('(auth/email-already-in-use)')) {
                msg = 'This email is already in use';
            }
            return {success: false, msg};
        }
    }

    const refreshUser = async () => {
        try {
            if (!user) return;

            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()){
                const data = docSnap.data();
                setUser({...user, profileUrl: data.profileUrl, activeAlert: data.activeAlert});
            }
        } catch (error) {
            console.error('Failed to refresh user: ', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, registerMentor, refreshUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if(!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider');
    }
    return value;
}