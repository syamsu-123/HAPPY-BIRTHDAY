import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyAx-WeUF_ZuvR3oWiTjGy9TfvEKOwZ4wMk",
  authDomain: "happybirthday-d507d.firebaseapp.com",
  projectId: "happybirthday-d507d",
  storageBucket: "happybirthday-d507d.firebasestorage.app",
  messagingSenderId: "550408680090",
  appId: "1:550408680090:web:8fe43f69164643226a6523"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor instance Firestore
export const db = getFirestore(app);