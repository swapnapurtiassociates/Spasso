import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Inactivity timeout: session is invalidated if no authenticated request
// is made within this window.
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

export function signToken(user, sessionId) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      sid: sessionId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export const COOKIE_NAME = "sa_token";

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // The cookie itself can live as long as JWT_EXPIRES_IN; actual session
    // validity is enforced server-side via lastActivity + activeSessionId.
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME);
}
