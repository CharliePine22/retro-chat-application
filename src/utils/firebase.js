// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-rGpDmVXaukJBh72-Vi9JqM6GgOWXqNM",
  authDomain: "retro-chat-app22.firebaseapp.com",
  databaseURL: "https://retro-chat-app22-default-rtdb.firebaseio.com",
  projectId: "retro-chat-app22",
  storageBucket: "retro-chat-app22.appspot.com",
  messagingSenderId: "1008770732079",
  appId: "1:1008770732079:web:8a249f38df5c6d52b4f6da",
  measurementId: "G-ZT0NTPB5PS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');