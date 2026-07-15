import { Router } from "express";
import { Enquiry } from "../models/Enquiry.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateEmail, validateEnquiryPhone } from "../utils/validation.js";
import { sendEnquiryEmails } from "../utils/email/emailService.js";

const router = Router();

const PROJECT_TYPES = ["Residential", "Commercial", "Infrastructure", "Industrial", "Mixed-Use", "Other"];
const BUDGET_RANGES = ["", "< 10 Cr", "10-50 Cr", "50-100 Cr", "100-500 Cr", "> 500 Cr"];
const STATUS_VALUES = ["New", "Contacted", "In Progress", "Closed"];

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validates + normalizes an incoming enquiry payload.
 * Accepts a couple of alternate field names (fullName/companyName/budget/description)
 * so the frontend form and any future API consumers stay flexible.
 */
function validateEnquiryPayload(body = {}) {
  const errors = {};

  const name = String(body.name ?? body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const company = String(body.company ?? body.companyName ?? "").trim();
  const projectType = String(body.projectType ?? "").trim();
  const budgetRange = String(body.budgetRange ?? body.budget ?? "").trim();
  const location = String(body.location ?? "").trim();
  const message = String(body.message ?? body.description ?? "").trim();

  if (!name || name.length < 2) errors.name = "Full name must be at least 2 characters";
  else if (name.length > 100) errors.name = "Full name must be under 100 characters";

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const phoneError = validateEnquiryPhone(phone);
  if (phoneError) errors.phone = phoneError;

  if (company.length > 150) errors.company = "Company name must be under 150 characters";

  if (!projectType) errors.projectType = "Project type is required";
  else if (!PROJECT_TYPES.includes(projectType)) errors.projectType = "Invalid project type";

  if (budgetRange && !BUDGET_RANGES.includes(budgetRange)) errors.budgetRange = "Invalid budget range";

  if (!location || location.length < 2) errors.location = "Location is required";
  else if (location.length > 150) errors.location = "Location must be under 150 characters";

  if (!message || message.length < 10) errors.message = "Message must be at least 10 characters";
  else if (message.length > 2000) errors.message = "Message must be under 2000 characters";

  return {
    errors,
    value: { name, email: email.toLowerCase(), phone, company, projectType, budgetRange, location, message },
  };
}

/**
 * POST /api/enquiries
 * Public endpoint — anyone can submit a project enquiry, no auth required.
 * Frontend flow: Validation -> API Call -> Controller -> MongoDB Save -> Response.
 */
router.post("/", async (req, res) => {
  try {
    const { errors, value } = validateEnquiryPayload(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Please fix the highlighted fields", errors });
    }

    const enquiry = await Enquiry.create(value);

    // ── Email confirmation (best-effort, never blocks response) ──────────────
    // Fires user confirmation + admin notification in parallel.
    // Failures are logged but never break the HTTP response.
    sendEnquiryEmails(enquiry)
      .then(({ userEmail, adminEmail }) => {
        if (!userEmail.success)
          console.error('[enquiries/email] User confirmation failed:', userEmail.error?.message);
        if (!adminEmail.success)
          console.error('[enquiries/email] Admin notification failed:', adminEmail.error?.message);
      })
      .catch((err) => console.error('[enquiries/email] Unexpected error:', err));

    // Best-effort real-time + persisted notification to staff. Never let a
    // notification failure block the enquiry confirmation response.
    try {
      const staff = await User.find({ role: { $in: ["admin", "ceo"] }, isActive: true }).select("_id");
      if (staff.length > 0) {
        const notifications = await Notification.insertMany(
          staff.map((u) => ({
            recipient: u._id,
            title: "New project enquiry",
            body: `${enquiry.name} enquired about a ${enquiry.projectType} project in ${enquiry.location}`,
            type: "info",
            link: "/dashboard/admin/enquiries",
          }))
        );
        const io = req.app.get("io");
        if (io) {
          notifications.forEach((n) => io.to(`user:${n.recipient}`).emit("notification:new", n));
          io.to("role:admin").to("role:ceo").emit("enquiry:created", enquiry);
        }
      }
    } catch (notifyErr) {
      console.error("[enquiries/notify]", notifyErr);
    }

    res.status(201).json({ message: "Thank you! Your enquiry has been submitted successfully. A confirmation email has been sent to your inbox.", enquiry });
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    console.error("[enquiries/create]", err);
    res.status(500).json({ message: "Server error while submitting enquiry" });
  }
});

/**
 * GET /api/enquiries
 * Admin/CEO only. Supports search, status/projectType filters, sorting and pagination.
 * Query params: search, status, projectType, sortBy, sortOrder, page, limit
 */
router.get("/", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  try {
    const {
      search = "",
      status,
      projectType,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "20",
    } = req.query;

    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (projectType && projectType !== "All") filter.projectType = projectType;
    if (search && String(search).trim()) {
      const re = new RegExp(escapeRegex(String(search).trim()), "i");
      filter.$or = [{ name: re }, { email: re }, { phone: re }, { company: re }, { location: re }];
    }

    const allowedSortFields = ["createdAt", "name", "status", "projectType", "updatedAt"];
    const sortField = allowedSortFields.includes(String(sortBy)) ? String(sortBy) : "createdAt";
    const sortDir = sortOrder === "asc" ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [enquiries, total, statusCounts] = await Promise.all([
      Enquiry.find(filter)
        .sort({ [sortField]: sortDir })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Enquiry.countDocuments(filter),
      Enquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    res.json({
      enquiries,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.max(1, Math.ceil(total / limitNum)) },
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    });
  } catch (err) {
    console.error("[enquiries/list]", err);
    res.status(500).json({ message: "Server error while fetching enquiries" });
  }
});

/**
 * GET /api/enquiries/:id
 * Admin/CEO only.
 */
router.get("/:id", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ enquiry });
  } catch (err) {
    res.status(400).json({ message: "Invalid enquiry id" });
  }
});

/**
 * PUT /api/enquiries/:id
 * Admin/CEO only. Used primarily to change status, but allows correcting any field.
 */
router.put("/:id", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  try {
    const allowedFields = ["status", "name", "email", "phone", "company", "projectType", "budgetRange", "location", "message"];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.status && !STATUS_VALUES.includes(updates.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (updates.email) {
      const emailError = validateEmail(updates.email);
      if (emailError) return res.status(400).json({ message: emailError });
      updates.email = updates.email.toLowerCase();
    }
    if (updates.phone) {
      const phoneError = validateEnquiryPhone(updates.phone);
      if (phoneError) return res.status(400).json({ message: phoneError });
    }
    if (updates.projectType && !PROJECT_TYPES.includes(updates.projectType)) {
      return res.status(400).json({ message: "Invalid project type" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    res.json({ message: "Enquiry updated successfully", enquiry });
  } catch (err) {
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", errors: err.errors });
    }
    console.error("[enquiries/update]", err);
    res.status(400).json({ message: "Failed to update enquiry" });
  }
});

/**
 * DELETE /api/enquiries/:id
 * Admin/CEO only.
 */
router.delete("/:id", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete enquiry" });
  }
});

export default router;
