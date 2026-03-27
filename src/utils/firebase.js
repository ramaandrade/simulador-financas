import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBC1c_Sm0lV_3bWz-Fv1rlFEYRDkhvYl8U",
  authDomain: "simulador-financas-urca.firebaseapp.com",
  projectId: "simulador-financas-urca",
  storageBucket: "simulador-financas-urca.firebasestorage.app",
  messagingSenderId: "269877678348",
  appId: "1:269877678348:web:f41686f217d60935137929"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
