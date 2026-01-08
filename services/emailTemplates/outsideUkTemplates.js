export const outsideNigeriaPaymentEmail = ({ user, usdAmount, rates }) => {
  const ngnAmount = Math.round(usdAmount * rates.usdToNgn).toLocaleString();
  const ghsAmount = Math.round(usdAmount * rates.usdToGhs).toLocaleString();

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Payment Instructions</title>
  </head>
  
  <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:20px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">
  
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#3B82F6,#8B5CF6); color:#ffffff; padding:30px; text-align:center;">
                <h1 style="margin:0;">Aston Data Academy</h1>
                <p style="margin:8px 0 0;">Course Registration – Payment Instructions</p>
              </td>
            </tr>
  
            <!-- Content -->
            <tr>
              <td style="padding:30px; color:#333;">
                <p>Dear ${user.firstName},</p>
  
                <p>
                  Thank you for registering for our
                  <strong>3 months Data Analytics Masterclass</strong>.
                </p>
  
                <!-- Amount Table -->
                <table width="100%" cellpadding="12" cellspacing="0" style="background:#f9fafb; border-radius:8px; margin:20px 0; text-align:center;">
                  <tr>
                    <td colspan="2" style="font-size:18px; font-weight:bold; color:#10B981;">
                      USD $${usdAmount} Equivalent Payment
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid #e5e7eb;">
                      🇳🇬 <strong>Nigeria</strong><br />
                      ₦${ngnAmount}
                    </td>
                    <td style="border-top:1px solid #e5e7eb;">
                      🇬🇭 <strong>Ghana</strong><br />
                      ${ghsAmount} GHS
                    </td>
                  </tr>
                </table>
  
                <p>
                  Please make payment to <strong>one</strong> of the accounts below,
                  depending on your location:
                </p>
  
                <!-- Nigeria Table -->
                <table width="100%" cellpadding="10" cellspacing="0" style="background:#f9fafb; border-radius:8px; margin:20px 0;">
                  <tr>
                    <td colspan="2" style="font-weight:bold; color:#3B82F6;">
                      Nigeria Payment Details
                    </td>
                  </tr>
                  <tr>
                    <td>Bank Name</td>
                    <td>Access Bank</td>
                  </tr>
                  <tr>
                    <td>Account Number</td>
                    <td>1379060251</td>
                  </tr>
                </table>
  
                <!-- Ghana Table -->
                <table width="100%" cellpadding="10" cellspacing="0" style="background:#f9fafb; border-radius:8px; margin:20px 0;">
                  <tr>
                    <td colspan="2" style="font-weight:bold; color:#3B82F6;">
                      Ghana Payment Details
                    </td>
                  </tr>
                  <tr>
                    <td>Payment Method</td>
                    <td>Mobile Money (MoMo)</td>
                  </tr>
                  <tr>
                    <td>MoMo Number</td>
                    <td>0248813788</td>
                  </tr>
                  <tr>
                    <td>Account Name</td>
                    <td>Debvamk Business Solutions</td>
                  </tr>
                  <tr>
                    <td>Contact Person</td>
                    <td>Bless Dellor</td>
                  </tr>
                </table>
  
                <!-- Instructions -->
                <p><strong>Important Instructions:</strong></p>
                <ul>
                  <li>Please include your <strong>name and email</strong> in the payment reference</li>
                  <li>
                    Send payment proof to:
                    <strong>${process.env.EMAIL_USER}</strong>
                  </li>
                  <li>Payment verification takes 24–48 hours</li>
                  <li>Access details will be shared once payment is confirmed</li>
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
