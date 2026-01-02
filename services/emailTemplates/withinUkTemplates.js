export const ukPaymentEmail = ({ user, amountGbp }) => {
  const formattedAmount = `£${amountGbp.toFixed(2)}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>UK Payment Instructions</title>
  </head>
  
  <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
  
            <!-- Header -->
            <tr>
              <td style="background:#0F4C81; color:#ffffff; padding:30px; text-align:center;">
                <h1 style="margin:0;">Aston Data Academy</h1>
                <p style="margin:8px 0 0;">Course Registration – UK Payment Instructions</p>
              </td>
            </tr>
  
            <!-- Content -->
            <tr>
              <td style="padding:30px; color:#333;">
                <p>Dear ${user.firstName},</p>
  
                <p>
                  Thank you for registering for our
                  <strong>3 Months Data Analytics Masterclass</strong>.
                </p>
  
                <!-- Amount -->
                <table width="100%" cellpadding="12" cellspacing="0"
                  style="background:#f9fafb; border-radius:8px; margin:20px 0; text-align:center;">
                  <tr>
                    <td style="font-size:18px; font-weight:bold; color:#10B981;">
                      Amount to Pay: ${formattedAmount}
                    </td>
                  </tr>
                </table>
  
                <p>
                  Please complete your registration by making a bank transfer
                  using the details below:
                </p>
  
                <!-- Bank Details -->
                <table width="100%" cellpadding="10" cellspacing="0"
                  style="background:#f9fafb; border-radius:8px; margin:20px 0;">
                  <tr>
                    <td colspan="2" style="font-weight:bold; color:#0F4C81;">
                      UK Bank Transfer Details
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Bank Name</strong></td>
                    <td>Lloyds Bank</td>
                  </tr>
                  <tr>
                    <td><strong>Account Number</strong></td>
                    <td>51776668</td>
                  </tr>
                  <tr>
                    <td><strong>Sort Code</strong></td>
                    <td>77-17-37</td>
                  </tr>
                </table>
  
                <!-- Instructions -->
                <p><strong>Important Instructions:</strong></p>
                <ul>
                  <li>Please include your <strong>name and email</strong> as the payment reference</li>
                  <li>
                    Send proof of payment to:
                    <strong>${process.env.EMAIL_FROM || process.env.EMAIL_USER}</strong>
                  </li>
                  <li>Payment verification takes 24–48 hours</li>
                  <li>You will receive confirmation once payment is verified</li>
                </ul>
  
                <p>
                  Best regards,<br />
                  <strong>Aston Data Academy Team</strong>
                </p>
              </td>
            </tr>
  
            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; text-align:center; padding:20px; font-size:13px; color:#6B7280;">
                <p style="margin:0;">This is an automated email. Please do not reply.</p>
                <p style="margin:5px 0 0;">Support: ${
                  process.env.EMAIL_FROM || process.env.EMAIL_USER
                }</p>
              </td>
            </tr>
  
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
