import { useEffect, useState } from "react";
import { useSocket } from "@workspace/api-client-react/useSocket";
import { API_BASE_URL, type AuthUser } from "@workspace/replit-auth-web";

export type DashboardProject = {
  _id: string;
  title: string;
  category: string;
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
  assignedEngineers?: { _id: string; firstName: string; lastName: string; specialization?: string }[];
  createdAt: string;
};

export function useProjects(user: AuthUser | null) {
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
    if (!res.ok) throw new Error("Failed to create project");
    const data = await res.json();
    return data.project as DashboardProject;
  };

  const updateProject = async (id: string, payload: Partial<DashboardProject>) => {
    const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update project");
    const data = await res.json();
    return data.project as DashboardProject;
  };

  return { projects, loading, createProject, updateProject, refetch: fetchProjects };
}
