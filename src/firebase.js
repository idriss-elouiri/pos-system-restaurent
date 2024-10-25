// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBAS_URL,
  authDomain: "pos-system-restaurent.firebaseapp.com",
  projectId: "pos-system-restaurent",
  storageBucket: "pos-system-restaurent.appspot.com",
  messagingSenderId: "363013290140",
  appId: "1:363013290140:web:0be1f1a5ff2a431f241559",
  measurementId: "G-EY7ZMBJ3SY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);