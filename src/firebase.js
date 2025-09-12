// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Your config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDA_vJcmfYgS40nm13iZRSgoiJbopvTCsc",
  authDomain: "react-chat-app-6cf91.firebaseapp.com",
  projectId: "react-chat-app-6cf91",
  storageBucket: "react-chat-app-6cf91.firebasestorage.app",
  messagingSenderId: "167420326444",
  appId: "1:167420326444:web:62b01d8bd68c4ab2b71789",
  measurementId: "G-6JTMK4FNND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export what you need
export const auth = getAuth(app);       // For login/logout
// export const db = getFirestore(app);    // For chat messages
