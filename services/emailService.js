import { outsideNigeriaPaymentEmail } from "./emailTemplates/outsideUkTemplates.js";
import { ukPaymentEmail } from "./emailTemplates/withinUkTemplates.js";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

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
    const mailOptions = {
      from: "Aston Data Academy <onboarding@resend.dev>",
      to: user.email,
      subject: `Payment Instructions - Aston Data Academy Course Registration`,
      html:
        user.country === "Outside Uk"
          ? outsideNigeriaPaymentEmail({
              user: { firstName: user.firstName },
              usdAmount: 100,
              rates: {
                usdToNgn: 1444.45,
                usdToGhs: 10.5,
              },
            })
          : ukPaymentEmail({
              user: { firstName: user.firstName },
              amountGbp: 100,
            }),
    };
    const emailSending = await sendEmail(mailOptions);

    console.log("Email sent:", emailSending.data);
    return { success: true, messageId: "the email was sent" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
