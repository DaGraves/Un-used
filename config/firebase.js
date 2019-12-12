import firebase from 'firebase';
require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDYwhEmf0vL3_x-YGCawvgoLaoAE8i0Mb8",
  authDomain: "taux-44e28.firebaseapp.com",
  databaseURL: "https://taux-44e28.firebaseio.com",
  projectId: "taux-44e28",
  storageBucket: "taux-44e28.appspot.com",
  messagingSenderId: "416635021108",
  appId: "1:416635021108:web:7abae7c666e8c8e1"
};

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export default db;
