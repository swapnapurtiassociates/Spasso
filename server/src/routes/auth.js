import { Router } from "express";
import bcrypt from "bcryptjs";
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

    const allowedRoles = ["customer", "engineer", "admin"];
    if (!allowedRoles.includes(role))
      return res.status(403).json({ message: "Invalid role for signup" });

    if ((role === "engineer" || role === "admin") && staffAccessCode !== STAFF_ACCESS_CODE)
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
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.role === "ceo")
      return res.status(403).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    await startSession(user, res);
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ message: "Server error during login" });
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
