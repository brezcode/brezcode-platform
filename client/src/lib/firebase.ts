import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

// Check if Firebase config is available
const hasFirebaseConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_PROJECT_ID && 
                          import.meta.env.VITE_FIREBASE_APP_ID;

let app: any = null;
let auth: any = null;

if (hasFirebaseConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  try {
    // Initialize Firebase only once
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } catch (error: any) {
    // Handle duplicate app error gracefully
    if (error.code === 'app/duplicate-app') {
      console.log("Firebase already initialized, using existing instance");
      const { getApps, getApp } = await import('firebase/app');
      app = getApps().length > 0 ? getApp() : null;
      if (app) {
        auth = getAuth(app);
      }
    } else {
      console.error("Firebase initialization error:", error);
    }
  }
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions with error handling
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error("Firebase not configured");
  }
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  if (!auth) {
    throw new Error("Firebase not configured");
  }
  return signOut(auth);
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export { auth };
export default app;