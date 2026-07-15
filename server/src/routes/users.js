import { Router } from "express";
import { User } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/users/engineers
 * Public-ish list of available engineers (used on the Engineers page).
 */
router.get("/engineers", async (req, res) => {
  const engineers = await User.find({ role: "engineer", isActive: true }).select(
    "firstName lastName email phone city state country specialization skills experience available profileImageUrl"
  );
  res.json({ engineers });
});

/**
 * GET /api/users
 * Admin/CEO: list all users, optional ?role= filter.
 */
router.get("/", requireAuth, requireRole("admin", "ceo"), async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).sort({ createdAt: -1 });
  res.json({ users });
});

/**
 * PATCH /api/users/:id/status
 * CEO only: activate/deactivate any account.
 */
router.patch("/:id/status", requireAuth, requireRole("ceo"), async (req, res) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: Boolean(isActive) },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: user.toJSON() });
});

/**
 * PATCH /api/users/me
 * Any authenticated user: update their own profile.
 */
router.patch("/me", requireAuth, async (req, res) => {
  const allowed = [
    "firstName",
    "lastName",
    "phone",
    "address",
    "city",
    "state",
    "country",
    "profileImageUrl",
    "specialization",
    "skills",
    "experience",
    "available",
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ user: user.toJSON() });
});

export default router;
