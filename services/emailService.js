import { outsideNigeriaPaymentEmail } from "./emailTemplates/outsideUkTemplates.js";
import { ukPaymentEmail } from "./emailTemplates/withinUkTemplates.js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const sendEmail = async ({ from, to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    return response;
  } catch (error) {
    console.error("Error sending email with Resend:", error);
    throw new Error("Failed to send email");
  }
};

export const sendBankDetailsEmail = async (user) => {
  try {
    const outsideUkAmountNgn = Number(process.env.OUTSIDE_UK_AMOUNT_NGN || 100000);
    const outsideUkAmountGhs = Number(
      process.env.OUTSIDE_UK_AMOUNT_GHS || Math.round(outsideUkAmountNgn * 0.0075)
    );

    const mailOptions = {
      from: "Aston Data Academy <info@astondataacademy.co.uk>",
      to: user.email,
      subject: `Payment Instructions - Aston Data Academy Course Registration`,
      html:
        user.country === "Outside Uk"
          ? outsideNigeriaPaymentEmail({
              user: { firstName: user.firstName },
              amountNgn: outsideUkAmountNgn,
              amountGhs: outsideUkAmountGhs,
            })
          : ukPaymentEmail({
              user: { firstName: user.firstName },
              amountGbp: 150,
            }),
    };
    const emailSending = await sendEmail(mailOptions);

    // console.log("Email sent:", emailSending);
    return { success: true, messageId: "the email was sent" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendPaymentSuccessfulEmail = async (user) => {
  const siteUrl = (process.env.FRONTEND_URL || "https://www.astondataacademy.co.uk").replace(/\/$/, "");
  const resourcesPath = process.env.RESOURCE_ACCESS_PATH || "/student-resources-2026-aston-data-academy-access";
  const normalizedResourcesPath = resourcesPath.startsWith("/") ? resourcesPath : `/${resourcesPath}`;
  const resourcesUrl = `${siteUrl}${normalizedResourcesPath}`;
  const firstName = escapeHtml(user.firstName);

  try {
    const mailOptions = {
      from: "Aston Data Academy <info@astondataacademy.co.uk>",
      to: user.email,
      subject: "Payment Confirmed - Your Aston Data Academy Resources",
      html: `
        <div style="margin:0;background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;color:#0f172a;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:#020617;padding:28px;color:#ffffff;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#cbd5e1;">Aston Data Academy</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;">Payment confirmed</h1>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi ${firstName},</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                Your payment has been confirmed. You can now access the student learning resources for the Aston Data Academy programme.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                Use the link below to open the resources page:
              </p>
              <a
                href="${resourcesUrl}"
                style="display:inline-block;background:#020617;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-weight:700;"
              >
                Open learning resources
              </a>
              <p style="margin:24px 0 0;font-size:14px;line-height:1.7;color:#475569;">
                If the button does not work, copy and paste this link into your browser:<br />
                <a href="${resourcesUrl}" style="color:#0f172a;">${resourcesUrl}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await sendEmail(mailOptions);
    return { success: true, messageId: "payment success email was sent" };
  } catch (error) {
    console.error("Error sending payment successful email:", error);
    throw error;
  }
};
