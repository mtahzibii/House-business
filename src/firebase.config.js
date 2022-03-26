// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIgmNqACyaqsWPoE5B0FvvLN4G5CG8AqI",
  authDomain: "house-marketplace-app-d0b75.firebaseapp.com",
  projectId: "house-marketplace-app-d0b75",
  storageBucket: "house-marketplace-app-d0b75.appspot.com",
  messagingSenderId: "892642275338",
  appId: "1:892642275338:web:9ebf3c8318a511e2f6eff3",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
