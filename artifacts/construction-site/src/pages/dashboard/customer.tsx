import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects } from "@/hooks/use-projects";

export default function CustomerDashboard() {
  const { user, ready } = useDashboardGuard("customer");
  const { notifications, unreadCount } = useNotifications(user);
  const { projects, loading } = useProjects(user);

  if (!ready || !user) return null;

  const ongoing = projects.filter((p) => p.status === "Ongoing").length;
  const completed = projects.filter((p) => p.status === "Completed").length;

  return (
    <DashboardShell title="Customer Portal" subtitle="Swapnapurti Associates" user={user} notificationCount={unreadCount}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1c1a16]">Welcome, {user.firstName}</h1>
        <p className="text-[#4e473d] mt-1">Track your projects and stay updated in real time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Projects" value={projects.length} />
        <StatCard label="Ongoing" value={ongoing} />
        <StatCard label="Completed" value={completed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Your Projects</h2>
          {loading ? (
            <p className="text-[#4e473d] text-sm">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-[#4e473d] text-sm">You don't have any projects yet. Get in touch with our team to start one.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="border border-[#e8dcc6] rounded-2xl p-4" data-testid={`project-${project._id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-[#1c1a16]">{project.title}</h3>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#b88f34]">{project.status}</span>
                  </div>
                  <p className="text-sm text-[#4e473d] mb-3">{project.description}</p>
                  <div className="w-full bg-[#f0e9da] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#b88f34] h-2 rounded-full transition-all duration-700"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#4e473d] mt-1">{project.progress}% complete</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Recent Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-[#4e473d] text-sm">No notifications yet. You'll see real-time project updates here.</p>
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
