// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2IS9xgnfSgQ7cs_wWcAtnbn5AhPpp3WY",
  authDomain: "livestream-app-d49b3.firebaseapp.com",
  projectId: "livestream-app-d49b3",
  storageBucket: "livestream-app-d49b3.appspot.com",
  messagingSenderId: "315317383587",
  appId: "1:315317383587:web:ad8d870fc6fe5cd19faa16",
  measurementId: "G-KDLXBQ35HK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
