/**
 * templates.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Pure functions that return self-contained HTML email strings.
 *
 * Design principles:
 *  • Inline CSS only (email clients strip <style> blocks)
 *  • Max-width 600 px (universal email width standard)
 *  • Construction brand palette: gold #B88F34 / dark #1C1A16 / cream #FAF6F0
 *  • Mobile-first with a single media-query for wider screens
 *  • No external images or fonts (guaranteed rendering everywhere)
 *  • Plain-text alt path via the `textBody` export below
 * ──────────────────────────────────────────────────────────────────────────────
 */

const COMPANY_NAME    = process.env.COMPANY_NAME    || "Swapnapurti Associates";
const COMPANY_PHONE   = process.env.COMPANY_PHONE   || "+91 22 4567 8900";
const COMPANY_WEBSITE = process.env.COMPANY_WEBSITE || "https://swapnapurtiassociates.com";
const COMPANY_EMAIL   = process.env.COMPANY_EMAIL   || "projects@swapnapurtiassociates.com";
const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS || "Level 42, BKC, Mumbai 400051";

/* ── Shared styling constants ─────────────────────────────────────── */
const GOLD   = "#B88F34";
const DARK   = "#1C1A16";
const CREAM  = "#FAF6F0";
const MUTED  = "#5C5346";
const BORDER = "#EDE1D3";

/**
 * Shared outer wrapper — consistent header/footer around any email body.
 *
 * @param {string} bodyHtml   - The unique centre-section HTML for this email
 * @param {string} [previewText] - Hidden preview text shown in inbox list
 */
function wrapEmail(bodyHtml, previewText = "") {
  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${COMPANY_NAME}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F4EFE8;font-family:Georgia,'Times New Roman',serif;">

  <!-- Inbox preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${previewText}
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Email wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background-color:#F4EFE8;min-width:320px;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- ── Card ── -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:600px;background-color:#FFFFFF;border:1px solid ${BORDER};">

          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background-color:${DARK};padding:0;">
              <!-- Gold top accent bar -->
              <div style="height:4px;background:linear-gradient(90deg,${GOLD},#D4A84B);"></div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:28px 36px;">
                    <!-- Logo wordmark (image-free, works everywhere) -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Icon block -->
                        <td style="width:42px;height:42px;background-color:${GOLD};
                                   text-align:center;vertical-align:middle;">
                          <span style="color:#FFFFFF;font-size:20px;font-weight:bold;
                                       line-height:42px;">&#9650;</span>
                        </td>
                        <td style="width:12px;"></td>
                        <!-- Company name -->
                        <td style="vertical-align:middle;">
                          <div style="color:#FFFFFF;font-size:15px;font-weight:bold;
                                      letter-spacing:0.14em;text-transform:uppercase;
                                      font-family:Georgia,serif;">
                            ${COMPANY_NAME}
                          </div>
                          <div style="color:${GOLD};font-size:9px;letter-spacing:0.25em;
                                      text-transform:uppercase;margin-top:2px;
                                      font-family:Arial,sans-serif;">
                            Construction &amp; Infrastructure
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ DYNAMIC BODY ══ -->
          ${bodyHtml}

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background-color:${DARK};padding:32px 36px;border-top:3px solid ${GOLD};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Footer info -->
                  <td style="vertical-align:top;">
                    <div style="color:${GOLD};font-size:11px;letter-spacing:0.18em;
                                text-transform:uppercase;margin-bottom:10px;
                                font-family:Arial,sans-serif;">
                      ${COMPANY_NAME}
                    </div>
                    <div style="color:#9A8C7A;font-size:11px;line-height:1.7;
                                font-family:Arial,sans-serif;">
                      ${COMPANY_ADDRESS}<br/>
                      <a href="tel:${COMPANY_PHONE.replace(/\s/g,'')}"
                         style="color:#9A8C7A;text-decoration:none;">${COMPANY_PHONE}</a><br/>
                      <a href="mailto:${COMPANY_EMAIL}"
                         style="color:#9A8C7A;text-decoration:none;">${COMPANY_EMAIL}</a>
                    </div>
                  </td>
                  <!-- Website link -->
                  <td style="vertical-align:top;text-align:right;">
                    <a href="${COMPANY_WEBSITE}"
                       style="color:${GOLD};font-size:11px;letter-spacing:0.12em;
                              text-transform:uppercase;text-decoration:none;
                              font-family:Arial,sans-serif;">
                      Visit Website &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Legal line -->
              <div style="border-top:1px solid #2E2A24;margin-top:20px;padding-top:16px;
                          color:#6B5F52;font-size:10px;line-height:1.5;
                          font-family:Arial,sans-serif;">
                This email was sent because you submitted an enquiry on ${COMPANY_WEBSITE}.
                Please do not reply directly to this message — use the contact details above.
              </div>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/* ═══════════════════════════════════════════════════════════════════
   1. USER CONFIRMATION EMAIL
   Sent to the person who just submitted the enquiry form.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * @param {object} enquiry
 * @param {string} enquiry.name
 * @param {string} enquiry.email
 * @param {string} enquiry.phone
 * @param {string} [enquiry.company]
 * @param {string} enquiry.projectType
 * @param {string} [enquiry.budgetRange]
 * @param {string} enquiry.location
 * @param {string} enquiry.message
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildUserConfirmationEmail(enquiry) {
  const {
    name, email, phone,
    company = "",
    projectType, budgetRange = "",
    location, message,
  } = enquiry;

  const firstName = name.split(" ")[0];

  /* Helper: one detail row */
  const row = (label, value) =>
    value
      ? /* html */ `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};
                     background-color:#FDFAF6;width:38%;">
            <span style="color:${MUTED};font-size:11px;text-transform:uppercase;
                         letter-spacing:0.12em;font-family:Arial,sans-serif;">${label}</span>
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};">
            <span style="color:${DARK};font-size:13px;font-family:Arial,sans-serif;">
              ${value}
            </span>
          </td>
        </tr>`
      : "";

  const bodyHtml = /* html */ `
    <!-- ── Hero strip ── -->
    <tr>
      <td style="background:linear-gradient(135deg,#2A2520 0%,#1C1A16 100%);
                 padding:40px 36px 36px;border-bottom:2px solid ${GOLD};">
        <div style="color:${GOLD};font-size:10px;letter-spacing:0.28em;
                    text-transform:uppercase;margin-bottom:12px;
                    font-family:Arial,sans-serif;">
          Enquiry Confirmation
        </div>
        <h1 style="color:#FFFFFF;font-size:26px;margin:0 0 8px;font-weight:bold;
                   font-family:Georgia,serif;line-height:1.2;">
          Thank You, ${firstName}.
        </h1>
        <p style="color:#B0A090;font-size:13px;margin:0;font-family:Arial,sans-serif;
                  line-height:1.6;">
          We've received your project enquiry and our team will be in touch shortly.
        </p>
      </td>
    </tr>

    <!-- ── Greeting ── -->
    <tr>
      <td style="padding:36px 36px 20px;">
        <p style="color:${DARK};font-size:15px;margin:0 0 12px;line-height:1.8;
                  font-family:Arial,sans-serif;">
          Dear <strong>${name}</strong>,
        </p>
        <p style="color:${MUTED};font-size:14px;margin:0 0 10px;line-height:1.8;
                  font-family:Arial,sans-serif;">
          Thank you for contacting <strong>${COMPANY_NAME}</strong>. We have successfully
          received your project enquiry and our business development team will review
          your request shortly.
        </p>
        <p style="color:${MUTED};font-size:14px;margin:0;line-height:1.8;
                  font-family:Arial,sans-serif;">
          You can expect to hear from us within <strong>24–48 business hours</strong>.
        </p>
      </td>
    </tr>

    <!-- ── Divider with label ── -->
    <tr>
      <td style="padding:0 36px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:1px solid ${BORDER};width:32px;"></td>
            <td style="padding:0 12px;white-space:nowrap;">
              <span style="color:${GOLD};font-size:10px;letter-spacing:0.22em;
                           text-transform:uppercase;font-family:Arial,sans-serif;">
                Your Submitted Details
              </span>
            </td>
            <td style="border-top:1px solid ${BORDER};"></td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Details table ── -->
    <tr>
      <td style="padding:0 36px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="border:1px solid ${BORDER};border-collapse:collapse;">
          ${row("Full Name",     name)}
          ${row("Email",         email)}
          ${row("Phone",         phone)}
          ${row("Company",       company)}
          ${row("Project Type",  projectType)}
          ${row("Budget Range",  budgetRange)}
          ${row("Location",      location)}
          <!-- Message row — full width -->
          <tr>
            <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};
                       background-color:#FDFAF6;width:38%;vertical-align:top;">
              <span style="color:${MUTED};font-size:11px;text-transform:uppercase;
                           letter-spacing:0.12em;font-family:Arial,sans-serif;">Message</span>
            </td>
            <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};">
              <span style="color:${DARK};font-size:13px;line-height:1.6;
                           font-family:Arial,sans-serif;white-space:pre-wrap;">${message}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── What happens next ── -->
    <tr>
      <td style="padding:0 36px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="background-color:${CREAM};border-left:3px solid ${GOLD};padding:0;">
          <tr>
            <td style="padding:20px 24px;">
              <div style="color:${GOLD};font-size:10px;letter-spacing:0.22em;
                          text-transform:uppercase;margin-bottom:10px;
                          font-family:Arial,sans-serif;">What Happens Next</div>
              <table role="presentation" cellpadding="0" cellspacing="0">
                ${[
                  ["01", "Our team reviews your enquiry"],
                  ["02", "A project specialist contacts you within 24–48 hrs"],
                  ["03", "We schedule a discovery call or site visit"],
                  ["04", "You receive a tailored proposal"],
                ].map(([n, t]) => /* html */ `
                <tr>
                  <td style="width:28px;vertical-align:top;padding-bottom:8px;">
                    <span style="color:${GOLD};font-size:11px;font-weight:bold;
                                 font-family:Arial,sans-serif;">${n}</span>
                  </td>
                  <td style="vertical-align:top;padding-bottom:8px;">
                    <span style="color:${MUTED};font-size:12px;font-family:Arial,sans-serif;">
                      ${t}
                    </span>
                  </td>
                </tr>`).join("")}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── CTA Button ── -->
    <tr>
      <td style="padding:0 36px 40px;text-align:center;">
        <a href="${COMPANY_WEBSITE}/contact"
           style="display:inline-block;background-color:${GOLD};color:#FFFFFF;
                  font-size:11px;font-weight:bold;letter-spacing:0.22em;
                  text-transform:uppercase;text-decoration:none;
                  padding:16px 40px;font-family:Arial,sans-serif;">
          View Our Portfolio &rarr;
        </a>
        <p style="margin:20px 0 0;color:#9A8A7A;font-size:11px;
                  font-family:Arial,sans-serif;line-height:1.6;">
          Questions? Call us at
          <a href="tel:${COMPANY_PHONE.replace(/\s/g,'')}"
             style="color:${GOLD};text-decoration:none;">${COMPANY_PHONE}</a>
          or reply to
          <a href="mailto:${COMPANY_EMAIL}"
             style="color:${GOLD};text-decoration:none;">${COMPANY_EMAIL}</a>
        </p>
      </td>
    </tr>`;

  const subject = `Thank You for Contacting ${COMPANY_NAME} – We've Received Your Request`;

  const text = `
Dear ${name},

Thank you for contacting ${COMPANY_NAME}. We have received your project enquiry
and will get back to you within 24-48 business hours.

YOUR SUBMITTED DETAILS
──────────────────────
Name         : ${name}
Email        : ${email}
Phone        : ${phone}
${company ? `Company      : ${company}\n` : ""}Project Type : ${projectType}
${budgetRange ? `Budget Range : ${budgetRange}\n` : ""}Location     : ${location}
Message      : ${message}

WHAT HAPPENS NEXT
──────────────────────
1. Our team reviews your enquiry
2. A project specialist contacts you within 24-48 hrs
3. We schedule a discovery call or site visit
4. You receive a tailored proposal

Best Regards,
${COMPANY_NAME}
${COMPANY_PHONE}
${COMPANY_WEBSITE}
${COMPANY_ADDRESS}
`.trim();

  return {
    subject,
    html: wrapEmail(bodyHtml, `We've received your enquiry — our team will contact you within 24-48 hours.`),
    text,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   2. ADMIN NOTIFICATION EMAIL
   Sent to the company admin / CRM inbox whenever a new lead arrives.
   ═══════════════════════════════════════════════════════════════════ */

/**
 * @param {object} enquiry  - Same shape as buildUserConfirmationEmail
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildAdminNotificationEmail(enquiry) {
  const {
    name, email, phone,
    company = "",
    projectType, budgetRange = "",
    location, message,
    _id,
    createdAt,
  } = enquiry;

  const submittedAt = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const row = (label, value, highlight = false) =>
    value
      ? /* html */ `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};
                     background-color:#FDFAF6;width:36%;vertical-align:top;">
            <span style="color:${MUTED};font-size:11px;text-transform:uppercase;
                         letter-spacing:0.1em;font-family:Arial,sans-serif;">${label}</span>
          </td>
          <td style="padding:10px 16px;border-bottom:1px solid ${BORDER};">
            <span style="color:${highlight ? GOLD : DARK};font-size:13px;
                         font-weight:${highlight ? "bold" : "normal"};
                         font-family:Arial,sans-serif;white-space:pre-wrap;">${value}</span>
          </td>
        </tr>`
      : "";

  const bodyHtml = /* html */ `
    <!-- ── Urgent badge strip ── -->
    <tr>
      <td style="background-color:#1E3A2F;padding:14px 36px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:10px;height:10px;background-color:#4CAF50;
                       border-radius:50%;vertical-align:middle;"></td>
            <td style="padding-left:10px;">
              <span style="color:#6ECF7F;font-size:11px;font-weight:bold;
                           letter-spacing:0.2em;text-transform:uppercase;
                           font-family:Arial,sans-serif;">
                🔔 New Lead Received
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ── Hero ── -->
    <tr>
      <td style="background:linear-gradient(135deg,#2A2520 0%,#1C1A16 100%);
                 padding:32px 36px 28px;border-bottom:2px solid ${GOLD};">
        <div style="color:${GOLD};font-size:10px;letter-spacing:0.28em;
                    text-transform:uppercase;margin-bottom:8px;
                    font-family:Arial,sans-serif;">Admin Notification</div>
        <h1 style="color:#FFFFFF;font-size:22px;margin:0 0 6px;
                   font-family:Georgia,serif;line-height:1.2;">
          New Project Enquiry
        </h1>
        <p style="color:#9A8C7A;font-size:12px;margin:0;font-family:Arial,sans-serif;">
          Submitted ${submittedAt} IST${_id ? `&nbsp;&nbsp;|&nbsp;&nbsp;ID: ${_id}` : ""}
        </p>
      </td>
    </tr>

    <!-- ── Lead details ── -->
    <tr>
      <td style="padding:28px 36px 16px;">
        <div style="color:${GOLD};font-size:10px;letter-spacing:0.22em;
                    text-transform:uppercase;margin-bottom:12px;
                    font-family:Arial,sans-serif;">Lead Details</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="border:1px solid ${BORDER};border-collapse:collapse;">
          ${row("Full Name",     name,        true)}
          ${row("Email",         email)}
          ${row("Phone",         phone)}
          ${row("Company",       company)}
          ${row("Project Type",  projectType, true)}
          ${row("Budget Range",  budgetRange, true)}
          ${row("Location",      location)}
          ${row("Message",       message)}
        </table>
      </td>
    </tr>

    <!-- ── Quick-action buttons ── -->
    <tr>
      <td style="padding:8px 36px 40px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px;">
              <a href="${COMPANY_WEBSITE}/dashboard/admin/enquiries"
                 style="display:inline-block;background-color:${GOLD};color:#FFFFFF;
                        font-size:11px;font-weight:bold;letter-spacing:0.18em;
                        text-transform:uppercase;text-decoration:none;
                        padding:13px 28px;font-family:Arial,sans-serif;">
                View in Dashboard &rarr;
              </a>
            </td>
            <td>
              <a href="mailto:${email}?subject=Re: Your Enquiry – ${COMPANY_NAME}"
                 style="display:inline-block;border:1px solid ${GOLD};color:${GOLD};
                        font-size:11px;font-weight:bold;letter-spacing:0.18em;
                        text-transform:uppercase;text-decoration:none;
                        padding:13px 28px;font-family:Arial,sans-serif;">
                Reply to Lead
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const subject = `🔔 New Lead Received – ${name} | ${projectType} Project | ${COMPANY_NAME}`;

  const text = `
NEW LEAD RECEIVED — ${COMPANY_NAME}
═══════════════════════════════════════

Submitted : ${submittedAt} IST
${_id ? `Lead ID   : ${_id}` : ""}

CONTACT DETAILS
───────────────
Name         : ${name}
Email        : ${email}
Phone        : ${phone}
${company ? `Company      : ${company}\n` : ""}
PROJECT DETAILS
───────────────
Project Type : ${projectType}
${budgetRange ? `Budget Range : ${budgetRange}\n` : ""}Location     : ${location}
Message      :
${message}

Dashboard: ${COMPANY_WEBSITE}/dashboard/admin/enquiries
`.trim();

  return {
    subject,
    html: wrapEmail(bodyHtml, `New lead: ${name} — ${projectType} project in ${location}`),
    text,
  };
}
