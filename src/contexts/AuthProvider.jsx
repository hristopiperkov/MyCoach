import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import supabase from "../supabase";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError("Missing VITE_API_KEY in .env.local.");
      setLoading(false);
      return;
    }

    let active = true;
    let receivedAuthEvent = false;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return;

        receivedAuthEvent = true;
        setSession(nextSession);
        setError("");
        setLoading(false);
      });

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active || receivedAuthEvent) return;

        if (error) throw error;

        setSession(data.session);
        setLoading(false);
      })
      .catch((error) => {
        if (!active || receivedAuthEvent) return;

        setError(error.message);
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