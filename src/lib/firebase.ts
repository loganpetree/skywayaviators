// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, increment, updateDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpYmVrR-g6ctC5ECNRDIzq-kfmWlZMQNc",
  authDomain: "skyway-ae947.firebaseapp.com",
  projectId: "skyway-ae947",
  storageBucket: "skyway-ae947.firebasestorage.app",
  messagingSenderId: "318466663373",
  appId: "1:318466663373:web:4261203887633b6aa85a84",
  measurementId: "G-Q9VZDKE60G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;

// Page load counter function
export const incrementPageLoadCount = async () => {
  try {
    const counterRef = doc(db, 'analytics', 'pageLoadCount');
    await updateDoc(counterRef, {
      count: increment(1),
      lastUpdated: new Date()
    });
  } catch (error) {
    // If the document doesn't exist, create it
    try {
      const counterRef = doc(db, 'analytics', 'pageLoadCount');
      await setDoc(counterRef, {
        count: 1,
        lastUpdated: new Date(),
        createdAt: new Date()
      });
    } catch (createError) {
      console.error('Error creating page load counter:', createError);
    }
  }
};
