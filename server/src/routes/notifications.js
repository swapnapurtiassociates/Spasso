import { Router } from "express";
import { Notification } from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ notifications });
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Not found" });
  res.json({ notification });
});

export default router;
