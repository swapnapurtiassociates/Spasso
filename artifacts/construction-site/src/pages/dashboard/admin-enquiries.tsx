import { DashboardShell, useDashboardGuard } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnquiries, type Enquiry } from "@/hooks/use-enquiries";
import { ChevronLeft, ChevronRight, Eye, Loader2, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
  Closed: "bg-green-100 text-green-800 border-green-200",
};

const STATUSES = ["New", "Contacted", "In Progress", "Closed"];
const PROJECT_TYPES = ["Residential", "Commercial", "Infrastructure", "Industrial", "Mixed-Use", "Other"];

export default function AdminEnquiries() {
  const { user, ready } = useDashboardGuard("admin");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectTypeFilter, setProjectTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { enquiries, pagination, statusCounts, loading, updateEnquiry, deleteEnquiry } = useEnquiries(ready ? user : null, {
    search: debouncedSearch,
    status: statusFilter,
    projectType: projectTypeFilter,
    sortBy,
    sortOrder,
    page,
    limit: 15,
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setDebouncedSearch(search);
      setPage(1);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setActionLoading(true);
    await updateEnquiry(id, { status: status as Enquiry["status"] });
    if (selected && selected._id === id) setSelected((prev) => prev ? { ...prev, status: status as Enquiry["status"] } : prev);
    setActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    await deleteEnquiry(id);
    setConfirmDelete(null);
    if (selected?._id === id) setSelected(null);
    setActionLoading(false);
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const sortIcon = (col: string) =>
    sortBy === col ? (sortOrder === "asc" ? " ↑" : " ↓") : "";

  const totalNew = statusCounts["New"] ?? 0;

  return (
    <DashboardShell user={user!} title="Enquiry Management" subtitle={String(pagination.total) + " total enquir" + (pagination.total !== 1 ? "ies" : "y") + (totalNew > 0 ? " · " + String(totalNew) + " new" : "")}>
      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            className="pl-9"
            placeholder="Search name, email, company… (Enter)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s} {statusCounts[s] ? `(${statusCounts[s]})` : ""}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={projectTypeFilter || "all"} onValueChange={(v) => { setProjectTypeFilter(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PROJECT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(debouncedSearch || statusFilter || projectTypeFilter) && (
          <Button variant="ghost" onClick={() => { setSearch(""); setDebouncedSearch(""); setStatusFilter(""); setProjectTypeFilter(""); setPage(1); }}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>Name{sortIcon("name")}</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("projectType")}>Type{sortIcon("projectType")}</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("status")}>Status{sortIcon("status")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>Received{sortIcon("createdAt")}</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                  Loading enquiries…
                </TableCell>
              </TableRow>
            ) : enquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  No enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              enquiries.map((enq) => (
                <TableRow key={enq._id} className="group">
                  <TableCell className="font-medium">
                    <div>{enq.name}</div>
                    {enq.company && <div className="text-xs text-muted-foreground">{enq.company}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{enq.email}</div>
                    <div className="text-xs text-muted-foreground">{enq.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{enq.projectType}</div>
                    {enq.location && <div className="text-xs text-muted-foreground">{enq.location}</div>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{enq.budgetRange || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={enq.status}
                      onValueChange={(v) => handleStatusUpdate(enq._id, v)}
                    >
                      <SelectTrigger className={`h-7 text-xs border rounded px-2 w-[120px] ${STATUS_COLORS[enq.status] ?? ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(enq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="View details" onClick={() => setSelected(enq)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" className="text-destructive hover:text-destructive" onClick={() => setConfirmDelete(enq._id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>Page {pagination.page} of {pagination.pages} ({pagination.total} records)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry from {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Email</span><p>{selected.email}</p></div>
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Phone</span><p>{selected.phone}</p></div>
                {selected.company && (
                  <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Company</span><p>{selected.company}</p></div>
                )}
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Location</span><p>{selected.location}</p></div>
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Project Type</span><p>{selected.projectType}</p></div>
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Budget</span><p>{selected.budgetRange || "Not specified"}</p></div>
                <div>
                  <span className="text-muted-foreground uppercase text-xs tracking-wide">Status</span>
                  <div className="mt-1">
                    <Badge className={`${STATUS_COLORS[selected.status]} border`}>{selected.status}</Badge>
                  </div>
                </div>
                <div><span className="text-muted-foreground uppercase text-xs tracking-wide">Received</span><p>{new Date(selected.createdAt).toLocaleString("en-IN")}</p></div>
              </div>
              <div>
                <span className="text-muted-foreground uppercase text-xs tracking-wide">Message</span>
                <p className="mt-1 whitespace-pre-wrap bg-muted p-3 rounded text-sm">{selected.message}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Select value={selected.status} onValueChange={(v) => handleStatusUpdate(selected._id, v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="destructive" onClick={() => setConfirmDelete(selected._id)}>
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Enquiry?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The enquiry will be permanently removed.</p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              className="flex-1"
              disabled={actionLoading}
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
              {actionLoading ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
