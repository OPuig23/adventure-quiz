// Inicialitza Firebase (compat CDN)
const firebaseConfig = {
  apiKey: "AIzaSyB1d9L11TErbG9NrwoHgqI1Cvr9NlIMkiY",
  authDomain: "adventure-quiz-7f60a.firebaseapp.com",
  projectId: "adventure-quiz-7f60a",
  storageBucket: "adventure-quiz-7f60a.appspot.com",
  messagingSenderId: "408686500308",
  appId: "1:408686500308:web:f56d34c6f682a4bfbe5e41",
  measurementId: "G-ZLKDMPLDVE"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
