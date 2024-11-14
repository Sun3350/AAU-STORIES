// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtsYewxIF1BG2yK1Wcy6ancWXFc6AoUtU",
  authDomain: "aaustories-6d66a.firebaseapp.com",
  databaseURL: "https://aaustories-6d66a-default-rtdb.firebaseio.com",
  projectId: "aaustories-6d66a",
  storageBucket: "aaustories-6d66a.firebasestorage.app",
  messagingSenderId: "1063061686702",
  appId: "1:1063061686702:web:62685594d1eef717aae03f",
  measurementId: "G-H360KZG504"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };