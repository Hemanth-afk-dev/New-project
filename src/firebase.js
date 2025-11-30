// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (✔️ from console)
const firebaseConfig = {
  apiKey: "AIzaSyAy4WaFSeRnJQATnhJrhYeXZT_AgL4MtCM",
  authDomain: "scholarship-portal-9c29c.firebaseapp.com",
  projectId: "scholarship-portal-9c29c",
  storageBucket: "scholarship-portal-9c29c.firebasestorage.app",
  messagingSenderId: "58608926060",
  appId: "1:58608926060:web:38d5034de99495785a4749",
  measurementId: "G-V0GYY48T4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance to use in other files
export const db = getFirestore(app);