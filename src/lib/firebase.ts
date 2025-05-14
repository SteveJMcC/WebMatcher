// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2DxjW2C7nCVQeYzY0EazcAmJRQC4sKUM",
  authDomain: "webconnect-ta2qw.firebaseapp.com",
  projectId: "webconnect-ta2qw",
  storageBucket: "webconnect-ta2qw.appspot.com",
  messagingSenderId: "723387767688",
  appId: "1:723387767688:web:d3a8d71c032d145d89b83d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
