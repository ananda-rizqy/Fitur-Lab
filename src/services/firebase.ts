import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCH50zWzikIf48-yIdKU1IjTWw8f5S3FSw",
  authDomain: "localization-9d71b.firebaseapp.com",
  databaseURL:
    "https://localization-9d71b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "localization-9d71b",
  storageBucket: "localization-9d71b.firebasestorage.app",
  messagingSenderId: "558476621232",
  appId: "1:558476621232:web:258a6239776b2074471275",
  measurementId: "G-KRLT37BMMX",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
