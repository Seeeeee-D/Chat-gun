import firebase from "firebase/app";
import "firebase/firestore";

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyD9jZdZZ7Yc3JLYOl26ZoR-mhQFLJwfftg",
    authDomain: "chat-gun-fd6e1.firebaseapp.com",
    projectId: "chat-gun-fd6e1",
    storageBucket: "chat-gun-fd6e1.appspot.com",
    messagingSenderId: "348086134416",
    appId: "1:348086134416:web:48a1b68dc97a7d94279a15"
  }
  firebase.initializeApp(firebaseConfig);
}

export default firebase;