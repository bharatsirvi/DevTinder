// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7yUxZxblTjjO6cm68GKEXolTqv-2SWKw",
  authDomain: "signwith-f9ba6.firebaseapp.com",
  projectId: "signwith-f9ba6",
  storageBucket: "signwith-f9ba6.firebasestorage.app",
  messagingSenderId: "257862449765",
  appId: "1:257862449765:web:7ec82bdd67d868309ee48c",
  measurementId: "G-SD6CV9CEB3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
