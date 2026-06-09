import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
const app = initializeApp({ apiKey: "AIzaSyBueUkcslJoo8w4aYrhg4O8pH-vhy8FpUs", projectId: "virelixconsulting" });
const db = getFirestore(app);
for (const col of ["industries","services","case_studies","team_members","testimonials","posts","custom_pages"]) {
  try {
    const snap = await getDocs(query(collection(db, col), where("published","==",true)));
    console.log(`${col}: published=${snap.size}`);
    snap.docs.forEach(d => console.log("  ", d.id, "-", d.data().title || d.data().name));
  } catch (e) { console.log(`${col}: ERR ${e.message}`); }
}
process.exit(0);
