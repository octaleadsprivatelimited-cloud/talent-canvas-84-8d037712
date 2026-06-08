import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
  // Authenticate first so we have write permission
  const email = "admin@virelixconsulting.com";
  const password = "AdminPassword123!";
  const credential = await signInWithEmailAndPassword(auth, email, password);
  console.log("Authenticated as:", credential.user.uid);

  // Read all existing user_roles documents
  const querySnapshot = await getDocs(collection(db, "user_roles"));
  console.log("Found", querySnapshot.size, "user_roles documents");

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;
    const userId = data.user_id;

    if (!userId) {
      console.log("Skipping document", docId, "- no user_id field");
      continue;
    }

    // If the document ID already matches the user_id, it's already migrated
    if (docId === userId) {
      console.log("Document", docId, "already uses UID as ID - skipping");
      continue;
    }

    // Create new document with user_id as the document ID
    const newDocRef = doc(db, "user_roles", userId);
    await setDoc(newDocRef, {
      user_id: userId,
      role: data.role || "admin",
    });
    console.log("Created UID-keyed document:", userId);

    // Delete the old random-ID document
    await deleteDoc(doc(db, "user_roles", docId));
    console.log("Deleted old random-ID document:", docId);
  }

  console.log("Migration complete!");
};

run().catch(console.error);
