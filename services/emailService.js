import nodemailer from "nodemailer";
import { outsideNigeriaPaymentEmail } from "./emailTemplates/outsideUkTemplates.js";
import { ukPaymentEmail } from "./emailTemplates/withinUkTemplates.js";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendBankDetailsEmail = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
