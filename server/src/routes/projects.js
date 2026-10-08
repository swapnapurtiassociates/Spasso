import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";
import { Project } from "../models/Project.js";

const router = Router();

const PUBLIC_PROJECT_FIELDS =
  "title category description shortDescription city state location status clientName projectValue areaCovered keyFeatures startDate completionDate completionYear tags imageUrl images featured progress published createdAt";
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.mimetype)) {
      callback(new Error("Upload a JPEG, PNG, WebP, or AVIF image"));
      return;
    }
    callback(null, true);
  },
});

/**
 * GET /api/projects/public
 * Public, no auth required — powers the marketing Projects page and the
 * Home page's Featured Projects section.
 * Query params: category, status, featured=true
 */
router.get("/public", async (req, res) => {
  try {
    const filter = { published: { $ne: false } };
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
    const project = await Project.findOne({
      _id: req.params.id,
      published: { $ne: false },
    }).select(PUBLIC_PROJECT_FIELDS);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ project });
  } catch (err) {
    res.status(404).json({ message: "Project not found" });
  }
});

/**
 * POST /api/projects/images
 * Admin-only image upload stored in MongoDB GridFS for persistent deployments.
 */
router.post("/images", requireAuth, requireRole("admin"), (req, res, next) => {
  imageUpload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || "Image upload failed" });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Choose an image to upload" });
  if (!mongoose.connection.db)
    return res.status(503).json({ message: "Image storage is unavailable" });

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "projectImages" });
    const fileId = new mongoose.Types.ObjectId();
    const uploadStream = bucket.openUploadStreamWithId(fileId, req.file.originalname, {
      metadata: {
        contentType: req.file.mimetype,
        uploadedBy: req.user._id.toString(),
      },
    });
    uploadStream.end(req.file.buffer);
    await new Promise((resolve, reject) => {
      uploadStream.once("finish", resolve);
      uploadStream.once("error", reject);
    });
    res.status(201).json({ url: `/api/projects/images/${fileId}` });
  } catch (err) {
    console.error("[projects/images/upload]", err);
    res.status(500).json({ message: "Image could not be stored" });
  }
});

router.get("/images/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.connection.db)
    return res.status(404).json({ message: "Image not found" });

  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "projectImages" });
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const [file] = await bucket.find({ _id: fileId }).limit(1).toArray();
    if (!file) return res.status(404).json({ message: "Image not found" });
    res.set({
      "Content-Type": file.metadata?.contentType || "application/octet-stream",
      "Content-Length": String(file.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on("error", (err) => {
      console.error("[projects/images/read]", err);
      if (!res.headersSent) res.status(404).json({ message: "Image not found" });
      else res.destroy(err);
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error("[projects/images/read]", err);
    if (!res.headersSent) res.status(500).json({ message: "Image could not be loaded" });
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
router.post("/", requireAuth, async (req, res) => {
  try {
    const isAdminLike = ["admin", "ceo"].includes(req.user.role);
    const isCustomer = req.user.role === "customer";

    if (!isAdminLike && !isCustomer) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const projectFields = [
      "title", "category", "description", "shortDescription", "city", "state",
      "location", "status", "clientName", "projectValue", "completionYear",
      "progress", "tags", "imageUrl", "areaCovered", "keyFeatures", "startDate",
      "completionDate", "featured", "customer",
    ];
    const projectData = Object.fromEntries(
      projectFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );

    if (isCustomer) {
      projectData.customer = req.user._id;
      projectData.clientName = projectData.clientName || `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim() || req.user.email;
      projectData.progress = Number(projectData.progress ?? 0);
      projectData.status = projectData.status || "Planned";
    }

    const project = await Project.create({
      ...projectData,
      published: false,
      createdBy: req.user._id,
    });

    const io = req.app.get("io");
    if (io) io.to("role:admin").to("role:ceo").to("role:engineer").emit("project:created", project);
    if (project.customer) {
      if (io) io.to(`user:${project.customer}`).emit("project:created", project);
    }

    res.status(201).json({ project });
  } catch (err) {
    console.error("[projects/create]", err);
    res.status(400).json({ message: "Project could not be created" });
  }
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
  const isAdminLike = ["admin", "ceo"].includes(req.user.role);
  const editableFields = isAdminLike
    ? [
        "title", "category", "description", "shortDescription", "city", "state",
        "location", "status", "clientName", "projectValue", "completionYear",
        "progress", "tags", "imageUrl", "areaCovered", "keyFeatures", "startDate",
        "completionDate", "featured", "images", "published",
      ]
    : ["progress", "status"];

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      project[field] = req.body[field];
    }
  }
  await project.save();

  const io = req.app.get("io");
  if (io) io.to("role:admin").to("role:ceo").to("role:engineer").emit("project:updated", project);
  if (project.customer) {
    if (io) io.to(`user:${project.customer}`).emit("project:updated", project);

    if (req.body.progress !== undefined) {
      const notification = await Notification.create({
        recipient: project.customer,
        title: `Project "${project.title}" progress updated`,
        body: `New progress: ${project.progress}%`,
        type: "info",
        link: `/dashboard/projects/${project._id}`,
      });
      if (io) io.to(`user:${project.customer}`).emit("notification:new", notification);
    }
  }

  res.json({ project });
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const imageUrls = new Set([
      project.imageUrl,
      ...(project.images || []).map((image) => image.url),
    ].filter(Boolean));
    const imageIds = [...imageUrls]
      .map((url) => url.match(/^\/api\/projects\/images\/([a-f\d]{24})$/i)?.[1])
      .filter(Boolean);

    let imageCleanupWarning;
    if (imageIds.length && mongoose.connection.db) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "projectImages" });
      const results = await Promise.allSettled(
        imageIds.map((id) => bucket.delete(new mongoose.Types.ObjectId(id))),
      );
      const failures = results.filter(
        (result) => result.status === "rejected" && result.reason?.code !== 26,
      );
      if (failures.length) {
        console.error("[projects/delete/images]", failures.map((result) => result.reason));
        imageCleanupWarning = "Project deleted, but one or more stored images could not be removed.";
      }
    }

    const io = req.app.get("io");
    if (io) io.to("role:admin").to("role:ceo").to("role:engineer").emit("project:deleted", project._id.toString());

    res.json({ message: "Project deleted", imageCleanupWarning });
  } catch (err) {
    console.error("[projects/delete]", err);
    res.status(500).json({ message: "Project could not be deleted" });
  }
});

export default router;
