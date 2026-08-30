// ==========================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================

// Firebase configuration
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

// Initialize Firebase (using global firebase object from index.html)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth(app);
const db = firebase.getFirestore(app);

// Create Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Export functions for use in app.js
const signInWithRedirect = (auth, provider) => firebase.auth().signInWithRedirect(provider);
const getRedirectResult = (auth) => firebase.auth().getRedirectResult();
const signOut = (auth) => firebase.auth().signOut();
const onAuthStateChanged = (auth, callback) => firebase.auth().onAuthStateChanged(callback);

// Make functions available globally if needed
window.signInWithRedirect = signInWithRedirect;
window.getRedirectResult = getRedirectResult;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
