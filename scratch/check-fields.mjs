import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
const app = initializeApp({ apiKey: "AIzaSyBueUkcslJoo8w4aYrhg4O8pH-vhy8FpUs", projectId: "virelixconsulting" });
const db = getFirestore(app);
for (const col of ["industries","services","case_studies","team_members","posts"]) {
  const snap = await getDocs(query(collection(db, col), where("published","==",true)));
  const missing = snap.docs.filter(d => d.data().sort_order === undefined).map(d => d.id);
  console.log(`${col}: ${snap.size} pub, ${missing.length} missing sort_order:`, missing);
}
// Try ordered query (Firestore drops docs missing the orderBy field)
const snap2 = await getDocs(query(collection(db,"case_studies"), where("published","==",true), orderBy("sort_order")));
console.log("case_studies ordered:", snap2.size);
process.exit(0);
