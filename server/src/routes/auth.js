import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  generateSessionId,
} from "../config/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { validatePassword, validatePhone, validateCountryCode } from "../utils/validation.js";

const router = Router();

const CEO_ACCESS_CODE = process.env.CEO_ACCESS_CODE || "change_this_secret_ceo_code";
const STAFF_ACCESS_CODE = process.env.STAFF_ACCESS_CODE || "change_this_staff_code";
const googleOAuthClient = new OAuth2Client();

async function startSession(user, res) {
  const sessionId = generateSessionId();
  user.activeSessionId = sessionId;
  user.lastActivity = new Date();
  user.lastLogin = new Date();
  await user.save();
  const token = signToken(user, sessionId);
  setAuthCookie(res, token);
  return token;
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      countryCode = "+91", password,
      role = "customer", staffAccessCode,
      specialization, experience, city, state,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !phone)
      return res.status(400).json({ message: "firstName, lastName, email, phone and password are required" });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const phoneError = validatePhone(phone);
    if (phoneError) return res.status(400).json({ message: phoneError });

    const ccError = validateCountryCode(countryCode);
    if (ccError) return res.status(400).json({ message: ccError });

    const allowedRoles = ["customer", "engineer"];
    if (!allowedRoles.includes(role))
      return res.status(403).json({ message: "Only customer accounts can be created through signup" });

    if (role === "engineer" && staffAccessCode !== STAFF_ACCESS_CODE)
      return res.status(403).json({ message: "Invalid staff access code for this role" });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "An account with this email already exists" });

    if (await User.findOne({ phone }))
      return res.status(409).json({ message: "This phone number is already registered with another account" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email: email.toLowerCase(),
      phone, countryCode, passwordHash, role,
      specialization: role === "engineer" ? specialization : undefined,
      experience: role === "engineer" ? experience : undefined,
      city, state,
    });

    await startSession(user, res);
    res.status(201).json({ user: user.toJSON() });
  } catch (err) {
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `This ${field} is already registered` });
    }
    console.error("[auth/signup]", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role: requestedRole } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.role === "ceo")
      return res.status(403).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    if (requestedRole && user.role !== requestedRole)
      return res.status(403).json({ message: "Use the sign-in option for your account type" });

    if (user.role === "admin" &&
        (!process.env.ADMIN_EMAIL || normalizedEmail !== process.env.ADMIN_EMAIL.toLowerCase().trim()))
      return res.status(401).json({ message: "Invalid email or password" });

    await startSession(user, res);
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// POST /api/auth/google — customer sign-in / account creation with Google.
router.post("/google", async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const { credential } = req.body;

    if (!clientId)
      return res.status(503).json({ message: "Google sign-in is not configured" });
    if (typeof credential !== "string" || !credential)
      return res.status(400).json({ message: "Google credential is required" });

    let payload;
    try {
      const ticket = await googleOAuthClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ message: "Invalid Google sign-in credential" });
    }

    if (!payload?.email || payload.email_verified !== true)
      return res.status(401).json({ message: "A verified Google email is required" });

    const email = payload.email.toLowerCase().trim();
    let user = await User.findOne({ email });

    if (user && user.role !== "customer")
      return res.status(403).json({ message: "Google sign-in is available for customer accounts only" });
    if (user && !user.isActive)
      return res.status(401).json({ message: "This account is disabled" });

    if (!user) {
      const nameParts = (payload.name || email.split("@")[0]).trim().split(/\s+/);
      const firstName = payload.given_name || nameParts[0] || "Customer";
      const lastName = payload.family_name || nameParts.slice(1).join(" ") || "Customer";
      user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
        role: "customer",
        profileImageUrl: payload.picture || "",
      });
    }

    await startSession(user, res);
    res.json({ user: user.toJSON() });
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: "An account with this Google email already exists. Please try again." });
    console.error("[auth/google]", err);
    res.status(500).json({ message: "Server error during Google sign-in" });
  }
});

// POST /api/auth/ceo-login
router.post("/ceo-login", async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;
    if (!email || !password || !accessCode)
      return res.status(400).json({ message: "Email, password and access code are required" });

    if (accessCode !== CEO_ACCESS_CODE)
      return res.status(403).json({ message: "Invalid credentials" });

    const user = await User.findOne({ email: email.toLowerCase(), role: "ceo" });
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    await startSession(user, res);
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error("[auth/ceo-login]", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req, res) => {
  try {
    req.user.activeSessionId = null;
    await req.user.save();
  } catch (err) {
    console.error("[auth/logout]", err);
  }
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toJSON() });
});

export default router;
