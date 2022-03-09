import firebase from 'firebase';
import { initializeApp } from "firebase/app";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-rGpDmVXaukJBh72-Vi9JqM6GgOWXqNM",
  authDomain: "retro-chat-app22.firebaseapp.com",
  projectId: "retro-chat-app22",
  storageBucket: "retro-chat-app22.appspot.com",
  messagingSenderId: "1008770732079",
  appId: "1:1008770732079:web:8a249f38df5c6d52b4f6da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirebase(app);

// export default firebase;