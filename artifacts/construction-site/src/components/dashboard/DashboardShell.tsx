import { Button } from "@/components/ui/button";
import { useAuth, type AuthUser } from "@workspace/replit-auth-web";
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-lg">S</span>
              </div>
              <div>
                <p className="font-serif font-bold text-lg text-foreground leading-tight">{title}</p>
                {subtitle && <p className="text-xs uppercase tracking-widest text-primary">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setLocation("/dashboard/notifications")}
                aria-label="Notifications"
                data-testid="button-notifications"
              >
                <Bell size={20} className="text-muted-foreground" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-foreground">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{user.role}</span>
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
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
      {hint && <p className="text-xs text-primary mt-1">{hint}</p>}
    </div>
  );
}

