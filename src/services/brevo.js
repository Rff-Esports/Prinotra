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
                    If you did not request this code, please ignore this email or contact support at <a href="mailto:printora256@gmail.com" style="color: #FF6B35; text-decoration: none;">printora256@gmail.com</a>.
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

/**
 * Sends a payment confirmation transactional email when admin confirms payment
 */
export async function sendPaymentConfirmedEmail({
  apiKey,
  toEmail,
  toName = "Valued Customer",
  orderCode,
  totalAmount,
  items = []
}) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #222222; font-size: 13px; color: #EEEEEE;">
        <strong>${item.name}</strong> (${item.selectedSize || 'Standard'}${item.selectedColor ? ` / ${item.selectedColor}` : ''})
        ${item.customName ? `<br><span style="font-size: 11px; color: #FF6B35;">Custom Name: ${item.customName}</span>` : ''}
        ${item.customNumber ? `<span style="font-size: 11px; color: #FF6B35;"> • #${item.customNumber}</span>` : ''}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #222222; font-size: 13px; text-align: center; color: #AAAAAA;">
        x${item.quantity}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #222222; font-size: 13px; text-align: right; font-weight: bold; color: #FFFFFF;">
        ₹${item.price * item.quantity}
      </td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmed — PRINTORA</title>
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
                <td style="padding: 36px 32px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <span style="display: inline-block; padding: 6px 16px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 20px; color: #10B981; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                      ✓ Payment Confirmed
                    </span>
                    <h2 style="margin: 16px 0 6px 0; font-size: 22px; font-weight: 800; color: #FFFFFF;">Payment Verified Successfully!</h2>
                    <p style="margin: 0; font-size: 13px; color: #888888;">Order ID: <strong style="color: #FF6B35;">${orderCode}</strong></p>
                  </div>

                  <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #CCCCCC;">
                    Hello ${toName},<br><br>
                    Great news! Your payment of <strong style="color: #FFFFFF;">₹${totalAmount}</strong> has been officially verified and confirmed by our PRINTORA administration team.
                  </p>

                  <div style="background-color: #0E0E0E; border: 1px solid #222222; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #FF6B35; text-transform: uppercase; letter-spacing: 1px;">Order Summary</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${itemsHtml}
                      <tr>
                        <td colspan="2" style="padding-top: 12px; font-size: 12px; color: #888888;">Delivery Charges</td>
                        <td style="padding-top: 12px; font-size: 12px; text-align: right; color: #10B981; font-weight: bold;">FREE (₹0)</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 8px; font-size: 14px; font-weight: bold; color: #FFFFFF;">Total Paid</td>
                        <td style="padding-top: 8px; font-size: 16px; text-align: right; color: #FF6B35; font-weight: 800;">₹${totalAmount}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #CCCCCC;">
                    Our production masters have queued your custom apparel & merchandise for high-definition digital printing and quality checks. We will notify you once dispatched with tracking details.
                  </p>

                  <div style="text-align: center;">
                    <a href="https://printoracustom.in/#account" style="display: inline-block; background-color: #FF6B35; color: #FFFFFF; text-decoration: none; font-size: 12px; font-weight: 700; padding: 14px 28px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">
                      Track Order Status
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0E0E0E; padding: 20px 30px; text-align: center; border-top: 1px solid #222222; font-size: 11px; color: #666666;">
                  © 2026 PRINTORA (printoracustom.in) • YOU IMAGINE. WE PRINT.<br>
                  Questions? Chat directly on WhatsApp: +91 8106992102
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
    subject: `✓ Payment Confirmed for Order ${orderCode} — PRINTORA`,
    htmlContent
  });
}

