import { dashboardPathForRole, useAuth, type AuthUser } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";

export function useDashboardGuard(expectedRole: string) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (!isLoading && (!isAuthenticated || !user)) {
    setLocation("/login");
    return { user: null as AuthUser | null, ready: false };
  }

  if (!isLoading && user && user.role !== expectedRole) {
    setLocation(dashboardPathForRole(user.role));
    return { user: null as AuthUser | null, ready: false };
  }

  return { user, ready: !isLoading && !!user };
}