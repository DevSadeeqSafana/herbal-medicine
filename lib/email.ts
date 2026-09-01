import nodemailer from 'nodemailer';

// OAuth2 configuration from environment variables
const oauth2Config = {
  user: process.env.EMAIL_USER!,
  clientId: process.env.OAUTH_CLIENT_ID!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
};

/**
 * Creates and returns a nodemailer transporter with OAuth2 authentication
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: oauth2Config.user,
      clientId: oauth2Config.clientId,
      clientSecret: oauth2Config.clientSecret,
      refreshToken: oauth2Config.refreshToken,
    },
  });
}

/**
 * Sends a verification code email to the user
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Email Verification - Cosmopolitan University',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        🌿 Cosmopolitan University
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                        Herbal Medicine Programmes
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                        Verify Your Email Address
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for beginning your registration with Cosmopolitan University's Herbal Medicine Programme. To continue with your application, please verify your email address by entering the code below:
                      </p>

                      <!-- Verification Code Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center" style="padding: 30px; background-color: #f9fafb; border: 2px dashed #16a34a; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                              Your Verification Code
                            </p>
                            <p style="margin: 0; color: #16a34a; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                              ${code}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        This code will expire in <strong>10 minutes</strong>. If you didn't request this verification, please ignore this email.
                      </p>

                      <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                          <strong>Security Note:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Best regards,<br>
                        <strong style="color: #16a34a;">Cosmopolitan University Abuja</strong><br>
                        Herbal Medicine Department
                      </p>

                      <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        This is an automated email. Please do not reply to this message. For assistance, contact us at
                        <a href="mailto:${process.env.EMAIL_REPLY_TO}" style="color: #16a34a; text-decoration: none;">${process.env.EMAIL_REPLY_TO}</a>
                      </p>

                      <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 12px;">
                        © ${new Date().getFullYear()} Cosmopolitan University Abuja. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
Cosmopolitan University - Email Verification

Thank you for beginning your registration with Cosmopolitan University's Herbal Medicine Programme.

Your Verification Code: ${code}

This code will expire in 10 minutes. Please enter this code on the verification page to continue with your registration.

If you didn't request this verification, please ignore this email.

Security Note: Never share this code with anyone. Our team will never ask for your verification code.

Best regards,
Cosmopolitan University Abuja
Herbal Medicine Department

---
This is an automated email. For assistance, contact us at ${process.env.EMAIL_REPLY_TO}
© ${new Date().getFullYear()} Cosmopolitan University Abuja. All rights reserved.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Verification email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Sends a welcome email after successful registration
 */
export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  programmeName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Welcome to Cosmopolitan University - Registration Confirmed',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Cosmopolitan University</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <tr>
                    <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎉 Welcome!</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                        Dear ${firstName},
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Congratulations! Your registration for the <strong>${programmeName}</strong> programme has been successfully confirmed.
                      </p>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        We're excited to have you join our community of students pursuing excellence in herbal medicine education.
                      </p>

                      <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 8px; border: 1px solid #16a34a;">
                        <h3 style="margin: 0 0 15px 0; color: #16a34a; font-size: 18px;">Next Steps:</h3>
                        <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                          <li>Check your email for payment confirmation</li>
                          <li>You will receive programme details and start date information soon</li>
                          <li>Prepare any required documents for orientation</li>
                        </ol>
                      </div>

                      <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        If you have any questions, please don't hesitate to contact us at
                        <a href="mailto:${process.env.EMAIL_REPLY_TO}" style="color: #16a34a; text-decoration: none;">${process.env.EMAIL_REPLY_TO}</a>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        Best regards,<br>
                        <strong style="color: #16a34a;">Cosmopolitan University Abuja</strong>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
Welcome to Cosmopolitan University!

Dear ${firstName},

Congratulations! Your registration for the ${programmeName} programme has been successfully confirmed.

We're excited to have you join our community of students pursuing excellence in herbal medicine education.

Next Steps:
1. Check your email for payment confirmation
2. You will receive programme details and start date information soon
3. Prepare any required documents for orientation

If you have any questions, please contact us at ${process.env.EMAIL_REPLY_TO}

Best regards,
Cosmopolitan University Abuja
      `,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Sends an application received confirmation email
 */
export async function sendApplicationReceivedEmail(
  email: string,
  firstName: string,
  programmeName: string,
  session: string,
  transactionRef: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Application Received - Cosmopolitan University',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                  <tr>
                    <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        ✅ Application Received!
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                        Cosmopolitan University Abuja
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                        Dear ${firstName},
                      </h2>

                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Thank you for submitting your application to Cosmopolitan University! We have successfully received your application for the <strong>${programmeName}</strong> programme.
                      </p>

                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td style="padding: 25px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <h3 style="margin: 0 0 15px 0; color: #16a34a; font-size: 18px;">Application Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Programme:</td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: bold;">${programmeName}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Session:</td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: bold;">${session}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction Ref:</td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: bold;">${transactionRef}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 8px; border: 1px solid #16a34a;">
                        <h3 style="margin: 0 0 15px 0; color: #16a34a; font-size: 18px;">📋 Next Steps:</h3>
                        <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                          <li>Complete your payment to confirm your registration</li>
                          <li>Once payment is confirmed, you will receive a confirmation email</li>
                          <li>Keep this transaction reference for your records: <strong>${transactionRef}</strong></li>
                        </ol>
                      </div>

                      <p style="margin: 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        If you have any questions, contact us at
                        <a href="mailto:${process.env.EMAIL_REPLY_TO}" style="color: #16a34a; text-decoration: none; font-weight: bold;">${process.env.EMAIL_REPLY_TO}</a>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        Best regards,<br>
                        <strong style="color: #16a34a;">Cosmopolitan University Abuja</strong>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
Application Received - Cosmopolitan University

Dear ${firstName},

Thank you for submitting your application to Cosmopolitan University! We have successfully received your application for the ${programmeName} programme.

APPLICATION DETAILS:
Programme: ${programmeName}
Session: ${session}
Transaction Reference: ${transactionRef}

NEXT STEPS:
1. Complete your payment to confirm your registration
2. Once payment is confirmed, you will receive a confirmation email
3. Keep this transaction reference for your records: ${transactionRef}

If you have any questions, contact us at ${process.env.EMAIL_REPLY_TO}

Best regards,
Cosmopolitan University Abuja
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Application confirmation email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending application confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  email: string,
  firstName: string,
  programmeName: string,
  amount: number,
  transactionRef: string
) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Payment Successful - Cosmopolitan University Abuja',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ Payment Successful!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-top: 0;">
        Dear ${firstName},
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        Congratulations! Your payment has been successfully processed and your registration for <strong>${programmeName}</strong> is now confirmed.
      </p>

      <!-- Payment Details -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <h2 style="color: #1f2937; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Payment Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Programme:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${programmeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction Ref:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${transactionRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="display: inline-block; padding: 4px 12px; background-color: #d1fae5; color: #065f46; border-radius: 12px; font-size: 12px; font-weight: 600;">Successful</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Next Steps -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 30px 0;">
        <h3 style="color: #1e40af; font-size: 16px; margin-top: 0; margin-bottom: 10px;">Next Steps</h3>
        <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
          <li style="margin-bottom: 8px;">You will receive your admission letter via email within 2-3 business days</li>
          <li style="margin-bottom: 8px;">Check your email regularly for further instructions</li>
          <li style="margin-bottom: 8px;">Keep this transaction reference for your records</li>
        </ul>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        If you have any questions or concerns, please don't hesitate to contact us at <a href="mailto:${process.env.EMAIL_REPLY_TO}" style="color: #10b981; text-decoration: none;">${process.env.EMAIL_REPLY_TO}</a>
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 0;">
        Best regards,<br>
        <strong>Cosmopolitan University Abuja</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        © ${new Date().getFullYear()} Cosmopolitan University Abuja. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Dear ${firstName},

Congratulations! Your payment has been successfully processed and your registration for ${programmeName} is now confirmed.

PAYMENT DETAILS:
Programme: ${programmeName}
Amount Paid: ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Transaction Reference: ${transactionRef}
Status: Successful

NEXT STEPS:
1. You will receive your admission letter via email within 2-3 business days
2. Check your email regularly for further instructions
3. Keep this transaction reference for your records

If you have any questions, contact us at ${process.env.EMAIL_REPLY_TO}

Best regards,
Cosmopolitan University Abuja
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Payment success email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending payment success email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  email: string,
  firstName: string,
  programmeName: string,
  amount: number,
  transactionRef: string,
  reason?: string
) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Payment Failed - Cosmopolitan University Abuja',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">❌ Payment Failed</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-top: 0;">
        Dear ${firstName},
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        Unfortunately, your payment for <strong>${programmeName}</strong> could not be processed successfully.
      </p>

      <!-- Transaction Details -->
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <h2 style="color: #991b1b; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Transaction Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Programme:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${programmeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction Ref:</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${transactionRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
            <td style="padding: 8px 0; text-align: right;">
              <span style="display: inline-block; padding: 4px 12px; background-color: #fee2e2; color: #991b1b; border-radius: 12px; font-size: 12px; font-weight: 600;">Failed</span>
            </td>
          </tr>
          ${reason ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reason:</td>
            <td style="padding: 8px 0; color: #991b1b; font-size: 14px; font-weight: 500; text-align: right;">${reason}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- What to do next -->
      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 30px 0;">
        <h3 style="color: #92400e; font-size: 16px; margin-top: 0; margin-bottom: 10px;">What to do next</h3>
        <ul style="margin: 0; padding-left: 20px; color: #92400e;">
          <li style="margin-bottom: 8px;">Check if your payment method has sufficient funds</li>
          <li style="margin-bottom: 8px;">Verify your card details are correct</li>
          <li style="margin-bottom: 8px;">Try using a different payment method</li>
          <li style="margin-bottom: 8px;">Contact your bank if the problem persists</li>
        </ul>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        You can retry the payment by visiting our registration portal. Your registration information has been saved and will be prepopulated for you.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333333;">
        If you need assistance or have questions, please contact us at <a href="mailto:${process.env.EMAIL_REPLY_TO}" style="color: #ef4444; text-decoration: none;">${process.env.EMAIL_REPLY_TO}</a>
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 0;">
        Best regards,<br>
        <strong>Cosmopolitan University Abuja</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        © ${new Date().getFullYear()} Cosmopolitan University Abuja. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: `
Dear ${firstName},

Unfortunately, your payment for ${programmeName} could not be processed successfully.

TRANSACTION DETAILS:
Programme: ${programmeName}
Amount: ₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Transaction Reference: ${transactionRef}
Status: Failed
${reason ? `Reason: ${reason}` : ''}

WHAT TO DO NEXT:
1. Check if your payment method has sufficient funds
2. Verify your card details are correct
3. Try using a different payment method
4. Contact your bank if the problem persists

You can retry the payment by visiting our registration portal. Your registration information has been saved and will be prepopulated for you.

If you need assistance, contact us at ${process.env.EMAIL_REPLY_TO}

Best regards,
Cosmopolitan University Abuja
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Payment failed email sent:', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

