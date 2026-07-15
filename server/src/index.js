/**
 * index.js — Server entry point
 *
 * IMPORTANT: dotenv MUST be loaded before any other local imports
 * because ES module imports are hoisted. We use a separate loader
 * file (env.js) that is imported first to guarantee env vars are set
 * before db.js, transporter.js etc. read process.env.
 */

// ── Step 1: Load environment variables FIRST ──────────────────────
// This import runs before all others, ensuring process.env is populated
// before db.js, transporter.js, and any other module reads from it.
import "./config/env.js";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/index.js";
import { verifyEmailConnection } from "./utils/email/transporter.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import messageRoutes from "./routes/messages.js";
import notificationRoutes from "./routes/notifications.js";
import enquiryRoutes from "./routes/enquiries.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/enquiries", enquiryRoutes);

// 404 + error handlers
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  initSocket(httpServer, app);
  await verifyEmailConnection();

  httpServer.listen(PORT, () => {
    console.log(`[server] ✅ Running on http://localhost:${PORT}`);
  });
}

start();
