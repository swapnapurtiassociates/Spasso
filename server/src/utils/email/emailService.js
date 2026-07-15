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
