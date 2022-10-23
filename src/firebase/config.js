import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuhcXJsZoaHpxbe27QXdXCmNIUFLl3bCI",
  authDomain: "beeyond-pm.firebaseapp.com",
  projectId: "beeyond-pm",
  storageBucket: "beeyond-pm.appspot.com",
  messagingSenderId: "742639234699",
  appId: "1:742639234699:web:8c42c2dd3c78dae864ae8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init services
  const db = getFirestore(app)
  const Auth = getAuth()
  const storage = getStorage(app);

  
  export { db, Auth, storage }