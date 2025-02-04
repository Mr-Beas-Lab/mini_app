// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  // apiKey: "AIzaSyA6q3j7n24d4Te38xV7RW0RSjP_tCSRkF0",
  apiKey: import.meta.env.FIREBASE_SECRET_KEY,
  authDomain: "mrjohn-8ee8b.firebaseapp.com",
  projectId: "mrjohn-8ee8b",
  storageBucket: "mrjohn-8ee8b.firebasestorage.app",
  messagingSenderId: "662877699866",
  appId: "1:662877699866:web:451ade51fbfafafed236a3",
  measurementId: "G-BBLWJYWS31"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app); 
export { db, functions };   