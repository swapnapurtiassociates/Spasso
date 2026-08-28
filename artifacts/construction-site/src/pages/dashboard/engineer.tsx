import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects } from "@/hooks/use-projects";
import { useState } from "react";

export default function EngineerDashboard() {
  const { user, ready } = useDashboardGuard("engineer");
  const { notifications, unreadCount } = useNotifications(user);
  const { projects, loading, updateProject } = useProjects(user);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [progressDrafts, setProgressDrafts] = useState<Record<string, number>>({});

  if (!ready || !user) return null;

  const assigned = projects.length;
  const ongoing = projects.filter((p) => p.status === "Ongoing").length;

  const handleProgressChange = (id: string, value: number) => {
    setProgressDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id: string) => {
    const value = progressDrafts[id];
    if (value === undefined) return;
    setSavingId(id);
    try {
      await updateProject(id, {
        progress: value,
        status: value >= 100 ? "Completed" : value > 0 ? "Ongoing" : "Planned",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardShell title="Engineer Workspace" subtitle="Swapnapurti Associates" user={user} notificationCount={unreadCount}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1c1a16]">Welcome, {user.firstName}</h1>
        <p className="text-[#4e473d] mt-1">
          {user.specialization || "Engineer"} · {user.city}, {user.state}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Assigned Projects" value={assigned} />
        <StatCard label="Ongoing" value={ongoing} />
        <StatCard label="Experience" value={`${user.experience ?? 0} yrs`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">Assigned Projects</h2>
          {loading ? (
            <p className="text-[#4e473d] text-sm">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-[#4e473d] text-sm">No projects assigned to you yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project._id} className="border border-[#e8dcc6] rounded-2xl p-4" data-testid={`eng-project-${project._id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif font-bold text-[#1c1a16]">{project.title}</h3>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#b88f34]">{project.status}</span>
                  </div>
                  <p className="text-sm text-[#4e473d] mb-3">
                    {project.city}{project.location ? `, ${project.location}` : ""}
                  </p>
                  <div className="w-full bg-[#f0e9da] rounded-full h-2 overflow-hidden mb-3">
                    <div className="bg-[#b88f34] h-2 rounded-full transition-all duration-700" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      defaultValue={project.progress}
                      onChange={(e) => handleProgressChange(project._id, Number(e.target.value))}
                      className="w-24 h-10 rounded-lg border border-[#e8dcc6]"
                      data-testid={`input-progress-${project._id}`}
                    />
                    <span className="text-sm text-[#4e473d]">% progress</span>
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(project._id)}
                      disabled={savingId === project._id}
                      className="rounded-full bg-[#b88f34] hover:bg-[#a6792b] text-white ml-auto"
                      data-testid={`button-update-${project._id}`}
                    >
                      {savingId === project._id ? "Saving..." : "Update"}
                    </Button>
                  </div>
                </div>
              ))}
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
    </DashboardShell>
  );
}
