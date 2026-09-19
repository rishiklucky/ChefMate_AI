const nodemailer = require('nodemailer');

/**
 * Send Password Reset OTP Email via Brevo API or SMTP
 */
exports.sendOtpEmail = async (toEmail, otp) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const brevoSmtpKey = process.env.BREVO_SMTP_KEY || process.env.SMTP_PASSWORD;
  const brevoSmtpUser = process.env.BREVO_SMTP_USER || process.env.SMTP_USER;
  const senderEmail = process.env.SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || 'no-reply@chefmateai.com';
  const senderName = process.env.SENDER_NAME || 'ChefMate AI';

  const subject = 'Your Password Reset OTP - ChefMate AI';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fff9f6; margin: 0; padding: 20px; color: #1c1917; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid rgba(234, 88, 12, 0.15); box-shadow: 0 10px 30px rgba(234, 88, 12, 0.08); }
        .header { text-align: center; margin-bottom: 24px; }
        .title { font-size: 22px; font-weight: 800; color: #1c1917; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #78716c; }
        .otp-box { background: linear-gradient(135deg, #fff3ec, #ffedd5); border: 2px dashed #ea580c; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; font-family: monospace; }
        .expiry { font-size: 12px; color: #9a3412; font-weight: 600; margin-top: 8px; }
        .footer { text-align: center; font-size: 12px; color: #a8a29e; margin-top: 24px; border-top: 1px solid #f5f5f4; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 class="title">ChefMate <span style="color: #ea580c;">AI</span></h2>
          <p class="subtitle">Password Reset Verification Code</p>
        </div>
        <p>Hello,</p>
        <p>We received a request to reset your password for your ChefMate AI account. Use the OTP code below to verify your request:</p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="expiry">⏱️ Valid for 10 minutes only</div>
        </div>
        <p style="font-size: 13px; color: #78716c;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ChefMate AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // Strategy 1: Brevo REST API v3 (Recommended for web servers / Cloud deployments)
  if (brevoApiKey) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail }],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[Brevo API] OTP email successfully sent to ${toEmail}. MessageID:`, data.messageId);
        return { success: true, messageId: data.messageId };
      } else {
        console.error('[Brevo API Error]:', data);
        // Fallback to SMTP if API fails
      }
    } catch (err) {
      console.error('[Brevo API Fetch Error]:', err.message);
    }
  }

  // Strategy 2: Brevo SMTP via Nodemailer
  if (brevoSmtpKey && brevoSmtpUser) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false, // true for 465, false for other ports
        auth: {
          user: brevoSmtpUser,
          pass: brevoSmtpKey,
        },
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });

      console.log(`[Brevo SMTP] OTP email sent to ${toEmail}. MessageID:`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (smtpErr) {
      console.error('[Brevo SMTP Error]:', smtpErr.message);
    }
  }

  // Fallback / Development mode when keys aren't configured in .env yet
  console.log('\n======================================================');
  console.log(`[DEV MODE - BREVO UNCONFIGURED] Password Reset OTP for ${toEmail}:`);
  console.log(`🔑 OTP CODE: ${otp}`);
  console.log('======================================================\n');

  return { success: true, isDevFallback: true };
};
