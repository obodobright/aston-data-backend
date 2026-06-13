export const ukPaymentEmail = ({ user, amountGbp }) => {
  const formattedAmount = `&pound;${amountGbp.toFixed(2)}`;
  const installmentAmount = `&pound;${(amountGbp / 3).toFixed(2)}`;

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
            <tr>
              <td style="background:#0F4C81; color:#ffffff; padding:30px; text-align:center;">
                <h1 style="margin:0;">Aston Data Academy</h1>
                <p style="margin:8px 0 0;">Course Registration - UK Payment Instructions</p>
              </td>
            </tr>

            <tr>
              <td style="padding:30px; color:#333;">
                <p>Dear ${user.firstName},</p>

                <p>
                  Thank you for registering for our
                  <strong>2-Month Data Analytics Training Programme</strong>.
                </p>

                <table width="100%" cellpadding="12" cellspacing="0"
                  style="background:#f9fafb; border-radius:8px; margin:20px 0; text-align:center;">
                  <tr>
                    <td style="font-size:18px; font-weight:bold; color:#10B981;">
                      Total Programme Fee: ${formattedAmount}
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="12" cellspacing="0"
                  style="background:#eef2ff; border-radius:8px; margin:20px 0;">
                  <tr>
                    <td style="font-size:17px; font-weight:bold; color:#0F4C81;">
                      Flexible Payment Option - Pay in 3 Installments
                    </td>
                  </tr>
                  <tr>
                    <td>
                      You may choose to split the total programme fee into
                      <strong>three (3) equal installments</strong>.
                      <br /><br />
                      <strong>Each installment:</strong> ${installmentAmount}
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

                <p>
                  Please complete your registration by making a bank transfer
                  using the details below:
                </p>

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
                    <td><strong>Payee Name</strong></td>
                    <td>Aston Victor</td>
                  </tr>
                  <tr>
                    <td><strong>Sort Code</strong></td>
                    <td>77-17-37</td>
                  </tr>
                </table>

                <p><strong>Important Instructions:</strong></p>
                <ul>
                  <li>Please include your <strong>name and email</strong> as the payment reference</li>
                  <li>
                    Send proof of payment to:
                    <strong>${process.env.EMAIL_USER}</strong>
                  </li>
                  <li>Payment verification takes 24-48 hours</li>
                  <li>You will receive confirmation once payment is verified</li>
                </ul>

                <p>
                  Best regards,<br />
                  <strong>Aston Data Academy Team</strong>
                </p>
              </td>
            </tr>

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
