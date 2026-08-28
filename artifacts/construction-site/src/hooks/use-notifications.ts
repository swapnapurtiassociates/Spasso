import { useEffect, useState } from "react";
import { useSocket } from "@workspace/api-client-react/useSocket";
import { API_BASE_URL, type AuthUser } from "@workspace/replit-auth-web";

export type AppNotification = {
  _id: string;
  title: string;
  body?: string;
  type: "info" | "success" | "warning" | "alert";
  link?: string;
  read: boolean;
  createdAt: string;
};

export function useNotifications(user: AuthUser | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const socket = useSocket(!!user);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE_URL}/api/notifications`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { notifications: [] }))
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const onNew = (notification: AppNotification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
    } catch {
      // best-effort
    }
  };

  return { notifications, unreadCount, markRead };
}
