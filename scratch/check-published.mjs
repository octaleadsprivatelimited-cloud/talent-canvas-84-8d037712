import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const app = initializeApp({
  apiKey: "AIzaSyBueUkcslJoo8w4aYrhg4O8pH-vhy8FpUs",
  authDomain: "virelixconsulting.firebaseapp.com",
  projectId: "virelixconsulting",
});
const db = getFirestore(app);
for (const col of ["industries","services","case_studies","team_members","testimonials","posts","custom_pages"]) {
  try {
    const snap = await getDocs(collection(db, col));
    const docs = snap.docs.map(d => ({ id: d.id, published: d.data().published, title: d.data().title || d.data().name }));
    console.log(`\n== ${col} (${docs.length}) ==`);
    docs.forEach(d => console.log(JSON.stringify(d)));
  } catch (e) { console.log(`${col}: ERR ${e.message}`); }
}
process.exit(0);
