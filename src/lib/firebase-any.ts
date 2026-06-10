import { firebase } from "@/integrations/firebase/client";
/**
 * Untyped Firebase client for admin CRUD operations where we work with
 * dynamic collection names that the generated types don't allow.
 */
export const firebaseAny: any = firebase;
