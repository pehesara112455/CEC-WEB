// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS7rB-LTZfu2LcDgCjPLvaVk1h269BCYE",
  authDomain: "softstack-c7861.firebaseapp.com",
  databaseURL: "https://softstack-c7861-default-rtdb.firebaseio.com",
  projectId: "softstack-c7861",
  storageBucket: "softstack-c7861.firebasestorage.app",
  messagingSenderId: "208691132488",
  appId: "1:208691132488:web:3d827e941fc87c6eeb807d",
  measurementId: "G-JN5QWBLYPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);