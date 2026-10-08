import { DashboardShell, StatCard, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotifications } from "@/hooks/use-notifications";
import { useProjects, type DashboardProject } from "@/hooks/use-projects";
import { API_BASE_URL } from "@workspace/replit-auth-web";
import { Pencil, Star, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

const VIEW_LABELS = ["Exterior", "Top view", "Front elevation", "Side elevation", "Interior / layout", "Other"];
type ProjectForm = {
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  city: string;
  state: string;
  location: string;
  status: DashboardProject["status"];
  clientName: string;
  projectValue: string;
  areaCovered: string;
  completionYear: string;
  startDate: string;
  completionDate: string;
  progress: string;
  tags: string;
  keyFeatures: string;
  featured: boolean;
};

const EMPTY_FORM: ProjectForm = {
  title: "",
  category: "Residential",
  shortDescription: "",
  description: "",
  city: "",
  state: "",
  location: "",
  status: "Planned" as const,
  clientName: "",
  projectValue: "",
  areaCovered: "",
  completionYear: "",
  startDate: "",
  completionDate: "",
  progress: "0",
  tags: "",
  keyFeatures: "",
  featured: false,
};

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
  const { projects, loading, createProject, updateProject, deleteProject, uploadProjectImage, refetch } = useProjects(user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewFiles, setViewFiles] = useState<Record<string, File | null>>({});
  const [draftProjectId, setDraftProjectId] = useState<string>();
  const [editingProjectId, setEditingProjectId] = useState<string>();
  const [uploadedViews, setUploadedViews] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [projectAction, setProjectAction] = useState<string | null>(null);
  const [projectActionError, setProjectActionError] = useState("");

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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (project: DashboardProject) => {
    setEditingProjectId(project._id);
    setDraftProjectId(undefined);
    setForm({
      title: project.title || "",
      category: project.category || "Residential",
      shortDescription: project.shortDescription || "",
      description: project.description || "",
      city: project.city || "",
      state: project.state || "",
      location: project.location || "",
      status: project.status || "Planned",
      clientName: project.clientName || "",
      projectValue: project.projectValue || "",
      areaCovered: project.areaCovered || "",
      completionYear: project.completionYear ? String(project.completionYear) : "",
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      completionDate: project.completionDate ? project.completionDate.slice(0, 10) : "",
      progress: String(project.progress ?? 0),
      tags: project.tags?.join(", ") || "",
      keyFeatures: project.keyFeatures?.join("\n") || "",
      featured: project.featured ?? false,
    });
    const currentImages = Object.fromEntries(
      (project.images || []).map((image) => [image.label || "Project view", image.url]),
    );
    if (!Object.keys(currentImages).length && project.imageUrl) {
      currentImages.Exterior = project.imageUrl;
    }
    setUploadedViews(currentImages);
    setViewFiles({});
    setFormError("");
    setFormMessage("");
    document.getElementById("project-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(undefined);
    setDraftProjectId(undefined);
    setForm(EMPTY_FORM);
    setViewFiles({});
    setUploadedViews({});
    setFormError("");
    setFormMessage("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.city.trim()) {
      setFormError("Project name, description and city are required");
      return;
    }
    setCreating(true);
    setFormError("");
    setFormMessage("");
    const projectDetails = {
      ...form,
      progress: Number(form.progress) || 0,
      completionYear: form.completionYear ? Number(form.completionYear) : undefined,
      startDate: form.startDate ? new Date(`${form.startDate}T00:00:00.000Z`).toISOString() : undefined,
      completionDate: form.completionDate ? new Date(`${form.completionDate}T00:00:00.000Z`).toISOString() : undefined,
      tags: form.tags.split(",").map((value) => value.trim()).filter(Boolean),
      keyFeatures: form.keyFeatures.split("\n").map((value) => value.trim()).filter(Boolean),
    };
    let createdId = editingProjectId || draftProjectId;
    try {
      const existingProject = editingProjectId
        ? projects.find((project) => project._id === editingProjectId)
        : undefined;
      if (editingProjectId && !existingProject) {
        throw new Error("This project is no longer available. Refresh the project list and try again.");
      }
      if (!createdId) {
        const created = await createProject(projectDetails);
        createdId = created._id;
        setDraftProjectId(createdId);
      }
      if (!createdId) throw new Error("Project ID was not returned by the server");
      const projectId = createdId;
      const wasPublished = existingProject?.published !== false;
      await updateProject(projectId, {
        ...projectDetails,
        published: editingProjectId ? wasPublished : false,
      });
      const storedViews = { ...uploadedViews };
      for (const label of VIEW_LABELS) {
        const file = viewFiles[label];
        if (file) {
          storedViews[label] = await uploadProjectImage(file);
          setUploadedViews({ ...storedViews });
        }
      }
      const images = Object.entries(storedViews).map(([label, url]) => ({ label, url }));
      await updateProject(projectId, {
        images,
        imageUrl: images[0]?.url || "",
        published: editingProjectId ? wasPublished : true,
      });
      setForm(EMPTY_FORM);
      setViewFiles({});
      setDraftProjectId(undefined);
      setEditingProjectId(undefined);
      setUploadedViews({});
      setFormMessage(editingProjectId ? "Project changes saved." : "Project published to the public portfolio.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setFormError(
        createdId
          ? `Project changes could not be fully saved. Submit again to continue: ${message}`
          : `Project could not be created: ${message}`,
      );
    } finally {
      setCreating(false);
      refetch().catch(() => setFormError("The project list could not be refreshed."));
    }
  };

  const handleFeatureToggle = async (projectId: string, featured: boolean) => {
    setProjectAction(projectId);
    setProjectActionError("");
    try {
      await updateProject(projectId, { featured });
      await refetch();
    } catch (error) {
      setProjectActionError(error instanceof Error ? error.message : "Could not update homepage feature.");
    } finally {
      setProjectAction(null);
    }
  };

  const handleDelete = async (projectId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This also removes its stored gallery images.`)) return;
    setProjectAction(projectId);
    setProjectActionError("");
    try {
      const result = await deleteProject(projectId);
      if (result.imageCleanupWarning) setProjectActionError(result.imageCleanupWarning);
    } catch (error) {
      setProjectActionError(error instanceof Error ? error.message : "Could not delete project.");
    } finally {
      setProjectAction(null);
    }
  };

  return (
    <DashboardShell title="Admin Console" subtitle="Swapnapurti Associates" user={user} notificationCount={unreadCount}>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1c1a16]">Welcome, Saurabh</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-serif font-bold text-[#1c1a16] mb-4">All Projects</h2>
          {loading ? (
            <p className="text-[#4e473d] text-sm">Loading projects...</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto">
              {projectActionError && <p role="alert" className="text-sm text-red-700">{projectActionError}</p>}
              {projects.map((project) => (
                <div key={project._id} className="border border-[#e8dcc6] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-[#1c1a16]">{project.title}</h3>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#b88f34]">{project.status}</span>
                  </div>
                  <p className="text-sm text-[#4e473d]">
                    {project.city} · {project.progress}% complete
                    {project.published === false && <span className="ml-2 font-semibold text-amber-700">Draft</span>}
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#786f60]">
                        Progress
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={project.progress}
                          onChange={async (event) => {
                            const nextProgress = Number(event.target.value);
                            setProjectAction(project._id);
                            setProjectActionError("");
                            try {
                              await updateProject(project._id, { progress: nextProgress });
                              await refetch();
                            } catch (error) {
                              setProjectActionError(error instanceof Error ? error.message : "Could not update project progress.");
                            } finally {
                              setProjectAction(null);
                            }
                          }}
                          className="mt-2 w-full accent-[#b88f34]"
                        />
                      </label>
                      <div className="flex items-end justify-end pb-1 text-sm font-semibold text-[#1c1a16]">{project.progress}%</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={project.status}
                        onChange={async (event) => {
                          const nextStatus = event.target.value;
                          setProjectAction(project._id);
                          setProjectActionError("");
                          try {
                            await updateProject(project._id, { status: nextStatus as typeof project.status });
                            await refetch();
                          } catch (error) {
                            setProjectActionError(error instanceof Error ? error.message : "Could not update project status.");
                          } finally {
                            setProjectAction(null);
                          }
                        }}
                        className="h-9 rounded-lg border border-[#e8dcc6] bg-white px-2 text-sm text-[#1c1a16]"
                      >
                        {['Planned', 'Ongoing', 'Completed', 'On Hold'].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={projectAction !== null || creating}
                        onClick={() => handleEdit(project)}
                        className="text-[#1c1a16]"
                      >
                        <Pencil size={14} className="mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={projectAction !== null || project.published === false}
                        onClick={() => handleFeatureToggle(project._id, !project.featured)}
                        className={project.featured ? "border-[#b88f34] text-[#6f541d]" : "text-[#1c1a16]"}
                      >
                        <Star size={14} className={`mr-1.5 ${project.featured ? "fill-current" : ""}`} />
                        {project.featured ? "Featured on Home" : "Feature on Home"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={projectAction !== null}
                        onClick={() => handleDelete(project._id, project.title)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        <Trash2 size={14} className="mr-1.5" />
                        Delete
                      </Button>
                      {projectAction === project._id && <span className="self-center text-xs text-[#786f60]">Saving…</span>}
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-[#786f60]">No projects have been created yet.</p>}
            </div>
          )}
        </div>

        <div id="project-editor" className="scroll-mt-24 bg-white border border-[#e8dcc6] rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-serif font-bold text-[#1c1a16]">
              {editingProjectId ? "Edit Project" : "Create New Project"}
            </h2>
            {editingProjectId && (
              <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit} disabled={creating}>
                <X size={14} className="mr-1.5" />
                Cancel
              </Button>
            )}
          </div>
          <form onSubmit={handleCreate} className="space-y-3 text-[#1c1a16]">
            <Input name="title" placeholder="Project name *" value={form.title} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" required />
            <div className="grid grid-cols-2 gap-3">
              <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
              <select name="status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))} className="h-11 rounded-lg border border-[#e8dcc6] bg-white px-3 text-sm text-[#1c1a16]">
                {["Planned", "Ongoing", "Completed", "On Hold"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="city" placeholder="City *" value={form.city} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" required />
              <Input name="state" placeholder="State" value={form.state} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            </div>
            <Input name="location" placeholder="Area / location" value={form.location} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            <Input name="shortDescription" placeholder="Short portfolio summary" value={form.shortDescription} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            <textarea
              name="description"
              placeholder="Project description *"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
              className="w-full h-28 rounded-lg border border-[#e8dcc6] p-3 text-sm text-[#1c1a16] placeholder:text-[#786f60] focus:outline-none focus:border-[#b88f34]"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input name="clientName" placeholder="Client" value={form.clientName} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
              <Input name="projectValue" placeholder="Project value" value={form.projectValue} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="areaCovered" placeholder="Area covered" value={form.areaCovered} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
              <Input name="completionYear" type="number" min="1900" max="2200" placeholder="Completion year" value={form.completionYear} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-medium text-[#786f60]">
                Start date
                <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16]" />
              </label>
              <label className="space-y-1 text-xs font-medium text-[#786f60]">
                Completion date
                <Input name="completionDate" type="date" value={form.completionDate} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16]" />
              </label>
            </div>
            <Input name="progress" type="number" min="0" max="100" placeholder="Progress (%)" value={form.progress} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            <Input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} className="h-11 rounded-lg border-[#e8dcc6] text-[#1c1a16] placeholder:text-[#786f60]" />
            <textarea
              name="keyFeatures"
              placeholder="Key features (one per line)"
              value={form.keyFeatures}
              onChange={(e) => setForm((prev) => ({ ...prev, keyFeatures: e.target.value }))}
              className="w-full h-24 rounded-lg border border-[#e8dcc6] p-3 text-sm text-[#1c1a16] placeholder:text-[#786f60] focus:outline-none focus:border-[#b88f34]"
            />
            <label className="flex items-center gap-2 text-sm text-[#4e473d]">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-[#b88f34]" />
              Feature on the homepage
            </label>
            <div className="space-y-3 rounded-2xl border border-[#e8dcc6] p-4">
              <div>
                <p className="text-sm font-semibold text-[#1c1a16]">Project images</p>
                <p className="mt-1 text-xs text-[#786f60]">JPEG, PNG, WebP, or AVIF · up to 4 MB each</p>
              </div>
              {VIEW_LABELS.map((label) => (
                <label key={label} className="block text-xs font-medium text-[#4e473d]">
                  {label}
                  {uploadedViews[label] && (
                    <img
                      src={uploadedViews[label]}
                      alt={`Current ${label.toLowerCase()} for ${form.title}`}
                      className="mt-2 h-28 w-full rounded-lg border border-[#e8dcc6] object-cover"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => setViewFiles((prev) => ({ ...prev, [label]: e.target.files?.[0] || null }))}
                    className="mt-1 block w-full text-xs text-[#1c1a16] file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f2e8] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#6f541d]"
                  />
                </label>
              ))}
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            {formMessage && <p className="text-sm text-green-700">{formMessage}</p>}
            <Button type="submit" disabled={creating} className="w-full rounded-full bg-[#b88f34] hover:bg-[#a6792b] text-white">
              {creating ? (editingProjectId ? "Saving..." : "Creating...") : (editingProjectId ? "Save Changes" : "Create Project")}
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
