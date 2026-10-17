import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "../utils/supabase";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState(supabase ? "" : "Missing VITE_API_KEY in your root .env.local file.");

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let receivedEvent = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      receivedEvent = true;
      setSession(nextSession);
      setInitializing(false);
      setAuthError("");
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || receivedEvent) return;
      if (error) setAuthError(error.message);
      else setSession(data.session);
      setInitializing(false);
    }).catch((error) => {
      if (active) { setAuthError(error.message); setInitializing(false); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ user: session?.user || null, session, initializing, authError }}>{children}</AuthContext.Provider>;
}
