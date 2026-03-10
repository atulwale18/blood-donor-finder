import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBK-POf8jgafi8p0T0HLfRP0oO7uW0wm2c",
  authDomain: "blood-donor-finder-e3a2f.firebaseapp.com",
  projectId: "blood-donor-finder-e3a2f",
  storageBucket: "blood-donor-finder-e3a2f.firebasestorage.app",
  messagingSenderId: "506184781428",
  appId: "1:506184781428:web:85538cd26c49100e88cb21"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);