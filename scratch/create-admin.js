import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

const run = async () => {
  const email = "admin@virelix.com";
  const password = "AdminPassword123!";
  let userId = null;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    userId = userCredential.user.uid;
    console.log("Created new user:", userId);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      userId = userCredential.user.uid;
      console.log("Logged in existing user:", userId);
    } else {
      throw error;
    }
  }

  // Check if role already exists in user_roles
  const q = query(collection(db, "user_roles"), where("user_id", "==", userId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    const docRef = await addDoc(collection(db, "user_roles"), {
      user_id: userId,
      role: "admin"
    });
    console.log("Assigned admin role in document:", docRef.id);
  } else {
    console.log("Admin role already assigned.");
  }
};

run().catch(console.error);
