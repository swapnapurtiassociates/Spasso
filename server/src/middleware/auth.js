import { verifyToken, clearAuthCookie, COOKIE_NAME, INACTIVITY_TIMEOUT_MS } from "../config/jwt.js";
import { User } from "../models/User.js";

/**
 * Reads the JWT from either the httpOnly cookie or the Authorization header,
 * verifies it, loads the user, and attaches it to req.user.
 *
 * Also enforces:
 * - Single active session: the token's `sid` must match the user's
 *   `activeSessionId`. Logging in elsewhere invalidates older sessions.
 * - 30-minute inactivity timeout: if `lastActivity` is older than
 *   INACTIVITY_TIMEOUT_MS, the session is expired and the user must log in
 *   again. On every successful authenticated request, `lastActivity` is
 *   refreshed (sliding expiration).
 */
export async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.slice(7);
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Account not found or disabled" });
    }

    // Single active session check
    if (payload.sid && user.activeSessionId && payload.sid !== user.activeSessionId) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Session ended: account signed in elsewhere" });
    }

    // Inactivity timeout check
    if (user.lastActivity) {
      const idleMs = Date.now() - new Date(user.lastActivity).getTime();
      if (idleMs > INACTIVITY_TIMEOUT_MS) {
        user.activeSessionId = null;
        await user.save();
        clearAuthCookie(res);
        return res.status(401).json({ message: "Session expired due to inactivity" });
      }
    }

    // Refresh sliding activity timestamp (best-effort, non-blocking)
    User.findByIdAndUpdate(user._id, { lastActivity: new Date() }).catch(() => {});

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

/**
 * Restricts a route to one or more roles.
 * Usage: requireRole("admin", "ceo")
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}
