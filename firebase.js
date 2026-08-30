 import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "nzn-mart.firebaseapp.com",
    projectId: "nzn-mart",
    storageBucket: "nzn-mart.firebasestorage.app",
    messagingSenderId: "666037848963",
    appId: "YOUR_FIREBASE_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


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
