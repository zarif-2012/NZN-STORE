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

// Firebase configuration
// These credentials are already configured for NZN MART project
const firebaseConfig = {
  apiKey: "AIzaSyBgoOqbgUgZb9_ZzT5IR7Z7UqThBnWTxtQ",
  authDomain: "nzn-mart.firebaseapp.com",
  databaseURL: "https://nzn-mart-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nzn-mart",
  storageBucket: "nzn-mart.firebasestorage.app",
  messagingSenderId: "666037848963",
  appId: "1:666037848963:web:47dd1a04478c0bfc5c04b6",
  measurementId: "G-6H28QJKXXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
const auth = getAuth(app);

// Set auth persistence to LOCAL (user stays logged in)
auth.setPersistence = auth.setPersistence || (() => Promise.resolve());

// Get Firestore instance
const db = getFirestore(app);

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  'login_hint': 'user@example.com'
});
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Export all necessary functions
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
