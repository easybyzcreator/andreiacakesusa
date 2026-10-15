import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrNRuBvFf7VAaUREoVGMmdCdMHj8gLZJ4",
  authDomain: "app-andreia-cakes-usa.firebaseapp.com",
  projectId: "app-andreia-cakes-usa",
  storageBucket: "app-andreia-cakes-usa.firebasestorage.app",
  messagingSenderId: "410651136470",
  appId: "1:410651136470:web:c882e69106d78507fcd477",
  measurementId: "G-WNH8ZLTKZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Analytics not initialized:", e);
      }
    }
  }).catch(() => {});
}

