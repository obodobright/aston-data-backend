const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const outsideNigeriaPaymentEmail = ({ user, amountNgn, amountGhs }) => {
  const firstName = escapeHtml(user.firstName);
  const formattedNgnAmount = Math.round(amountNgn).toLocaleString();
  const formattedGhsAmount = Math.round(amountGhs).toLocaleString();
  const installmentNgn = Math.round(amountNgn / 3).toLocaleString();
  const installmentGhs = Math.round(amountGhs / 3).toLocaleString();
  const supportEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Payment Instructions</title>
  </head>

  <body style="margin:0; padding:0; background:#f8fafc; font-family:Arial, sans-serif; color:#0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#020617; color:#ffffff; padding:28px;">
                <p style="margin:0 0 8px; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#cbd5e1;">Aston Data Academy</p>
                <h1 style="margin:0; font-size:28px; line-height:1.2;">Payment instructions</h1>
                <p style="margin:10px 0 0; color:#cbd5e1;">Course registration - Outside UK</p>
              </td>
            </tr>

            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px; font-size:16px; line-height:1.7;">Dear ${firstName},</p>

                <p style="margin:0 0 16px; font-size:16px; line-height:1.7;">
                  Thank you for registering for our
                  <strong>2-month Data Analytics Training Programme</strong>.
                </p>

                <table width="100%" cellpadding="12" cellspacing="0" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:20px 0; text-align:center;">
                  <tr>
                    <td colspan="2" style="font-size:18px; font-weight:bold; color:#0f172a;">
                      Total Programme Fee
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid #e2e8f0; color:#475569;">
                      <strong style="color:#0f172a;">Nigeria</strong><br />
                      NGN ${formattedNgnAmount}
                    </td>
                    <td style="border-top:1px solid #e2e8f0; color:#475569;">
                      <strong style="color:#0f172a;">Ghana</strong><br />
                      GHS ${formattedGhsAmount}
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="12" cellspacing="0" style="background:#eef2ff; border:1px solid #c7d2fe; border-radius:12px; margin:20px 0;">
                  <tr>
                    <td style="font-size:17px; font-weight:bold; color:#020617;">
                      Flexible Payment Option - Pay in 3 Installments
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size:15px; line-height:1.7; color:#334155;">
                      You may choose to split the total programme fee into
                      <strong>three (3) equal installments</strong>.
                      <br /><br />
                      <strong>Each installment:</strong><br />
                      NGN ${installmentNgn}<br />
                      GHS ${installmentGhs}
                      <br /><br />
                      <strong>Important:</strong>
                      <ul style="margin:10px 0 0; padding-left:18px;">
                        <li>The <strong>first installment</strong> secures your programme slot</li>
                        <li>The remaining two installments are paid monthly</li>
                        <li>All installments must be completed before programme completion</li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 16px; font-size:16px; line-height:1.7;">
                  Please make payment to <strong>one</strong> of the accounts below,
                  depending on your location:
                </p>

                <table width="100%" cellpadding="10" cellspacing="0" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:20px 0;">
                  <tr>
                    <td colspan="2" style="font-weight:bold; color:#020617;">
                      Nigeria Payment Details
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">Bank Name</td>
                    <td>Access Bank</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">Account Number</td>
                    <td>1379060251</td>
                  </tr>
                </table>

                <table width="100%" cellpadding="10" cellspacing="0" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin:20px 0;">
                  <tr>
                    <td colspan="2" style="font-weight:bold; color:#020617;">
                      Ghana Payment Details
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">Payment Method</td>
                    <td>Mobile Money (MoMo)</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">MoMo Number</td>
                    <td>0248813788</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">Account Name</td>
                    <td>Debvamk Business Solutions</td>
                  </tr>
                  <tr>
                    <td style="color:#64748b;">Contact Person</td>
                    <td>Bless Dellor</td>
                  </tr>
                </table>

                <p style="margin:0 0 10px; font-size:16px;"><strong>Important Instructions:</strong></p>
                <ul style="margin:0 0 20px; padding-left:18px; color:#334155; line-height:1.7;">
                  <li>Please include your <strong>name and email</strong> in the payment reference</li>
                  <li>Send payment proof to: <strong>${process.env.EMAIL_USER}</strong></li>
                  <li>Payment verification takes 24-48 hours</li>
                  <li>Access details will be shared once payment is confirmed</li>
                </ul>

                <p style="margin:0; font-size:16px; line-height:1.7;">
                  Best regards,<br />
                  <strong>Aston Data Academy Team</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f8fafc; text-align:center; padding:20px; font-size:13px; color:#64748b; border-top:1px solid #e2e8f0;">
                <p style="margin:0;">This is an automated email. Please do not reply.</p>
                <p style="margin:5px 0 0;">Support: ${supportEmail}</p>
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
