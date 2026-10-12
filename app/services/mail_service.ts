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

  /**
   * Template helper: Send Verification / OTP Email
   */
  public async sendOtpMail(email: string, firstName: string, otp: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2e7d32;">Verify Your PBYB Account</h2>
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Your one-time verification code is:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1b5e20; padding: 12px 0;">${otp}</div>
        <p>This code expires in 10 minutes. If you did not make this request, please ignore this email.</p>
        <p style="margin-top: 30px;">Best regards,<br/>The PBYB Team</p>
      </div>
    `
    return this.sendMail({
      to: email,
      subject: 'Your PBYB Verification Code',
      html,
    })
  }
}
