import { useCallback, useEffect, useState } from "react";

export type UserRole = "customer" | "engineer" | "admin" | "ceo";

export type AuthUser = {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
  password: string;
  role?: "customer" | "engineer" | "admin";
  staffAccessCode?: string;
  specialization?: string;
  experience?: number;
  city?: string;
  state?: string;
};

export type LoginResult = { success: boolean; message?: string; user?: AuthUser };

export type UseAuthResult = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<LoginResult>;
  ceoLogin: (email: string, password: string, accessCode: string) => Promise<LoginResult>;
  signup: (data: SignupData) => Promise<LoginResult>;
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
  }, [refresh]);

  // Legacy no-op kept for compatibility with components that call login()
  const login = () => {
    window.location.href = "/login";
  };

  const loginWithEmail = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJsonSafe(response);
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
    accessCode: string
  ): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/ceo-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, accessCode }),
      });
      const data = await parseJsonSafe(response);
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

  const logout = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      setUser(null);
      setIsAuthenticated(false);
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
