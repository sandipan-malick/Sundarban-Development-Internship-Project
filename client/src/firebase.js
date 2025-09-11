import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw9MxtlPrjoXGs4wKgmiRqzNY9pMJWHN4",
  authDomain: "sundorbon-dev-pro-final.firebaseapp.com",
  projectId: "sundorbon-dev-pro-final",
  storageBucket: "sundorbon-dev-pro-final.appspot.com", 
  messagingSenderId: "754139377013",
  appId: "1:754139377013:web:9ccbfb5bd4105f8b7ff73c",
  measurementId: "G-C2NF0BBP6L",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
