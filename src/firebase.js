
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app';


const firebaseConfig = { 
  apiKey: "AIzaSyCTdvUDHyp67mGr32afc9Pa6jkv6eyEJh8",
  authDomain: "mealplannerapp-12d84.firebaseapp.com",
  projectId: "mealplannerapp-12d84",
  storageBucket: "mealplannerapp-12d84.firebasestorage.app",
  messagingSenderId: "155417883525",
  appId: "1:155417883525:web:63255055b9afb114fe0aec"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db };