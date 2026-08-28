import { Button } from "@/components/ui/button";
import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects } from "@/hooks/use-projects";
import { API_BASE_URL } from "@workspace/replit-auth-web";
import { useEffect, useState } from "react";
import { useSocket } from "@workspace/api-client-react/useSocket";

type CeoUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city?: string;
  isOnline?: boolean;
  isActive: boolean;
  createdAt: string;
};

export default function CeoDashboard() {
  const { user, ready } = useDashboardGuard("ceo");
  const { notifications, unreadCount } = useNotifications(user);
  const { projects, loading } = useProjects(user);
  const [users, setUsers] = useState<CeoUser[]>([]);
  const socket = useSocket(!!user);

  const fetchUsers = () => {
    fetch(`${API_BASE_URL}/api/users`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]));
  };

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const onPresence = ({ userId, online }: { userId: string; online: boolean }) => {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isOnline: online } : u)));
    };
    socket.on("presence:update", onPresence);
    return () => {
      socket.off("presence:update", onPresence);
    };
  }, [socket]);

  if (!ready || !user) return null;

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`${API_BASE_URL}/api/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) fetchUsers();
  };

  const totalRevenueProjects = projects.filter((p) => p.projectValue);
  const onlineCount = users.filter((u) => u.isOnline).length;
  const completed = projects.filter((p) => p.status === "Completed").length;

  return (
    <DashboardShell title="Executive Dashboard" subtitle="CEO Access" user={user} notificationCount={unreadCount}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1c1a16]">Welcome, {user.firstName}</h1>
        <p className="text-[#4e473d] mt-1">Company-wide real-time overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Total Staff & Customers" value={users.length} />
        <StatCard label="Online Now" value={onlineCount} hint="real-time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Project Portfolio Value</h2>
          {loading ? (
            <p className="text-[#4e473d] text-sm">Loading...</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {totalRevenueProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between border-b border-[#f0e9da] pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#1c1a16]">{project.title}</p>
                    <p className="text-xs text-[#4e473d]">{project.city} · {project.status}</p>
                  </div>
                  <span className="font-serif font-bold text-[#b88f34]">{project.projectValue}</span>
                </div>
              ))}
              {totalRevenueProjects.length === 0 && (
                <p className="text-[#4e473d] text-sm">No valuation data available yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-[#4e473d] text-sm">No notifications yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 6).map((n) => (
                <div key={n._id} className="border-b border-[#f0e9da] pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold text-[#1c1a16]">{n.title}</p>
                  {n.body && <p className="text-xs text-[#4e473d]">{n.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
        <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">All Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-[#4e473d] border-b border-[#e8dcc6]">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Online</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[#f0e9da] last:border-0">
                  <td className="py-2 pr-4 font-medium text-[#1c1a16]">{u.firstName} {u.lastName}</td>
                  <td className="py-2 pr-4 text-[#4e473d]">{u.email}</td>
                  <td className="py-2 pr-4 uppercase text-xs text-[#b88f34] font-semibold">{u.role}</td>
                  <td className="py-2 pr-4">{u.isActive ? "Active" : "Disabled"}</td>
                  <td className="py-2 pr-4">
                    <span className={u.isOnline ? "text-green-600" : "text-[#a89f8f]"}>
                      {u.isOnline ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    {u.role !== "ceo" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(u._id, u.isActive)}
                        className="rounded-full text-xs"
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
