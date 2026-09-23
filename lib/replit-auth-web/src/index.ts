import { useCallback, useEffect, useState } from "react";

export type UserRole = "customer" | "engineer" | "admin" | "ceo";

export type AuthUser = {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  role: UserRole;
  profileImageUrl?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  skills?: string[];
  experience?: number;
  available?: boolean;
  department?: string;
  isActive?: boolean;
  isOnline?: boolean;
  lastLogin?: string;
  createdAt?: string;
};

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  password: string;
  role?: "customer" | "engineer" | "admin";
  staffAccessCode?: string;
  specialization?: string;
  experience?: number;
  city?: string;
  state?: string;
};

export type VerificationChallenge = { challenge: string; channel: "email" | "phone"; destination: string };
export type LoginResult = { success: boolean; message?: string; user?: AuthUser; verification?: VerificationChallenge };

export type UseAuthResult = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
  loginWithEmail: (identifier: string, password: string, role?: string, channel?: "email" | "phone") => Promise<LoginResult>;
  ceoLogin: (email: string, password: string, accessCode: string, channel?: "email" | "phone") => Promise<LoginResult>;
  signup: (data: SignupData & { channel?: "email" | "phone" }) => Promise<LoginResult>;
  verifyCode: (challenge: string, code: string) => Promise<LoginResult>;
  resendCode: (challenge: string, channel: "email" | "phone") => Promise<LoginResult>;
};

/**
 * Base URL of the Express API server.
 * Falls back to same-origin so a reverse proxy setup also works,
 * but defaults to the standalone backend on port 5000 for local dev.
 */
export const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000");

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function notifyAuthChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("swapnapurti-auth-changed"));
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("swapnapurti-auth-changed", refresh);
    return () => window.removeEventListener("swapnapurti-auth-changed", refresh);
  }, [refresh]);

  // Legacy no-op kept for compatibility with components that call login()
  const login = () => {
    window.location.href = "/login";
  };

  const loginWithEmail = async (identifier: string, password: string, role = "customer", channel: "email" | "phone" = "email"): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier, password, role, channel }),
      });
      const data = await parseJsonSafe(response);
      if (response.ok && data?.requiresVerification) {
        return { success: true, verification: data.verification };
      }
      if (response.ok && data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || "Invalid email or password" };
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const ceoLogin = async (
    email: string,
    password: string,
    accessCode: string,
    channel: "email" | "phone" = "email"
  ): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/ceo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, accessCode, channel }),
      });
      const data = await parseJsonSafe(response);
      if (response.ok && data?.requiresVerification) {
        return { success: true, verification: data.verification };
      }
      if (response.ok && data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || "Invalid credentials" };
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await parseJsonSafe(response);
      if (response.ok && result?.requiresVerification) {
        return { success: true, verification: result.verification };
      }
      if (response.ok && result?.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      }
      return { success: false, message: result?.message || "Signup failed" };
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (challenge: string, code: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ challenge, code }) });
      const data = await parseJsonSafe(response);
      if (response.ok && data?.user) { setUser(data.user); setIsAuthenticated(true); notifyAuthChanged(); return { success: true, user: data.user }; }
      return { success: false, message: data?.message || "Invalid verification code" };
    } catch { return { success: false, message: "Network error. Please try again." }; }
  };

  const resendCode = async (challenge: string, channel: "email" | "phone"): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge, channel }) });
      const data = await parseJsonSafe(response);
      return response.ok ? { success: true, verification: data?.verification } : { success: false, message: data?.message || "Unable to resend code" };
    } catch { return { success: false, message: "Network error. Please try again." }; }
  };

  const logout = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      setUser(null);
      setIsAuthenticated(false);
      notifyAuthChanged();
      setIsLoading(false);
      window.location.href = "/";
    });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refresh,
    loginWithEmail,
    ceoLogin,
    signup,
    verifyCode,
    resendCode,
  };
}

/**
 * Returns the dashboard route for a given role.
 */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "customer":
      return "/dashboard/customer";
    case "engineer":
      return "/dashboard/engineer";
    case "admin":
      return "/dashboard/admin";
    case "ceo":
      return "/dashboard/ceo";
    default:
      return "/";
  }
}
