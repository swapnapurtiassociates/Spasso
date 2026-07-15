import { Router } from "express";
import { Project } from "../models/Project.js";
import { Notification } from "../models/Notification.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const PUBLIC_PROJECT_FIELDS =
  "title category description city state location status clientName projectValue areaCovered keyFeatures startDate completionDate completionYear tags imageUrl featured createdAt";

/**
 * GET /api/projects/public
 * Public, no auth required — powers the marketing Projects page and the
 * Home page's Featured Projects section.
 * Query params: category, status, featured=true
 */
router.get("/public", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.status && req.query.status !== "All") filter.status = req.query.status;
    if (req.query.featured === "true") filter.featured = true;

    const projects = await Project.find(filter)
      .select(PUBLIC_PROJECT_FIELDS)
      .sort({ featured: -1, createdAt: -1 });

    res.json({ projects });
  } catch (err) {
    console.error("[projects/public/list]", err);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
});

/**
 * GET /api/projects/public/:id
 * Public, no auth required — powers the marketing Project Detail page.
 */
router.get("/public/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).select(PUBLIC_PROJECT_FIELDS);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ project });
  } catch (err) {
    res.status(404).json({ message: "Project not found" });
  }
});

/**
 * GET /api/projects
 * - customer: only their own projects
 * - engineer: only projects they are assigned to
 * - admin/ceo: all projects
 */
router.get("/", requireAuth, async (req, res) => {
  let filter = {};
  if (req.user.role === "customer") filter = { customer: req.user._id };
  if (req.user.role === "engineer") filter = { assignedEngineers: req.user._id };

  const projects = await Project.find(filter)
    .populate("customer", "firstName lastName email")
    .populate("assignedEngineers", "firstName lastName email specialization")
    .sort({ createdAt: -1 });

  res.json({ projects });
});

/**
 * POST /api/projects
 * Admin/CEO only: create a new project.
 */
router.post("/", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  const project = await Project.create({ ...req.body, createdBy: req.user._id });

  // Real-time: notify everyone in the admin/ceo/engineer rooms
  const io = req.app.get("io");
  io.to("role:admin").to("role:ceo").to("role:engineer").emit("project:created", project);

  res.status(201).json({ project });
});

/**
 * PATCH /api/projects/:id
 * Admin/CEO/assigned engineer can update; emits real-time progress updates.
 */
router.patch("/:id", requireAuth, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const isAssignedEngineer =
    req.user.role === "engineer" &&
    project.assignedEngineers.some((id) => id.equals(req.user._id));

  if (!["admin", "ceo"].includes(req.user.role) && !isAssignedEngineer) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(project, req.body);
  await project.save();

  const io = req.app.get("io");
  io.to("role:admin").to("role:ceo").to("role:engineer").emit("project:updated", project);
  if (project.customer) {
    io.to(`user:${project.customer}`).emit("project:updated", project);

    if (req.body.progress !== undefined) {
      const notification = await Notification.create({
        recipient: project.customer,
        title: `Project "${project.title}" progress updated`,
        body: `New progress: ${project.progress}%`,
        type: "info",
        link: `/dashboard/projects/${project._id}`,
      });
      io.to(`user:${project.customer}`).emit("notification:new", notification);
    }
  }

  res.json({ project });
});

export default router;
