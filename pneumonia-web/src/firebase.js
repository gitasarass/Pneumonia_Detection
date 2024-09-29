import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3rMeY5Hyy0JUF2ERB1ZrQabt4J4-RHjc",
  authDomain: "xray-pneumonia2024.firebaseapp.com",
  databaseURL: "https://xray-pneumonia2024-default-rtdb.firebaseio.com",
  projectId: "xray-pneumonia2024",
  storageBucket: "xray-pneumonia2024.appspot.com",
  messagingSenderId: "455301193392",
  appId: "1:455301193392:web:c56b207a2e7ff790efa575",
  measurementId: "G-M6GLD399JW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

