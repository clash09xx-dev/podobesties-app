import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "plated-oarlock-8x6pd",
  appId: "1:776647034614:web:9af3658007c03d05a44ed7",
  apiKey: "AIzaSyCLvzHWms8LpNfZc_Cy5CD9LbNsl3FRd5s",
  authDomain: "plated-oarlock-8x6pd.firebaseapp.com",
  storageBucket: "plated-oarlock-8x6pd.firebasestorage.app",
  messagingSenderId: "776647034614",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {}, 'ai-studio-c9a1470c-2330-4a89-87c2-db77182ec109');
export { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail };

