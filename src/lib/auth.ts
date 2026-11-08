// ─── Auth helpers ──────────────────────────────────────────────
// Dummy credentials — replace with real API calls when backend is ready.

export type AppUser = {
  name: string;
  email: string;
  role: "admin" | "user";
};

/** Hard-coded admin account for demo / development */
const ADMIN = {
  email: "admin@vijaya.lk",
  password: "Vijaya@2025",
};

export function tryLogin(email: string, password: string): AppUser | null {
  const e = email.trim().toLowerCase();

  // Admin credential check
  if (e === ADMIN.email && password === ADMIN.password) {
    return { name: "Admin", email: e, role: "admin" };
  }

  // Any other email + min-6-char password = regular user (mock)
  if (e && password.length >= 6) {
    return { name: e.split("@")[0], email: e, role: "user" };
  }

  return null;
}

export function saveSession(user: AppUser) {
  localStorage.setItem("vijaya_token", "mock-jwt-" + user.role);
  localStorage.setItem("vijaya_user", JSON.stringify(user));
}

export function getSession(): AppUser | null {
  try {
    const raw = localStorage.getItem("vijaya_user");
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("vijaya_token");
  localStorage.removeItem("vijaya_user");
}

export function isAdmin(): boolean {
  return getSession()?.role === "admin";
}
