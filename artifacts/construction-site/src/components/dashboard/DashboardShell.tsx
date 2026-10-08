import { Button } from "@/components/ui/button";
import { dashboardPathForRole, useAuth, type AuthUser } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { useLocation } from "wouter";

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  user: AuthUser;
  notificationCount?: number;
  fullWidth?: boolean;
  children: ReactNode;
};

export function DashboardShell({
  title,
  subtitle,
  user,
  notificationCount = 0,
  fullWidth = false,
  children,
}: DashboardShellProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      <header className="sticky top-0 z-40 w-full border-b border-[#e8dcc6] bg-[#faf6f0]/95 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-light.png"
                alt="Swapnapurti Associates"
                className="h-11 w-auto max-w-[190px] object-contain"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-[#1c1a16]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#4e473d]">{user.role}</span>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={logout}
                className="shrink-0 rounded-full border-[#1c1a16] bg-[#1c1a16] px-4 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#3a3328] hover:text-white"
                data-testid="button-logout"
              >
                <LogOut size={14} />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={fullWidth ? "w-full px-0 py-0" : "container mx-auto px-4 md:px-6 py-10"}
      >
        {children}
      </motion.main>
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <p className="text-xs uppercase tracking-widest text-[#4e473d] mb-2">{label}</p>
      <p className="text-3xl font-serif font-bold text-[#1c1a16]">{value}</p>
      {hint && <p className="text-xs text-[#b88f34] mt-1">{hint}</p>}
    </div>
  );
}

/**
 * Guard hook-like helper: redirects unauthenticated users or wrong-role users.
 * Use inside each dashboard page component.
 */
export function useDashboardGuard(expectedRole: string) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (!isLoading && (!isAuthenticated || !user)) {
    setLocation("/login");
    return { user: null, ready: false };
  }

  if (!isLoading && user && user.role !== expectedRole) {
    setLocation(dashboardPathForRole(user.role));
    return { user: null, ready: false };
  }

  return { user, ready: !isLoading && !!user };
}
