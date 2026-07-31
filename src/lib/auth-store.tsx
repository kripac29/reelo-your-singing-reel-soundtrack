import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch, getApiError } from "@/lib/api";

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

export function clearStoredSession() {
  if (typeof window !== "undefined") window.localStorage.removeItem("token");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined") return null;
  try {
    const response = await apiFetch("/auth/me");
    if (response.status === 401 || response.status === 403) clearStoredSession();
    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    return data?.user ?? null;
  } catch {
    // A Render cold start or temporary network failure must not crash route guards.
    return null;
  }
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
    const response = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message = typeof data?.message === "string" ? data.message : "Unable to sign in";
      throw new Error(message);
    }
    if (!data?.token || !data?.user) throw new Error("Login did not return a valid session");

    window.localStorage.setItem("token", data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await apiFetch("/auth/logout", { method: "POST" });
      if (!response.ok) throw await getApiError(response, "Unable to log out");
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
