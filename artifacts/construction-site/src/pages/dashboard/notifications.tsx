import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@workspace/replit-auth-web";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { notifications, markRead } = useNotifications(user);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) setLocation("/login");
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading || !user) return <div className="min-h-screen bg-background" />;

  return (
    <DashboardShell title="Notifications" subtitle="Your activity" user={user}>
      <div className="mx-auto max-w-3xl space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">No notifications yet.</div>
        ) : notifications.map((notification) => (
          <button key={notification._id} type="button" onClick={() => markRead(notification._id)} className={`block w-full rounded-2xl border p-5 text-left transition-colors hover:bg-muted ${notification.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-start justify-between gap-4">
              <div><p className="font-semibold text-foreground">{notification.title}</p><p className="mt-1 text-sm text-muted-foreground">{notification.body}</p></div>
              {!notification.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
            </div>
          </button>
        ))}
      </div>
    </DashboardShell>
  );
}