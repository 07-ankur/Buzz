import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-CzxheZSPZaVgWQLtGQTvG0ed4gLfQqQ",
  authDomain: "buzz-60d4c.firebaseapp.com",
  projectId: "buzz-60d4c",
  storageBucket: "buzz-60d4c.firebasestorage.app",
  messagingSenderId: "107044059176",
  appId: "1:107044059176:web:c5a90ded96f2e0fadedd1d",
  measurementId: "G-EW7ZHYM8XE",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
