import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(config);

// Initialize individual Firebase services
const auth = getAuth(app);
// const database = getDatabase(app);
const database = getFirestore(app);
const storage = getStorage(app);

const twitterProvider = new TwitterAuthProvider();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export {
  app,
  googleProvider,
  twitterProvider,
  facebookProvider,
  signInWithPopup,
  auth,
  database,
  storage,
};
