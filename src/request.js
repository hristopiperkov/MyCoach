const baseUrl = "https://nwoawxvbarblzgrfedqa.supabase.co";
const apiKey = import.meta.env.VITE_API_KEY;

export default async function request(
    endpoint,
    method = "GET",
    data,
    accessToken
) {
    if (!apiKey) {
        throw new Error("Missing VITE_API_KEY in .env.local.");
    }

    const headers = {
        apikey: apiKey,
    };

    if (data !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    if (
        endpoint.startsWith("/rest/v1/") &&
        ["POST", "PATCH", "DELETE"].includes(method)
    ) {
        headers.Prefer = "return=representation";
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    const text = await response.text();

    let result = null;

    if (text) {
        try {
            result = JSON.parse(text);
        } catch {
            throw new Error(`Unexpected server response (${response.status}).`);
        }
    }

    if (!response.ok) {
        throw new Error(
            result?.msg ||
            result?.message ||
            result?.error_description ||
            result?.error ||
            `Request failed (${response.status}).`
        );
    }

    return result;
}