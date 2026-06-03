import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBueUkcslJoo8w4aYrhg4O8pH-vhy8FpUs",
  authDomain: "virelixconsulting.firebaseapp.com",
  projectId: "virelixconsulting",
  storageBucket: "virelixconsulting.firebasestorage.app",
  messagingSenderId: "12728492405",
  appId: "1:12728492405:web:03af0dcb570e6c6b0bf33c",
  measurementId: "G-C4JD1G7S13",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  const querySnapshot = await getDocs(collection(db, "user_roles"));
  console.log("Documents count in user_roles:", querySnapshot.size);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
};

run().catch(console.error);
