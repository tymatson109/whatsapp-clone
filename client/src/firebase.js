import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCWnQ5O8nw1p8_JilwF0XvR1nGrXtvuqU8",
    authDomain: "tinder-clone-f40a7.firebaseapp.com",
    projectId: "tinder-clone-f40a7",
    storageBucket: "tinder-clone-f40a7.appspot.com",
    messagingSenderId: "540185828017",
    appId: "1:540185828017:web:85258284cd9270c5702090",
    measurementId: "G-JD12SLJLBT"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)

  const db = firebaseApp.firestore();
  const auth = firebaseApp.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export default db;
  export {auth, provider};