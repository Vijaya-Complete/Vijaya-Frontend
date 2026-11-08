// API client wrapping fetch with JWT bearer auth and base URL from env.
// Phase 1 falls back to mock data when the API is unreachable.
const BASE = (import.meta.env.VITE_PUBLIC_API_URL as string | undefined) ?? "";

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const t = localStorage.getItem("vijaya_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BASE) throw new Error("API_NOT_CONFIGURED");
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init.headers || {}),
    },
  });
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("vijaya_token");
    window.location.href = "/login";
  }
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}
