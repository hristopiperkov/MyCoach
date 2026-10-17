import request from "../utils/request";
import { supabase } from "../utils/supabase";

async function storeSession(result) {
  if (!result?.access_token || !result?.refresh_token) return null;
  const { data, error } = await supabase.auth.setSession({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
  });
  if (error) throw error;
  return data.session;
}

export async function login(email, password) {
  const result = await request("/auth/v1/token?grant_type=password", "POST", {
    email: email.trim(), password,
  });
  const session = await storeSession(result);
  if (!session) throw new Error("Login did not return a session. Please try again.");
  return session;
}

export async function register({ email, password, first_name, last_name, role, img_url }) {
  const redirect = encodeURIComponent(`${window.location.origin}/login`);
  const result = await request(`/auth/v1/signup?redirect_to=${redirect}`, "POST", {
    email: email.trim(), password,
    data: {
      first_name: first_name.trim(), last_name: last_name.trim(), role,
      img_url: img_url.trim() || null,
    },
  });
  // With email confirmation enabled, successful signup does not return a session.
  const session = await storeSession(result);
  return { session };
}

export async function logout() {
  if (!supabase) throw new Error("Missing Supabase configuration.");
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}
