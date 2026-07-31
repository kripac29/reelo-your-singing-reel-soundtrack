import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const API_BASE_URL = "http://https://reelo-your-singing-reel-soundtrack.onrender.com/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
};

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthState | null>(null);

function headers(): Record<string, string> {
  const token = typeof window === "undefined" ? null : window.localStorage.getItem("token");
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function errorMessage(payload: unknown, fallback: string) {
  return typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
    ? payload.message
    : fallback;
}

export function clearStoredSession() {
  if (typeof window !== "undefined") window.localStorage.removeItem("token");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null;
  const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: headers(), credentials: "include" });
  if (!response.ok) {
    clearStoredSession();
    return null;
  }

  const data = await response.json().catch(() => null);
  return data?.user ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    void refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(errorMessage(data, "Unable to sign in"));
    if (!data?.token || !data?.user) throw new Error("Login did not return a valid session");

    window.localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST", headers: headers(), credentials: "include" });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(data, "Unable to log out"));
    } finally {
      clearStoredSession();
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, isLoading, signIn, logout, refreshSession }), [user, isLoading, signIn, logout, refreshSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
