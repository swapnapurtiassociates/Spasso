import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, type AuthUser } from "@workspace/replit-auth-web";

export type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  location: string;
  message: string;
  status: "New" | "Contacted" | "In Progress" | "Closed";
  createdAt: string;
  updatedAt: string;
};

export type EnquiryFilters = {
  search?: string;
  status?: string;
  projectType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type EnquiryPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type StatusCounts = Record<string, number>;

export function useEnquiries(user: AuthUser | null, filters: EnquiryFilters = {}) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<EnquiryPagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.projectType) params.set("projectType", filters.projectType);
      if (filters.sortBy) params.set("sortBy", filters.sortBy);
      if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));

      const res = await fetch(`${API_BASE_URL}/api/enquiries?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      const data = await res.json();
      setEnquiries(data.enquiries || []);
      if (data.pagination) setPagination(data.pagination);
      if (data.statusCounts) setStatusCounts(data.statusCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters.search, filters.status, filters.projectType, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateEnquiry = async (id: string, updates: Partial<Enquiry>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) return false;
      await fetchEnquiries();
      return true;
    } catch {
      return false;
    }
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return false;
      await fetchEnquiries();
      return true;
    } catch {
      return false;
    }
  };

  return { enquiries, pagination, statusCounts, loading, error, refetch: fetchEnquiries, updateEnquiry, deleteEnquiry };
}
