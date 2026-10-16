import env from '#start/env'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

export interface SendMailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export default class MailService {
  private sesClient: SESClient
  private senderEmail: string

  constructor() {
    this.senderEmail = env.get('AWS_SES_SENDER', env.get('SENDER_EMAIL', 'no-reply@roverge.com')) as string
    this.sesClient = new SESClient({
      region: env.get('AWS_SES_REGION', env.get('AWS_REGION', 'eu-west-1')) as string,
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID', '') as string,
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY', '') as string,
      },
    })
  }

  /**
   * Sends an email via AWS SES
   */
  public async sendMail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: any }> {
    const { to, subject, html, text } = options
    const toAddresses = Array.isArray(to) ? to : [to]

    const command = new SendEmailCommand({
      Source: `PBYB Challenge <${this.senderEmail}>`,
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: html,
            Charset: 'UTF-8',
          },
          ...(text ? { Text: { Data: text, Charset: 'UTF-8' } } : {}),
        },
      },
    })

    try {
      const response = await this.sesClient.send(command)
      return { success: true, messageId: response.MessageId }
    } catch (error: any) {
      console.error('Failed to send email via AWS SES:', error)
      return { success: false, error: error.message || error }
    }
  }

  /**
   * Template helper: Send Registration Confirmation / Receipt
   */
  public async sendRegistrationReceipt(email: string, fullName: string, amount: number, reference: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2e7d32;">Welcome to the Pregnancy Build Your Blood (PBYB) Challenge!</h2>
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Thank you for registering. Your payment of <strong>₦${amount.toLocaleString()}</strong> has been successfully processed.</p>
        <p><strong>Payment Reference:</strong> ${reference}</p>
        <p>You can now access your dashboard, complete your baseline profile, and invite friends with your unique referral link.</p>
        <p style="margin-top: 30px;">Best regards,<br/>The PBYB Medical & Support Team</p>
      </div>
    `
    return this.sendMail({
      to: email,
      subject: 'Registration Confirmed - PBYB Challenge',
      html,
    })
  }

  public async sendOtpMail(email: string, firstName: string, otp: string) {
    const formattedOtp = otp ? otp.split('').join(' ') : ''
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the PBYB Challenge</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #222222;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f4f8; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 28px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with Soft Gradient Glow & BirthSafe Brand -->
          <tr>
            <td align="center" style="padding: 48px 32px 32px 32px; background: linear-gradient(180deg, #fceeff 0%, #ffffff 100%);">
              <!-- BirthSafe Icon Graphic -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <img src="https://birthsafeng.com/images/birthsafe-logo.png" alt="BirthSafe" width="70" height="70" style="display: block; border: 0; outline: none; margin: 0 auto; object-fit: contain;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.5px; color: #800090; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                      <span style="color: #800090; font-size: 22px; font-weight: 900; vertical-align: middle; margin-right: 2px;">+</span><span style="color: #2b7bb9; font-weight: 700;">BIRTH</span><span style="color: #800090; font-weight: 800;">SAFE</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Body -->
          <tr>
            <td style="padding: 10px 44px 36px 44px;">
              <p style="margin: 0 0 28px 0; font-size: 17px; font-weight: 600; color: #1e1e1e;">
                Hello ${firstName || 'there'},
              </p>

              <h1 style="margin: 0 0 24px 0; font-size: 21px; font-weight: 800; color: #151515; line-height: 1.35; letter-spacing: -0.2px;">
                Welcome to the PBYB Challenge!
              </h1>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #4a4a4a;">
                We're glad to have you join us in making a difference in the lives of pregnant women.
              </p>

              <p style="margin: 0 0 32px 0; font-size: 15px; line-height: 1.65; color: #4a4a4a;">
                To complete your registration and secure your account, please use the verification code below:
              </p>

              <!-- Verification Code Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 10px 0 36px 0;">
                <tr>
                  <td align="center" style="background-color: #f1f8fe; border: 1.5px solid #d4e8fc; border-radius: 18px; padding: 28px 20px;">
                    <span style="font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #1c2430; font-family: 'Courier New', Courier, monospace, sans-serif; display: inline-block;">
                      ${formattedOtp || otp}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                If you did not request this code, please ignore this email. Your account remains safe and no action is required.
              </p>

              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                Sending you love and healthy steps,<br/>
                <strong style="color: #1a1a1a; font-weight: 700;">The Birthsafe Team</strong>
              </p>
            </td>
          </tr>

          <!-- Deep Purple Footer -->
          <tr>
            <td style="background-color: #6b007b; padding: 36px 28px; text-align: center; color: #ffffff;">
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #f5dcf8; opacity: 0.95;">
                If you have any questions or need assistance, please reach out to us at <a href="mailto:Hello@birthsafe.co" style="color: #ffffff; text-decoration: underline; font-weight: 500;">Hello@birthsafe.co</a>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 1.5; color: #f5dcf8; opacity: 0.95;">
                visit <a href="https://birthsafeng.com" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: 500;">https://birthsafeng.com</a>, or call <a href="tel:+2349013140040" style="color: #ffffff; text-decoration: underline; font-weight: 500;">+234 901 314 0040</a>.
              </p>

              <!-- Social Media Pill Icons -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 20px auto;">
                <tr>
                  <td align="center" style="padding: 0 6px;">
                    <a href="https://facebook.com/birthsafeng" target="_blank" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; border-radius: 50%; background-color: #ffffff; text-align: center; text-decoration: none; color: #6b007b; font-weight: bold; font-size: 15px;">f</a>
                  </td>
                  <td align="center" style="padding: 0 6px;">
                    <a href="https://twitter.com/birthsafeng" target="_blank" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; border-radius: 50%; background-color: #ffffff; text-align: center; text-decoration: none; color: #6b007b; font-weight: bold; font-size: 14px;">𝕏</a>
                  </td>
                  <td align="center" style="padding: 0 6px;">
                    <a href="https://instagram.com/birthsafeng" target="_blank" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; border-radius: 50%; background-color: #ffffff; text-align: center; text-decoration: none; color: #6b007b; font-weight: bold; font-size: 15px;">ig</a>
                  </td>
                  <td align="center" style="padding: 0 6px;">
                    <a href="https://linkedin.com/company/birthsafeng" target="_blank" style="display: inline-block; width: 34px; height: 34px; line-height: 34px; border-radius: 50%; background-color: #ffffff; text-align: center; text-decoration: none; color: #6b007b; font-weight: bold; font-size: 14px;">in</a>
                  </td>
                </tr>
              </table>

              <!-- Footer Brand Logo Text -->
              <div style="font-size: 17px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff; margin-bottom: 8px;">
                <span style="font-size: 18px; font-weight: 900; vertical-align: middle;">+</span>BIRTHSAFE
              </div>

              <!-- Copyright -->
              <p style="margin: 0; font-size: 11px; color: #f0c5f5; opacity: 0.85;">
                @ copyright 2026 BirthSafe Nigeria. All right reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
    return this.sendMail({
      to: email,
      subject: 'Welcome to the PBYB Challenge - Verification Code',
      html,
    })
  }
}
