import { Server } from "socket.io";
import { verifyToken, COOKIE_NAME } from "../config/jwt.js";
import { User } from "../models/User.js";

/**
 * Parses the auth cookie out of a raw cookie header string.
 */
function parseCookie(cookieHeader = "", name) {
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function initSocket(httpServer, app) {
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "*")
    .split(",")
    .map((o) => o.trim());

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      let token = socket.handshake.auth?.token;

      if (!token) {
        token = parseCookie(socket.handshake.headers.cookie, COOKIE_NAME);
      }

      if (!token) return next(new Error("Unauthorized"));

      const payload = verifyToken(token);
      const user = await User.findById(payload.sub);
      if (!user || !user.isActive) return next(new Error("Unauthorized"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    const { user } = socket;

    // Join personal + role rooms so the server can target updates precisely.
    socket.join(`user:${user._id}`);
    socket.join(`role:${user.role}`);

    await User.findByIdAndUpdate(user._id, { isOnline: true, socketId: socket.id });
    io.to("role:admin").to("role:ceo").emit("presence:update", {
      userId: user._id,
      online: true,
    });

    socket.on("typing", ({ to }) => {
      io.to(`user:${to}`).emit("typing", { from: user._id });
    });

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(user._id, { isOnline: false, socketId: null });
      io.to("role:admin").to("role:ceo").emit("presence:update", {
        userId: user._id,
        online: false,
      });
    });
  });

  app.set("io", io);
  return io;
}
