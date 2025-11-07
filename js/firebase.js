// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
		apiKey: "AIzaSyBgQnu-v228q7D3w9ynfk5l1zbUbQEl1oM",
		authDomain: "compaignform-b562c.firebaseapp.com",
		databaseURL: "https://compaignform-b562c-default-rtdb.firebaseio.com",
		projectId: "compaignform-b562c",
		storageBucket: "compaignform-b562c.firebasestorage.app",
		messagingSenderId: "79061079197",
		appId: "1:79061079197:web:78bf12bd1207921542b074"
	};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
