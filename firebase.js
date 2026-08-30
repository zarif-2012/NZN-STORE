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

   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
