// PRINTORA Brevo (Sendinblue) Transactional Email & OTP Integration
// REST API Endpoint: https://api.brevo.com/v3/smtp/email
// Supports 6-digit OTP generation, branded verification emails, and order confirmation dispatches

export function generate6DigitOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends a transactional email using Brevo REST API
 * @param {Object} params
 * @param {string} params.apiKey - Brevo API key (xkeysib-...)
 * @param {string} params.toEmail - Recipient email address
 * @param {string} params.toName - Recipient full name
 * @param {string} params.subject - Email subject
 * @param {string} params.htmlContent - HTML message body
 * @param {string} [params.senderEmail] - Sender email address
 * @param {string} [params.senderName] - Sender display name
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendBrevoEmail({
  apiKey,
  toEmail,
  toName = "Valued Customer",
  subject,
  htmlContent,
  senderEmail = "manikantalakshmareddy@gmail.com",
  senderName = "PRINTORA"
}) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, error: "Brevo API Key is missing. Please configure it in Store Settings." };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey.trim(),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: toEmail.trim(),
            name: toName.trim()
          }
        ],
        subject,
        htmlContent
      })
    });

    const data = await res.json();
    if (res.ok) {
      return { success: true, messageId: data.messageId };
    } else {
      return { success: false, error: data.message || "Brevo dispatch failed" };
    }
  } catch (err) {
    return { success: false, error: err.message || "Network error while connecting to Brevo" };
  }
}

/**
 * Sends a luxury branded PRINTORA OTP verification email
 */
export async function sendBrevoOtpEmail({
  apiKey,
  toEmail,
  toName = "Customer",
  otpCode,
  purpose = "Order Verification"
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PRINTORA Security Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0A0A; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: #141414; border: 1px solid #282828; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #111111; padding: 32px 30px; text-align: center; border-bottom: 1px solid #222222;">
                  <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 4px; color: #FFFFFF;">PRINTORA</h1>
                  <p style="margin: 6px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 3px; color: #FF6B35; text-transform: uppercase;">YOU IMAGINE. WE PRINT.</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px; text-align: center;">
                  <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 107, 53, 0.15); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 20px; color: #FF6B35; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;">
                    ${purpose}
                  </span>
                  
                  <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #FFFFFF;">Your One-Time Passcode (OTP)</h2>
                  <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 1.6; color: #AAAAAA;">
                    Hello ${toName}, use the verification code below to authorize your request. This code is confidential and expires in 10 minutes.
                  </p>

                  <!-- OTP Code Box -->
                  <div style="background-color: #0A0A0A; border: 2px dashed #FF6B35; border-radius: 14px; padding: 22px 20px; margin: 0 auto 28px auto; max-width: 320px;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #FF6B35;">${otpCode}</span>
                  </div>

                  <p style="margin: 0; font-size: 11px; color: #777777; line-height: 1.5;">
                    If you did not request this code, please ignore this email or contact support at <a href="mailto:support@printoracustom.in" style="color: #FF6B35; text-decoration: none;">support@printoracustom.in</a>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0E0E0E; padding: 20px 30px; text-align: center; border-top: 1px solid #222222; font-size: 11px; color: #666666;">
                  © 2026 PRINTORA (printoracustom.in) • Nizamabad, Telangana, India.<br>
                  Official WhatsApp Desk: +91 8106992102
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendBrevoEmail({
    apiKey,
    toEmail,
    toName,
    subject: `[${otpCode}] Your PRINTORA Verification Code`,
    htmlContent
  });
}
