// src/data/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDU33LZX5HwU2Z3iLwKVvw1Y_Q8goBb-3k",
    authDomain: "rumbo-chapaco.firebaseapp.com",
    databaseURL: "https://rumbo-chapaco-default-rtdb.firebaseio.com",
    projectId: "rumbo-chapaco",
    storageBucket: "rumbo-chapaco.firebasestorage.app",
    messagingSenderId: "597371247176",
    appId: "1:597371247176:web:95d1cab4b1ab296fa2567d"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
