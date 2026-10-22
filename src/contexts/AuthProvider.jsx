import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import supabase from "../supabase";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(
    supabase ? "" : "Missing VITE_API_KEY in .env.local."
  );

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    let receivedAuthEvent = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;

      receivedAuthEvent = true;
      setSession(nextSession);
      setError("");
      setLoading(false);
    });

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active || receivedAuthEvent) return;

        if (sessionError) throw sessionError;

        setSession(data.session);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        if (!active || receivedAuthEvent) return;

        setError(err.message || "Could not restore your session.");
        setLoading(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}