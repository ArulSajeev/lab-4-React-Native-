import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRL-GZ1dWDjCZWopc7BL6EAi4GfXYjdNg",
  authDomain: "lab4-react-native-739f7.firebaseapp.com",
  projectId: "lab4-react-native-739f7",
  storageBucket: "lab4-react-native-739f7.appspot.com",
  messagingSenderId: "844396093047",
  appId: "1:844396093047:web:9d72b92c41f1a9b21d7072",
};


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

