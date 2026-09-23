/**
 * emailService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Reusable email service layer.
 *
 * Exports:
 *   sendEnquiryConfirmation(enquiry)  — user-facing "thank you" email
 *   sendAdminNotification(enquiry)    — internal "new lead" alert to admin
 *   sendEnquiryEmails(enquiry)        — convenience: fires both in parallel
 *
 * Error philosophy:
 *   All functions ALWAYS resolve (never reject).  A failed email returns
 *   { success: false, error } so the calling route can log and continue
 *   without breaking the HTTP response to the user.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import transporter from "./transporter.js";
import {
  buildUserConfirmationEmail,
  buildAdminNotificationEmail,
} from "./templates.js";

/* Sender identity ─────────────────────────────────────────────────── */
const FROM_NAME    = process.env.COMPANY_NAME || "Swapnapurti Associates";
const FROM_ADDRESS = process.env.SMTP_FROM    || process.env.SMTP_USER || "noreply@swapnapurtiassociates.com";
const FROM         = `"${FROM_NAME}" <${FROM_ADDRESS}>`;

/* Admin recipient ─────────────────────────────────────────────────── */
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL  || process.env.SMTP_USER || "";
const WEBSITE_URL = process.env.CLIENT_ORIGIN || "http://localhost:5173";

/* ── Internal helper ─────────────────────────────────────────────── */

/**
 * Low-level send wrapper. Captures errors and always resolves.
 *
 * @param {object} mailOptions - Nodemailer mail options
 * @returns {Promise<{ success: boolean, messageId?: string, error?: Error }>}
 */
async function _send(mailOptions) {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[emailService] ✅ Sent "${mailOptions.subject}" to ${mailOptions.to}` +
      (info.messageId ? ` (id: ${info.messageId})` : "")
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `[emailService] ❌ Failed to send "${mailOptions.subject}" to ${mailOptions.to}:`,
      error.message
    );
    return { success: false, error };
  }
}

/* ── Public API ──────────────────────────────────────────────────── */

/**
 * Send a personalised "Thank You" confirmation email to the enquirer.
 *
 * @param {object} enquiry - Mongoose enquiry document (or plain object)
 * @returns {Promise<{ success: boolean, messageId?: string, error?: Error }>}
 */
export async function sendEnquiryConfirmation(enquiry) {
  if (!enquiry?.email) {
    console.warn("[emailService] sendEnquiryConfirmation: missing email address — skipped");
    return { success: false, error: new Error("Missing recipient email") };
  }

  const { subject, html, text } = buildUserConfirmationEmail(enquiry);

  return _send({
    from:    FROM,
    to:      enquiry.email,
    subject,
    html,
    text, // plain-text fallback for clients that block HTML
    // Helps email clients thread replies correctly
    headers: {
      "X-Entity-Ref-ID": String(enquiry._id || Date.now()),
    },
  });
}

/**
 * Send an internal "New Lead Received" notification to the admin inbox.
 *
 * @param {object} enquiry - Mongoose enquiry document (or plain object)
 * @returns {Promise<{ success: boolean, messageId?: string, error?: Error }>}
 */
export async function sendAdminNotification(enquiry) {
  if (!ADMIN_EMAIL) {
    console.warn(
      "[emailService] sendAdminNotification: ADMIN_EMAIL not set — skipped.\n" +
      "  Add ADMIN_EMAIL=you@company.com to your .env to enable admin alerts."
    );
    return { success: false, error: new Error("ADMIN_EMAIL not configured") };
  }

  const { subject, html, text } = buildAdminNotificationEmail(enquiry);

  return _send({
    from:     FROM,
    to:       ADMIN_EMAIL,
    subject,
    html,
    text,
    // Priority hint for email clients
    priority: "high",
    headers: {
      "X-Entity-Ref-ID": String(enquiry._id || Date.now()),
      "X-Lead-Source":   "Website Enquiry Form",
    },
  });
}

/**
 * Convenience wrapper — fires user confirmation AND admin notification
 * in parallel. Returns a combined result object.
 *
 * @param {object} enquiry
 * @returns {Promise<{
 *   userEmail:  { success: boolean, messageId?: string, error?: Error },
 *   adminEmail: { success: boolean, messageId?: string, error?: Error },
 * }>}
 */
export async function sendEnquiryEmails(enquiry) {
  const [userEmail, adminEmail] = await Promise.all([
    sendEnquiryConfirmation(enquiry),
    sendAdminNotification(enquiry),
  ]);

  if (!userEmail.success) {
    console.error("[emailService] User confirmation email failed — enquiry still saved.");
  }
  if (!adminEmail.success) {
    console.error("[emailService] Admin notification email failed — enquiry still saved.");
  }

  return { userEmail, adminEmail };
}

export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${WEBSITE_URL.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
  return _send({
    from: FROM,
    to: user.email,
    subject: "Reset your Swapnapurti Associates password",
    text: `Use this link to reset your password: ${resetUrl}\n\nThis link expires in 30 minutes.`,
    html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes.</p>`,
  });
}

export async function sendVerificationCode({ user, code, channel }) {
  const subject = "Your Swapnapurti Associates verification code";
  const text = `Your verification code is ${code}. It expires in 10 minutes.`;

  if (channel === "email") {
    return _send({
      from: FROM,
      to: user.email,
      subject,
      text,
      html: `<p>Your Swapnapurti Associates verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:8px">${code}</p><p>This code expires in 10 minutes.</p>`,
    });
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !authToken || !from) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: new Error("SMS verification is not configured") };
    }
    console.log(`[sms/DEV-STUB] Verification code for ${user.phone}: ${code}`);
    return { success: true, messageId: `dev-sms-${Date.now()}` };
  }

  const body = new URLSearchParams({ To: `${user.countryCode || "+91"}${user.phone}`, From: from, Body: text });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) return { success: false, error: new Error("SMS provider rejected the verification message") };
  const data = await response.json();
  return { success: true, messageId: data.sid };
}
