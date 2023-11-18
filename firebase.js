// // firebase.js
// import { initializeApp } from 'firebase/app';
// import { getAuth, setPersistence, browserLocalPersistence, initializeAuth, getReactNativePersistence} from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//     apiKey: "AIzaSyBeiCpKi2i-IrThQ0HwRMGL6Fr1cAyoAiA",
//     authDomain: "frs1-c0068.firebaseapp.com",
//     projectId: "frs1-c0068",
//     storageBucket: "frs1-c0068.appspot.com",
//     messagingSenderId: "637344815529",
//     appId: "1:637344815529:web:ecfcc81a6b312e81d14cb8"
//   };

// const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });

// // Set persistence to LOCAL (persists authentication state across app restarts)
// setPersistence(auth, browserLocalPersistence);

// export default app;
// export { auth };

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  //config here
  apiKey: "AIzaSyBeiCpKi2i-IrThQ0HwRMGL6Fr1cAyoAiA",
  authDomain: "frs1-c0068.firebaseapp.com",
  projectId: "frs1-c0068",
  storageBucket: "frs1-c0068.appspot.com",
  messagingSenderId: "637344815529",
  appId: "1:637344815529:web:ecfcc81a6b312e81d14cb8",
};

// Initialize Firebase
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

export default app;
export { auth };