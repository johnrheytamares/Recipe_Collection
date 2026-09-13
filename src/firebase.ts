// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsG8G_rxt8Mml38WO74tGD4D8mKiZQrp8",
  authDomain: "recipe-collection-dcd9b.firebaseapp.com",
  databaseURL: "https://recipe-collection-dcd9b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "recipe-collection-dcd9b",
  storageBucket: "recipe-collection-dcd9b.firebasestorage.app",
  messagingSenderId: "478620597115",
  appId: "1:478620597115:web:0b184992bfff023e6e5bde",
  measurementId: "G-9PJEV4EDM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getDatabase(app);