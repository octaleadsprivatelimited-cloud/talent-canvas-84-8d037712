import { supabase } from "@/integrations/supabase/client";
/**
 * Untyped Supabase client for admin CRUD operations where we work with
 * dynamic table names that the generated types don't allow.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAny: any = supabase;
