/**
 * transporter.js
 * Nodemailer SMTP transporter singleton.
 *
 * NOTE: This file is imported AFTER env.js runs, so process.env is
 * guaranteed to be populated when this module is evaluated.
 */

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const port = parseInt(process.env.SMTP_PORT || "587", 10);
const secure = process.env.SMTP_SECURE === "true";

let transporter;

if (!host || !user || !pass || user === "your-email@gmail.com") {
  // No real credentials — log to console instead of sending
  console.warn(
    "[email/transporter] ⚠️  SMTP not configured — emails will be logged to console only.\n" +
    "  Edit your .env: set SMTP_HOST, SMTP_USER, SMTP_PASS"
  );
  transporter = {
    verify: null,
    sendMail: async (opts) => {
      console.log("\n[email/DEV-STUB] ─────────────────────────────────────");
      console.log("  To      :", opts.to);
      console.log("  Subject :", opts.subject);
      console.log("  (SMTP not configured — email not actually sent)");
      console.log("──────────────────────────────────────────────────────\n");
      return { messageId: `stub-${Date.now()}` };
    },
  };
} else {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,   // false for port 587 (STARTTLS), true for port 465 (SSL)
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    // Required for Gmail App Passwords
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log(`[email/transporter] SMTP configured: ${user} via ${host}:${port}`);
}

/**
 * Verify SMTP connection — called once at server startup.
 * Non-fatal: server runs even if this fails.
 */
export async function verifyEmailConnection() {
  if (typeof transporter.verify !== "function") {
    console.log("[email/transporter] ℹ️  Running in stub/dev mode — no real emails will be sent");
    return;
  }
  try {
    await transporter.verify();
    console.log("[email/transporter] ✅ SMTP connection verified — emails are live");
  } catch (err) {
    console.warn(
      "[email/transporter] ❌ SMTP connection FAILED:", err.message,
      "\n  Common fixes:",
      "\n    • Gmail: use an App Password (not your account password)",
      "\n    • Gmail: go to https://myaccount.google.com/apppasswords",
      "\n    • Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your .env"
    );
  }
}

export default transporter;
