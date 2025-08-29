import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCW7bmXU4TEmCErWQeZN_wobPR4l8ogG-M",
  authDomain: "portfolio-6e911.firebaseapp.com",
  projectId: "portfolio-6e911",
  storageBucket: "portfolio-6e911.appspot.com",
  messagingSenderId: "520609443890",
  appId: "1:520609443890:web:146d829cf8ab4d2a0d8c2b",
  measurementId: "G-SSR7JT8DHE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, db, analytics };

