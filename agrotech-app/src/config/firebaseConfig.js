import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// For new Expo SDK versions (49+), environment variables are typically handled via expo-constants
// and need to be prefixed with EXPO_PUBLIC_ if defined in .env and accessed client-side.
// react-native-dotenv should also make them available.

// Ensure you have installed firebase: npm install firebase

// Your web app's Firebase configuration
// It's crucial these are set in your .env file
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
