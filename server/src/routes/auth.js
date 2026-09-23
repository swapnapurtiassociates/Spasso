import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/User.js";
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  generateSessionId,
} from "../config/jwt.js";
import { requireAuth } from "../middleware/auth.js";
import { validateEmail, validatePassword, validatePhone, validateCountryCode } from "../utils/validation.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { sendPasswordResetEmail } from "../utils/email/emailService.js";
import { sendVerificationCode } from "../utils/email/emailService.js";

const router = Router();

const CEO_ACCESS_CODE = process.env.CEO_ACCESS_CODE;
const STAFF_ACCESS_CODE = process.env.STAFF_ACCESS_CODE;

if (!CEO_ACCESS_CODE || !STAFF_ACCESS_CODE) {
  throw new Error("CEO_ACCESS_CODE and STAFF_ACCESS_CODE must be configured");
}

const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many authentication attempts. Please try again later." });
const resetRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many password reset requests. Please try again later." });
const verificationRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: "Too many verification attempts. Please try again later." });

function createVerificationChallenge() {
  const challenge = crypto.randomBytes(32).toString("hex");
  return { challenge, hash: crypto.createHash("sha256").update(challenge).digest("hex") };
}

async function issueVerification(user, channel) {
  const code = String(crypto.randomInt(100000, 1000000));
  const { challenge, hash } = createVerificationChallenge();
  user.verificationCodeHash = crypto.createHash("sha256").update(code).digest("hex");
  user.verificationChallengeHash = hash;
  user.verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.verificationAttempts = 0;
  user.verificationChannel = channel;
  await user.save();
  const delivery = await sendVerificationCode({ user, code, channel });
  if (!delivery.success) throw delivery.error;
  return { challenge, channel, destination: channel === "email" ? user.email : `${user.countryCode || "+91"}${user.phone}` };
}

function verificationResponse(challenge) {
  return { requiresVerification: true, verification: challenge };
}

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
      role = "customer", channel = "email",
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

    if (role !== "customer") return res.status(403).json({ message: "Only user accounts can sign up" });

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

    if (!['email', 'phone'].includes(channel)) return res.status(400).json({ message: "Invalid verification channel" });
    const verification = await issueVerification(user, channel);
    res.status(201).json(verificationResponse(verification));
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
router.post("/login", authRateLimit, async (req, res) => {
  try {
    const { identifier, email, password, role = "customer", channel = "email" } = req.body;
    const loginIdentifier = String(identifier || email || "").trim();
    if (!loginIdentifier || !password) return res.status(400).json({ message: "Email/mobile number and password are required" });
    if (!['customer', 'admin', 'engineer'].includes(role)) return res.status(400).json({ message: "Invalid login role" });
    if (!['email', 'phone'].includes(channel)) return res.status(400).json({ message: "Invalid verification channel" });

    const lookup = loginIdentifier.includes("@")
      ? { email: loginIdentifier.toLowerCase() }
      : { phone: loginIdentifier.replace(/\D/g, "") };
    const user = await User.findOne({ ...lookup, role });
    if (!user || !user.isActive)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.role === "ceo")
      return res.status(403).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    if (channel === "phone" && !user.phone) return res.status(400).json({ message: "No mobile number is registered for this account" });
    const verification = await issueVerification(user, channel);
    res.json(verificationResponse(verification));
  } catch (err) {
    console.error("[auth/login]", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// POST /api/auth/ceo-login
router.post("/ceo-login", authRateLimit, async (req, res) => {
  try {
    const { email, password, accessCode, channel = "email" } = req.body;
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

    if (!['email', 'phone'].includes(channel)) return res.status(400).json({ message: "Invalid verification channel" });
    if (channel === "phone" && !user.phone) return res.status(400).json({ message: "No mobile number is registered for this account" });
    const verification = await issueVerification(user, channel);
    res.json(verificationResponse(verification));
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

router.post("/verify", verificationRateLimit, async (req, res) => {
  try {
    const challenge = String(req.body?.challenge || "");
    const code = String(req.body?.code || "").trim();
    if (!challenge || !/^\d{6}$/.test(code)) return res.status(400).json({ message: "A valid 6-digit verification code is required" });
    const challengeHash = crypto.createHash("sha256").update(challenge).digest("hex");
    const user = await User.findOne({ verificationChallengeHash: challengeHash, isActive: true }).select("+verificationCodeHash +verificationChallengeHash +verificationCodeExpiresAt +verificationAttempts +verificationChannel");
    if (!user || !user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) return res.status(400).json({ message: "This verification request has expired" });
    if (user.verificationAttempts >= 5) return res.status(429).json({ message: "Too many incorrect verification attempts" });
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== user.verificationCodeHash) {
      user.verificationAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Incorrect verification code" });
    }
    user.verificationCodeHash = null;
    user.verificationChallengeHash = null;
    user.verificationCodeExpiresAt = null;
    user.verificationAttempts = 0;
    user.verificationChannel = null;
    await startSession(user, res);
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error("[auth/verify]", err);
    res.status(500).json({ message: "Unable to verify this code right now" });
  }
});

router.post("/resend-verification", verificationRateLimit, async (req, res) => {
  try {
    const challenge = String(req.body?.challenge || "");
    const channel = String(req.body?.channel || "email");
    if (!challenge || !['email', 'phone'].includes(channel)) return res.status(400).json({ message: "A valid verification request is required" });
    const challengeHash = crypto.createHash("sha256").update(challenge).digest("hex");
    const user = await User.findOne({ verificationChallengeHash: challengeHash, isActive: true }).select("+verificationChallengeHash +verificationCodeHash +verificationCodeExpiresAt +verificationAttempts +verificationChannel");
    if (!user) return res.status(400).json({ message: "This verification request has expired" });
    const verification = await issueVerification(user, channel);
    res.json(verificationResponse(verification));
  } catch (err) {
    console.error("[auth/resend-verification]", err);
    res.status(500).json({ message: "Unable to resend the verification code right now" });
  }
});

router.post("/forgot-password", resetRateLimit, async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) return res.status(400).json({ message: emailError });

  const user = await User.findOne({ email, isActive: true }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    await sendPasswordResetEmail(user, token);
  }

  res.json({ message: "If an account exists for that email, a reset link has been sent." });
});

router.post("/reset-password", resetRateLimit, async (req, res) => {
  const token = String(req.body?.token || "");
  const password = String(req.body?.password || "");
  const passwordError = validatePassword(password);
  if (!token || passwordError) return res.status(400).json({ message: passwordError || "Reset token is required" });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
    isActive: true,
  }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");
  if (!user) return res.status(400).json({ message: "This reset link is invalid or has expired" });

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  user.activeSessionId = null;
  await user.save();
  clearAuthCookie(res);
  res.json({ message: "Password updated successfully. Please sign in again." });
});

export default router;
