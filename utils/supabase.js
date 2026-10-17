import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nwoawxvbarblzgrfedqa.supabase.co";
export const apiKey = import.meta.env.VITE_API_KEY;

export const supabase = apiKey ? createClient(supabaseUrl, apiKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;
