import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@workspace/api-client-react/useSocket";
import { API_BASE_URL, type AuthUser } from "@workspace/replit-auth-web";

export type DashboardProject = {
  _id: string;
  title: string;
  category: string;
  shortDescription?: string;
  description: string;
  city: string;
  state?: string;
  location?: string;
  status: "Planned" | "Ongoing" | "Completed" | "On Hold";
  clientName?: string;
  customer?: { _id: string; firstName: string; lastName: string; email: string } | string | null;
  projectValue?: string;
  completionYear?: number;
  progress: number;
  tags?: string[];
  imageUrl?: string;
  images?: { label: string; url: string }[];
  published?: boolean;
  areaCovered?: string;
  keyFeatures?: string[];
  featured?: boolean;
  startDate?: string;
  completionDate?: string;
  assignedEngineers?: { _id: string; firstName: string; lastName: string; specialization?: string }[];
  createdAt: string;
};

export function useProjects(user: AuthUser | null) {
  const queryClient = useQueryClient();
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket(!!user);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const upsert = (project: DashboardProject) => {
      setProjects((prev) => {
        const exists = prev.some((p) => p._id === project._id);
        return exists ? prev.map((p) => (p._id === project._id ? project : p)) : [project, ...prev];
      });
    };

    socket.on("project:created", upsert);
    socket.on("project:updated", upsert);

    return () => {
      socket.off("project:created", upsert);
      socket.off("project:updated", upsert);
    };
  }, [socket]);

  const createProject = async (payload: Partial<DashboardProject>) => {
    const res = await fetch(`${API_BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to create project");
    return data.project as DashboardProject;
  };

  const uploadProjectImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE_URL}/api/projects/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.url) {
      throw new Error(data?.message || "Failed to upload project image");
    }
    return data.url as string;
  };

  const updateProject = async (id: string, payload: Partial<DashboardProject>) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to update project");
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    await queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
    await queryClient.invalidateQueries({ queryKey: ["project"] });
    return data.project as DashboardProject;
  };

  const deleteProject = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to delete project");
    setProjects((prev) => prev.filter((project) => project._id !== id));
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
    await queryClient.invalidateQueries({ queryKey: ["featured-projects"] });
    return data as { message: string; imageCleanupWarning?: string };
  };

  useEffect(() => {
    if (!socket) return;
    const remove = (id: string) => setProjects((prev) => prev.filter((project) => project._id !== id));
    socket.on("project:deleted", remove);
    return () => {
      socket.off("project:deleted", remove);
    };
  }, [socket]);

  return { projects, loading, createProject, updateProject, deleteProject, uploadProjectImage, refetch: fetchProjects };
}
