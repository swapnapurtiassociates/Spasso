import { Button } from "@/components/ui/button";
import { dashboardPathForRole, useAuth, type AuthUser } from "@workspace/replit-auth-web";
import { motion } from "framer-motion";
import { Bell, LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { useLocation } from "wouter";

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  user: AuthUser;
  notificationCount?: number;
  children: ReactNode;
};

export function DashboardShell({ title, subtitle, user, notificationCount = 0, children }: DashboardShellProps) {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f2e8]">
      <header className="sticky top-0 z-40 w-full border-b border-[#e8dcc6] bg-[#faf6f0]/95 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[#b88f34] rounded-sm flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">S</span>
              </div>
              <div>
                <p className="font-serif font-bold text-lg text-[#1c1a16] leading-tight">{title}</p>
                {subtitle && <p className="text-xs uppercase tracking-widest text-[#b88f34]">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-full hover:bg-[#f0e9da] transition-colors"
                onClick={() => setLocation("/dashboard/notifications")}
                aria-label="Notifications"
                data-testid="button-notifications"
              >
                <Bell size={20} className="text-[#4e473d]" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#b88f34] text-[10px] font-bold text-white flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-[#1c1a16]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs uppercase tracking-wider text-[#4e473d]">{user.role}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-full uppercase font-medium tracking-wider text-xs gap-2"
                data-testid="button-logout"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4 md:px-6 py-10"
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
