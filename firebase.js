import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBgoOqbgUgZb9_NzT5IR7Z7UqThBnWTxtQ",
    authDomain: "nzn-mart.firebaseapp.com",
    projectId: "nzn-mart",
    storageBucket: "nzn-mart.firebasestorage.app",
    messagingSenderId: "666037848963",
    appId: "1:666037848963:web:47dd1a04478c0bfc5c04b6",
    measurementId: "G-6H28QJKXXS"
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
    signInWithPopup,
    signOut,
    onAuthStateChanged
};
