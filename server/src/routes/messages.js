import { Router } from "express";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/messages/:userId
 * Get the conversation thread between the current user and :userId.
 */
router.get("/:userId", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  }).sort({ createdAt: 1 });

  res.json({ messages });
});

/**
 * POST /api/messages
 * Send a message. Persists to MongoDB and emits in real time via Socket.io.
 */
router.post("/", requireAuth, async (req, res) => {
  const { receiver, text, project } = req.body;
  if (!receiver || !text) {
    return res.status(400).json({ message: "receiver and text are required" });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    project: project || null,
    text,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(`user:${receiver}`).emit("message:new", message);
    io.to(`user:${req.user._id}`).emit("message:new", message);
  }

  const notification = await Notification.create({
    recipient: receiver,
    title: `New message from ${req.user.firstName}`,
    body: text.slice(0, 100),
    type: "info",
    link: "/dashboard/messages",
  });
  if (io) io.to(`user:${receiver}`).emit("notification:new", notification);

  res.status(201).json({ message });
});

export default router;
