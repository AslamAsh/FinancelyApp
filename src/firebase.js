// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider}from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfA4g607VaHN8hbWmPK7NmHLMAiLzxoIo",
  authDomain: "financly-70f9f.firebaseapp.com",
  projectId: "financly-70f9f",
  storageBucket: "financly-70f9f.firebasestorage.app",
  messagingSenderId: "437483060283",
  appId: "1:437483060283:web:1b8e69a4154f76a03cb01e",
  measurementId: "G-QTZFVFTNG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();

export {db,auth,provider,doc,setDoc};
