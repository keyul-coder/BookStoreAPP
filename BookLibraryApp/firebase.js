import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCF5kMp2wvcek8-k_HBQyVgCxwU7sFzyTw",
    authDomain: "bookstore-fc77b.firebaseapp.com",
    projectId: "bookstore-fc77b",
    storageBucket: "bookstore-fc77b.firebasestorage.app",
    messagingSenderId: "99941192964",
    appId: "1:99941192964:web:da22ce475f120b3eafac51"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };