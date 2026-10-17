import { supabaseUrl, apiKey, supabase } from "./supabase";

export default async function request(endpoint, method = "GET", data, accessToken, options = {}) {
  if (!apiKey) throw new Error("Missing VITE_API_KEY in your root .env.local file.");
  if (!endpoint.startsWith("/") || endpoint.startsWith("//")) {
    throw new Error("Use a relative Supabase endpoint starting with /.");
  }
  method = method.toUpperCase();
  const headers = { apikey: apiKey };
  if (data !== undefined) headers["Content-Type"] = "application/json";

  // Use the SDK's current session, including its automatic token refresh.
  if (accessToken === undefined && endpoint.startsWith("/rest/v1/")) {
    const { data: sessionData, error } = await supabase.auth.getSession();
    if (error) throw error;
    accessToken = sessionData.session?.access_token;
  }
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (endpoint.startsWith("/rest/v1/") && ["POST", "PATCH", "DELETE"].includes(method)) {
    headers.Prefer = "return=representation";
  }

  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    method, headers, signal: options.signal,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  const text = await response.text();
  let result = null;
  if (text) {
    try { result = JSON.parse(text); }
    catch { throw new Error(`Unexpected server response (${response.status}).`); }
  }
  if (!response.ok) {
    throw new Error(result?.msg || result?.message || result?.error_description || result?.error || `Request failed (${response.status}).`);
  }
  return result;
}
