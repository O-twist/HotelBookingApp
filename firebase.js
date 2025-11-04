import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBDuPwEvoSJgf0cNPa6ya4XCmeBCZpj65M",
  authDomain: "final-test-e28b2.firebaseapp.com",
  projectId: "final-test-e28b2",
  storageBucket: "final-test-e28b2.firebasestorage.app",
  messagingSenderId: "285090104103",
  appId: "1:285090104103:web:67ea26c8ac7570e9355f02"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
export default app;