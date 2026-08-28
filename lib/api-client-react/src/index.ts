import { QueryKey, useMutation, useQuery } from "@tanstack/react-query";

/**
 * Base URL of the Express API server. Mirrors the constant in
 * @workspace/replit-auth-web so this package has no hard dependency on it.
 */
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5000");

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export type Project = {
  id: string;
  title: string;
  category: string;
  city: string;
  state?: string;
  location?: string;
  status?: string;
  clientName?: string;
  projectValue?: string;
  areaCovered?: string;
  keyFeatures?: string[];
  startDate?: string;
  completionDate?: string;
  completionYear?: number;
  tags?: string[];
  imageUrl: string;
  description: string;
  featured?: boolean;
};

export type Service = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export type Engineer = {
  id: number;
  fullName: string;
  role: string;
  city: string;
  state: string;
  country: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  available: boolean;
  experience: number;
  projectsCompleted: number;
  rating: number;
  bio: string;
  specialization?: string;
  skills?: string[];
};

export type OverviewStats = {
  completedProjects: string;
  engineersAvailable: string;
  citiesCovered: string;
  yearsExperience: string;
};

/**
 * Maps a raw MongoDB project document (as returned by /api/projects/public*)
 * into the shape the marketing-site UI expects.
 */
function mapProject(p: any): Project {
  return {
    id: p._id ?? p.id,
    title: p.title,
    category: p.category,
    city: p.city,
    state: p.state,
    location: p.location,
    status: p.status,
    clientName: p.clientName,
    projectValue: p.projectValue,
    areaCovered: p.areaCovered,
    keyFeatures: p.keyFeatures,
    startDate: p.startDate,
    completionDate: p.completionDate,
    completionYear: p.completionYear,
    tags: p.tags,
    imageUrl: p.imageUrl,
    description: p.description,
    featured: p.featured,
  };
}

const services: Service[] = [
  { id: 1, icon: "civil-engineering", title: "Civil Engineering", description: "Structural design, planning, and delivery." },
  { id: 2, icon: "project-management", title: "Project Management", description: "End-to-end execution with quality controls." },
  { id: 3, icon: "green-building", title: "Green Building", description: "Sustainable construction for modern infrastructure." },
];

const engineers: Engineer[] = [
  {
    id: 1,
    fullName: "Nisha Kapoor",
    role: "Senior Structural Engineer",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000",
    email: "nisha.kapoor@example.com",
    phone: "+91 98765 43210",
    available: true,
    experience: 12,
    projectsCompleted: 48,
    rating: 4.9,
    bio: "Experienced structural engineer with a passion for sustainable high-rise design.",
  },
  {
    id: 2,
    fullName: "Aarav Mehta",
    role: "Project Delivery Lead",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
    email: "aarav.mehta@example.com",
    phone: "+91 90123 45678",
    available: false,
    experience: 10,
    projectsCompleted: 36,
    rating: 4.8,
    bio: "Leader in operational excellence for large-scale infrastructure programs.",
  },
];

export function getGetEngineerQueryKey(id: number) {
  return ["engineer", id];
}

export function getGetProjectQueryKey(id: string) {
  return ["project", id];
}

/**
 * Fetches a single project from MongoDB via GET /api/projects/public/:id.
 */
export function useGetProject(id: string, options?: { query?: { enabled?: boolean; queryKey?: QueryKey } }) {
  return useQuery<Project | undefined>({
    queryKey: options?.query?.queryKey ?? getGetProjectQueryKey(id),
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/projects/public/${id}`);
      if (!res.ok) return undefined;
      const data = await parseJsonSafe(res);
      return data?.project ? mapProject(data.project) : undefined;
    },
    enabled: (options?.query?.enabled ?? true) && Boolean(id),
  });
}

/**
 * Fetches the overview stats shown on the Home page. These figures are
 * curated marketing copy (not derived from a single MongoDB collection),
 * so they remain static here — update them directly as the company grows.
 */
export function useGetOverviewStats() {
  const stats: OverviewStats = {
    completedProjects: "120+",
    engineersAvailable: "350+",
    citiesCovered: "24",
    yearsExperience: "15+",
  };
  return useQuery<OverviewStats>({
    queryKey: ["overview-stats"],
    queryFn: async () => stats,
    staleTime: Infinity,
    initialData: stats,
  });
}

/**
 * Fetches featured projects from MongoDB via GET /api/projects/public?featured=true.
 * Powers the Home page's "Featured Projects" section.
 */
export function useGetFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/projects/public?featured=true`);
      if (!res.ok) throw new Error("Failed to load featured projects");
      const data = await parseJsonSafe(res);
      return (data?.projects ?? []).map(mapProject);
    },
    staleTime: 60_000,
  });
}

/**
 * Fetches the full project list (optionally filtered by category) from
 * MongoDB via GET /api/projects/public. Powers the Projects page.
 */
export function useListProjects(filters?: { category?: string }) {
  return useQuery<Project[]>({
    queryKey: ["projects", filters?.category ?? "All"],
    queryFn: async () => {
      const qs = filters?.category && filters.category !== "All" ? `?category=${encodeURIComponent(filters.category)}` : "";
      const res = await fetch(`${API_BASE_URL}/api/projects/public${qs}`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await parseJsonSafe(res);
      return (data?.projects ?? []).map(mapProject);
    },
    staleTime: 60_000,
  });
}

export function useListServices() {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => services,
    staleTime: Infinity,
    initialData: services,
  });
}

export function useListEngineers() {
  return useQuery<Engineer[]>({
    queryKey: ["engineers"],
    queryFn: async () => engineers,
    staleTime: Infinity,
    initialData: engineers,
  });
}

export function useGetEngineer(id: number, options?: { query?: { enabled?: boolean; queryKey?: QueryKey } }) {
  return useQuery<Engineer | undefined>({
    queryKey: options?.query?.queryKey ?? getGetEngineerQueryKey(id),
    queryFn: async () => engineers.find((engineer) => engineer.id === id),
    enabled: options?.query?.enabled ?? true,
    initialData: engineers.find((engineer) => engineer.id === id),
  });
}

export function useGetEngineerCities() {
  return useQuery<string[]>({
    queryKey: ["engineer-cities"],
    queryFn: async () => {
      return Array.from(new Set(engineers.map((engineer) => engineer.city)));
    },
    staleTime: Infinity,
    initialData: Array.from(new Set(engineers.map((engineer) => engineer.city))),
  });
}

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (payload: { data: unknown }) => {
      return payload;
    },
  });
}

/**
 * Shape submitted by the public "Project Inquiry" form on the Contact page.
 * Matches the backend Enquiry schema field-for-field.
 */
export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  location: string;
  message: string;
};

/**
 * Submits a project enquiry to MongoDB via POST /api/enquiries.
 * This used to be a no-op mock — it now performs a real, validated API
 * call and surfaces backend validation errors back to the form.
 */
export function useCreateInquiry() {
  return useMutation({
    mutationFn: async (payload: { data: InquiryPayload }) => {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });
      const result = await parseJsonSafe(res);
      if (!res.ok) {
        const err: any = new Error(result?.message || "Failed to submit inquiry");
        err.fieldErrors = result?.errors;
        throw err;
      }
      return result;
    },
  });
}
