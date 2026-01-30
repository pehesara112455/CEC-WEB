// Backend/Config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// --- REPLACE THIS WITH THE CONFIG FROM YOUR FRONTEND ---
const firebaseConfig = {
  apiKey: "LTZfu2LcDgCjPLvaVk1h269BCYE",
  authDomain: "softstack-c7861.firebaseapp.com",
  projectId: "softstack-c7861",
  storageBucket: "softstack-c7861.appspot.com",
  messagingSenderId: "208691132488",
  appId: "1:208691132488:web:3d827e941fc87c6eeb807d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export db so the controller can read it
export { db };

 