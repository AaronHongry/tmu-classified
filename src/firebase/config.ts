// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBT8y7FeOd-WXW9CE8tuVCXPhKPrBFzu-w",
	authDomain: "tmu-classified.firebaseapp.com",
	projectId: "tmu-classified",
	storageBucket: "tmu-classified.appspot.com",
	messagingSenderId: "224451038666",
	appId: "1:224451038666:web:b5b0c64dbc99aefdfc9333",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
