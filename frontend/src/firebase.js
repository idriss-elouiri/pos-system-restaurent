import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBAS_URL,
  authDomain: "pos-system-restaurent.firebaseapp.com",
  projectId: "pos-system-restaurent",
  storageBucket: "pos-system-restaurent.appspot.com",
  messagingSenderId: "363013290140",
  appId: "1:363013290140:web:0be1f1a5ff2a431f241559",
  measurementId: "G-EY7ZMBJ3SY",
};

export const app = initializeApp(firebaseConfig);

async function initAnalytics() {
  const analyticsSupported = await isSupported();
  if (analyticsSupported) {
    const analytics = getAnalytics(app);
  }
}

if (typeof window !== "undefined") {
  initAnalytics();
}
