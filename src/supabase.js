import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nwoawxvbarblzgrfedqa.supabase.co";
const apiKey = import.meta.env.VITE_API_KEY;

const supabase = apiKey
  ? createClient(supabaseUrl, apiKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export default supabase;