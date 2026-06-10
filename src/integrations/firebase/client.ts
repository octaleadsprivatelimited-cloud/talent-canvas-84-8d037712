import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getCountFromServer,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
};

const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isConfigValid) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  console.warn(
    "[Firebase] Missing Firebase environment variables. Please check your .env file and add VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID.",
  );
}

// ----------------------------------------------------
// SUPABASE TO FIREBASE QUERY BUILDER LAYER
// ----------------------------------------------------

class FirebaseQueryBuilder {
  private collectionName: string;
  private filters: { field: string; op: "=="; value: any }[] = [];
  private orderField?: string;
  private orderAscending: boolean = true;
  private limitCount?: number;
  private isCountOnly: boolean = false;
  private operation: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private payload: any = null;
  private upsertOptions?: { onConflict?: string };
  private selectFields?: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  select(fields?: string, options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) {
    this.selectFields = fields;
    if (options?.count === "exact" || options?.head) {
      this.isCountOnly = true;
    }
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push({ field, op: "==", value });
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  private buildQuery() {
    if (!db) throw new Error("Firebase Firestore is not initialized. Check your config.");
    const collRef = collection(db, this.collectionName);
    let q = query(collRef);

    for (const filter of this.filters) {
      q = query(q, where(filter.field, filter.op, filter.value));
    }

    // NOTE: server-side orderBy is intentionally NOT applied. Combined with
    // a `where` filter it requires a composite index in Firestore, which
    // breaks queries when the index is not deployed. We sort in-memory in
    // execute() instead — safe because limits are also applied in-memory.

    // Limit is also applied in-memory after sorting (see execute()), so we
    // do NOT push it server-side — otherwise we'd return the wrong subset.

    return q;
  }

  async execute(): Promise<any> {
    if (!db) {
      return { data: [], error: { message: "Firebase is not initialized." } };
    }
    try {
      if (this.operation === "select") {
        if (this.isCountOnly) {
          const q = this.buildQuery();
          const querySnapshot = await getDocs(q);
          let data = querySnapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as any),
          }));
          for (const filter of this.filters) {
            data = data.filter((item) => item[filter.field] === filter.value);
          }
          return { data: null, error: null, count: data.length };
        }

        // Check if we have an ID filter to get doc directly (optimisation + convenience)
        const idFilter = this.filters.find((f) => f.field === "id");
        if (idFilter) {
          const docRef = doc(db, this.collectionName, String(idFilter.value));
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            let matches = true;
            for (const filter of this.filters) {
              if (filter.field !== "id" && (data as any)[filter.field] !== filter.value) {
                matches = false;
              }
            }
            return { data: matches ? [data] : [], error: null };
          } else {
            return { data: [], error: null };
          }
        }

        const q = this.buildQuery();
        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        }));

        // Apply filters in-memory
        for (const filter of this.filters) {
          data = data.filter((item) => item[filter.field] === filter.value);
        }

        // Apply sorting in-memory
        if (this.orderField) {
          const field = this.orderField;
          const ascending = this.orderAscending;
          data.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;
            if (valA < valB) return ascending ? -1 : 1;
            if (valA > valB) return ascending ? 1 : -1;
            return 0;
          });
        }

        // Apply limit in-memory
        if (this.limitCount !== undefined) {
          data = data.slice(0, this.limitCount);
        }

        // Resolve simple relationships like companies(...) or companies(*) in-memory
        const selectStr = this.selectFields || "";
        if (selectStr.includes("companies") && this.collectionName === "jobs") {
          try {
            const compRef = collection(db, "companies");
            const compSnapshot = await getDocs(compRef);
            const companiesList = compSnapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));

            data = data.map((job: any) => {
              const company =
                companiesList.find(
                  (c: any) => c.id === job.company_id || c.slug === job.company_id,
                ) || null;
              return { ...job, companies: company };
            });
          } catch (e) {
            console.error("Failed to join companies:", e);
          }
        }

        return { data, error: null };
      }

      if (this.operation === "insert") {
        const collRef = collection(db, this.collectionName);
        const docId = this.payload.id;
        const dataToSave = { ...this.payload };

        if (docId) {
          delete dataToSave.id;
          const docRef = doc(db, this.collectionName, String(docId));
          await setDoc(docRef, dataToSave);
          return { data: [{ id: docId, ...dataToSave }], error: null };
        } else {
          const docRef = await addDoc(collRef, dataToSave);
          return { data: [{ id: docRef.id, ...dataToSave }], error: null };
        }
      }

      if (this.operation === "update") {
        const idFilter = this.filters.find((f) => f.field === "id");
        const dataToUpdate = { ...this.payload };
        delete dataToUpdate.id; // Avoid storing id field redundantly

        if (idFilter) {
          const docRef = doc(db, this.collectionName, String(idFilter.value));
          await updateDoc(docRef, dataToUpdate);
          return { data: [{ id: idFilter.value, ...dataToUpdate }], error: null };
        }

        // Retrieve filtered and filter in memory
        const q = this.buildQuery();
        const querySnapshot = await getDocs(q);
        let docsToUpdate = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        }));
        for (const filter of this.filters) {
          docsToUpdate = docsToUpdate.filter((item) => item[filter.field] === filter.value);
        }

        const promises = docsToUpdate.map((item) =>
          updateDoc(doc(db!, this.collectionName, item.id), dataToUpdate),
        );
        await Promise.all(promises);

        const updatedData = docsToUpdate.map((item) => ({
          ...item,
          ...dataToUpdate,
        }));
        return { data: updatedData, error: null };
      }

      if (this.operation === "delete") {
        const idFilter = this.filters.find((f) => f.field === "id");
        if (idFilter) {
          const docRef = doc(db, this.collectionName, String(idFilter.value));
          await deleteDoc(docRef);
          return { data: [], error: null };
        }

        // Retrieve filtered and filter in memory
        const q = this.buildQuery();
        const querySnapshot = await getDocs(q);
        let docsToDelete = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as any),
        }));
        for (const filter of this.filters) {
          docsToDelete = docsToDelete.filter((item) => item[filter.field] === filter.value);
        }

        const promises = docsToDelete.map((item) =>
          deleteDoc(doc(db!, this.collectionName, item.id)),
        );
        await Promise.all(promises);
        return { data: [], error: null };
      }

      if (this.operation === "upsert") {
        const conflictKey = this.upsertOptions?.onConflict || "id";
        const conflictValue = this.payload[conflictKey];

        if (!conflictValue) {
          this.operation = "insert";
          return this.execute();
        }

        // If conflictKey is "id", we can check directly
        if (conflictKey === "id") {
          const docRef = doc(db, this.collectionName, String(conflictValue));
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dataToSave = { ...this.payload };
            delete dataToSave.id;
            await setDoc(docRef, dataToSave, { merge: true });
            return { data: [{ id: conflictValue, ...dataToSave }], error: null };
          } else {
            this.operation = "insert";
            return this.execute();
          }
        }

        const collRef = collection(db, this.collectionName);
        const q = query(collRef, where(conflictKey, "==", conflictValue));
        const querySnapshot = await getDocs(q);
        const match = querySnapshot.docs[0];

        if (match) {
          const docId = match.id;
          const docRef = doc(db, this.collectionName, docId);
          const dataToSave = { ...this.payload };
          delete dataToSave.id;
          await setDoc(docRef, dataToSave, { merge: true });
          return { data: [{ id: docId, ...dataToSave }], error: null };
        } else {
          this.operation = "insert";
          return this.execute();
        }
      }

      return { data: [], error: { message: "Invalid query builder operation." } };
    } catch (error: any) {
      console.error(`Firestore query execution error (${this.operation}):`, error);
      return { data: null, error: { message: error.message || String(error) } };
    }
  }

  // Thenable compatibility for standard async/await calls
  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    const res = await this.execute();
    if (onfulfilled) return onfulfilled(res);
    return res;
  }

  async maybeSingle() {
    const { data, error } = await this.execute();
    if (error) return { data: null, error };
    return { data: data && data.length > 0 ? data[0] : null, error: null };
  }

  async single() {
    const { data, error } = await this.execute();
    if (error) return { data: null, error };
    if (!data || data.length === 0) {
      return { data: null, error: { message: "Document not found" } };
    }
    return { data: data[0], error: null };
  }

  insert(payload: any) {
    this.operation = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: any) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  upsert(payload: any, options?: { onConflict?: string }) {
    this.operation = "upsert";
    this.payload = payload;
    this.upsertOptions = options;
    return this;
  }
}

// ----------------------------------------------------
// SUPABASE TO FIREBASE AUTH WRAPPER
// ----------------------------------------------------

class FirebaseAuthWrapper {
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!auth) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const session = {
            access_token: token,
            expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
            user: {
              id: user.uid,
              email: user.email,
              app_metadata: { provider: "email" },
              user_metadata: {},
              created_at: user.metadata.creationTime,
              last_sign_in_at: user.metadata.lastSignInTime,
            },
          };
          callback("SIGNED_IN", session);
        } catch (err) {
          console.error("[onAuthStateChange] failed to get token:", err);
          callback("SIGNED_OUT", null);
        }
      } else {
        callback("SIGNED_OUT", null);
      }
    });
    return { data: { subscription: { unsubscribe } } };
  }

  async getSession() {
    if (!auth) {
      return { data: { session: null }, error: null };
    }
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        return {
          data: {
            session: {
              access_token: token,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: {
                id: user.uid,
                email: user.email,
                app_metadata: { provider: "email" },
                user_metadata: {},
                created_at: user.metadata.creationTime,
                last_sign_in_at: user.metadata.lastSignInTime,
              },
            },
          },
          error: null,
        };
      } catch (err: any) {
        console.error("[getSession] failed to get token:", err);
        return { data: { session: null }, error: err };
      }
    }
    return { data: { session: null }, error: null };
  }

  async signUp({ email, password }: any) {
    if (!auth)
      return {
        data: { user: null, session: null },
        error: new Error("Firebase Auth is not initialized"),
      };
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      const token = await user.getIdToken();
      return {
        data: {
          user: {
            id: user.uid,
            email: user.email,
            app_metadata: { provider: "email" },
            user_metadata: {},
            created_at: user.metadata.creationTime,
            last_sign_in_at: user.metadata.lastSignInTime,
          },
          session: {
            access_token: token,
            user: { id: user.uid, email: user.email },
          },
        },
        error: null,
      };
    } catch (error: any) {
      return { data: { user: null, session: null }, error };
    }
  }

  async signInWithPassword({ email, password }: any) {
    if (!auth)
      return {
        data: { user: null, session: null },
        error: new Error("Firebase Auth is not initialized"),
      };
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      const token = await user.getIdToken();
      return {
        data: {
          user: {
            id: user.uid,
            email: user.email,
            app_metadata: { provider: "email" },
            user_metadata: {},
            created_at: user.metadata.creationTime,
            last_sign_in_at: user.metadata.lastSignInTime,
          },
          session: {
            access_token: token,
            user: { id: user.uid, email: user.email },
          },
        },
        error: null,
      };
    } catch (error: any) {
      return { data: { user: null, session: null }, error };
    }
  }

  async signInWithPopupGoogle() {
    if (!auth) return { error: new Error("Firebase Auth is not initialized") };
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const user = credential.user;
      const token = await user.getIdToken();
      return {
        user,
        session: {
          access_token: token,
          user: { id: user.uid, email: user.email },
        },
        error: null,
      };
    } catch (error: any) {
      return { user: null, session: null, error };
    }
  }

  async setSession(tokens: any) {
    console.log(
      "Firebase does not natively support setSession(tokens) from Supabase format.",
      tokens,
    );
    return { data: { session: null }, error: null };
  }

  async signOut() {
    if (!auth) return { error: null };
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }
}

export async function uploadImage(file: File, folder: string = "uploads"): Promise<string> {
  if (!storage) {
    // Fall back to base64 immediately if storage isn't initialized
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.warn("Firebase Storage upload failed, falling back to base64:", err);
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }
}

// ----------------------------------------------------
// CLIENT EXPORT INTERFACE
// ----------------------------------------------------

export const firebaseClient = {
  auth: new FirebaseAuthWrapper(),
  from: (collectionName: string) => {
    return new FirebaseQueryBuilder(collectionName);
  },
  storage: {
    uploadImage,
  },
};

export const firebase = firebaseClient;
