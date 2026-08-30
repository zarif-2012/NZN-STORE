import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ⚠️ IMPORTANT: These credentials should be in .env file
// For now using placeholder - REPLACE WITH YOUR FIREBASE CONFIG

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBgoOqbgUgZb9_ZzT5IR7Z7UqThBnWTxtQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nzn-mart.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://nzn-mart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nzn-mart",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nzn-mart.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "666037848963",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:666037848963:web:47dd1a04478c0bfc5c04b6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6H28QJKXXS"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// Configure Google provider to request specific scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');

export {
    app,
    auth,
    db,
    googleProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
};
