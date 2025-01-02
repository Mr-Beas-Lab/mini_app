import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAqdFrlEI0D4PUrd4PEgf1tRoe2KvmQbjs",
  authDomain: "telegrambot-e70ab.firebaseapp.com",
  projectId: "telegrambot-e70ab",
  storageBucket: "telegrambot-e70ab.firebasestorage.app",
  messagingSenderId: "518406127119",
  appId: "1:518406127119:web:617ce6ef1b7189632a2d7a",
  measurementId: "G-ZBEQ1K5DGQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics)
