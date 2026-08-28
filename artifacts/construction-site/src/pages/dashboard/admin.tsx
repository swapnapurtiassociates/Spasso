import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects } from "@/hooks/use-projects";
import { API_BASE_URL } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import { useEffect, useState } from "react";

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  city?: string;
  isOnline?: boolean;
  isActive: boolean;
};

export default function AdminDashboard() {
  const { user, ready } = useDashboardGuard("admin");
  const { notifications, unreadCount } = useNotifications(user);
  const { projects, loading, createProject } = useProjects(user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState({
    title: "",
    category: "Residential",
    description: "",
    city: "",
    status: "Planned",
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE_URL}/api/users`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { users: [] }))
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]));
  }, [user]);

  if (!ready || !user) return null;

  const engineers = users.filter((u) => u.role === "engineer");
  const customers = users.filter((u) => u.role === "customer");
  const onlineCount = users.filter((u) => u.isOnline).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.city) {
      setFormError("Title, description and city are required");
      return;
    }
    setCreating(true);
    setFormError("");
    try {
      await createProject({
        ...form,
        status: form.status as "Planned" | "Ongoing" | "Completed" | "On Hold",
      });
      setForm({ title: "", category: "Residential", description: "", city: "", status: "Planned" });
    } catch {
      setFormError("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardShell title="Admin Console" subtitle="Swapnapurti Associates" user={user} notificationCount={unreadCount}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1c1a16]">Welcome, {user.firstName}</h1>
        <p className="text-[#4e473d] mt-1">Operations overview · {user.department || "Operations"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Engineers" value={engineers.length} />
        <StatCard label="Customers" value={customers.length} />
        <StatCard label="Online Now" value={onlineCount} hint="real-time" />
        <Link href="/dashboard/admin/enquiries">
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <StatCard label="Enquiries" value="View All" hint="manage leads" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">All Projects</h2>
          {loading ? (
            <p className="text-[#4e473d] text-sm">Loading projects...</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {projects.map((project) => (
                <div key={project._id} className="border border-[#e8dcc6] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-[#1c1a16]">{project.title}</h3>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#b88f34]">{project.status}</span>
                  </div>
                  <p className="text-sm text-[#4e473d]">{project.city} · {project.progress}% complete</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Create New Project</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <Input name="title" placeholder="Project Title" value={form.title} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6]" />
            <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6]" />
            <Input name="city" placeholder="City" value={form.city} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6]" />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 rounded-lg border border-[#e8dcc6] p-3 text-sm focus:outline-none focus:border-[#b88f34]"
            />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <Button type="submit" disabled={creating} className="w-full rounded-full bg-[#b88f34] hover:bg-[#a6792b] text-white">
              {creating ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Engineers</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {engineers.map((e) => (
              <div key={e._id} className="flex items-center justify-between border-b border-[#f0e9da] pb-2 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#1c1a16]">{e.firstName} {e.lastName}</p>
                  <p className="text-xs text-[#4e473d]">{e.email}</p>
                </div>
                <span className={`text-xs font-semibold ${e.isOnline ? "text-green-600" : "text-[#a89f8f]"}`}>
                  {e.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Recent Notifications</h2>
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
    </DashboardShell>
  );
}
