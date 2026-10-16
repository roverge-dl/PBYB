import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import PregnantMumProfile from '#models/pregnant_mum_profile'
import NurseProfile from '#models/nurse_profile'
import Referral from '#models/referral'
import MailService from '#services/mail_service'

export interface RegisterDTO {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  password?: string
  role: 'pregnant_mum' | 'nurse'
  referralCode?: string
}

export interface LoginDTO {
  email: string
  password?: string
}

export interface ResetPasswordDTO {
  email: string
  otp: string
  password?: string
}

export interface ChangePasswordDTO {
  oldPassword?: string
  newPassword?: string
}

@inject()
export default class AuthService {
  constructor(protected mailService: MailService) {}

  /**
   * Generates an 8-character unique alphanumeric referral code
   */
  private generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'PB-'
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Registers a new user (Pregnant Mum or Nurse)
   */
  async register(data: RegisterDTO) {
    return await db.transaction(async (trx) => {
      let referrer: User | null = null
      if (data.referralCode) {
        referrer = await User.query({ client: trx })
          .where('referralCode', data.referralCode.trim().toUpperCase())
          .first()
      }

      const user = new User()
      user.useTransaction(trx)
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.email = data.email.toLowerCase().trim()
      user.phone = data.phoneNumber || null
      user.password = data.password || null
      user.role = data.role
      user.referralCode = this.generateReferralCode()
      user.referredBy = referrer ? referrer.id : null
      user.isPaid = data.role === 'nurse' // Affiliates are not required to pay
      user.isVerified = false
      user.isActive = true

      await user.save()

      if (data.role === 'pregnant_mum') {
        const mumProfile = new PregnantMumProfile()
        mumProfile.useTransaction(trx)
        mumProfile.userId = user.id
        mumProfile.dailyWaterTargetLiters = 2.5
        mumProfile.dailyGreenTargetServings = 2
        await mumProfile.save()
      } else if (data.role === 'nurse') {
        const nurseProfile = new NurseProfile()
        nurseProfile.useTransaction(trx)
        nurseProfile.userId = user.id
        await nurseProfile.save()
      }

      if (referrer) {
        const referral = new Referral()
        referral.useTransaction(trx)
        referral.referrerId = referrer.id
        referral.referredId = user.id
        referral.referralCode = referrer.referralCode
        referral.status = 'pending'
        await referral.save()
      }

      // Generate 6-digit OTP for email verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = DateTime.now().plus({ minutes: 15 })

      await trx.table('password_reset_tokens').insert({
        id: crypto.randomUUID(),
        email: user.email,
        otp,
        expires_at: expiresAt.toSQL(),
        is_used: false,
        created_at: DateTime.now().toSQL(),
      })

      // Send email via AWS SES (non-blocking)
      this.mailService.sendOtpMail(user.email, user.firstName, otp).catch(console.error)

      return {
        user,
      }
    })
  }

  /**
   * Generates and sends a new email verification code
   */
  async sendEmailVerificationOtp(email: string) {
    const user = await User.findBy('email', email.toLowerCase().trim())
    if (!user) {
      return true
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = DateTime.now().plus({ minutes: 15 })

    await db.table('password_reset_tokens').insert({
      id: crypto.randomUUID(),
      email: user.email,
      otp,
      expires_at: expiresAt.toSQL(),
      is_used: false,
      created_at: DateTime.now().toSQL(),
    })

    await this.mailService.sendOtpMail(user.email, user.firstName, otp)
    return true
  }

  /**
   * Verifies user email with OTP code
   */
  async verifyEmail(email: string, otp: string) {
    const cleanEmail = email.toLowerCase().trim()
    const cleanOtp = otp.trim()

    const token = await db
      .from('password_reset_tokens')
      .where('email', cleanEmail)
      .where('otp', cleanOtp)
      .where('is_used', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .orderBy('created_at', 'desc')
      .first()

    if (!token) {
      throw new Error('Invalid or expired verification code.')
    }

    const user = await User.findByOrFail('email', cleanEmail)
    user.isVerified = true
    await user.save()

    // Mark token as used
    await db
      .from('password_reset_tokens')
      .where('id', token.id)
      .update({ is_used: true, updated_at: DateTime.now().toSQL() })

    return user
  }

  /**
   * Authenticates an existing user
   */
  async login(data: LoginDTO) {
    const user = await User.verifyCredentials(data.email.toLowerCase().trim(), data.password || '')

    if (user.role === 'pregnant_mum') {
      await user.load('mumProfile')
    } else if (user.role === 'nurse') {
      await user.load('nurseProfile')
    }

    return {
      user,
    }
  }

  /**
   * Sends password reset OTP via AWS SES
   */
  async forgotPassword(email: string) {
    const user = await User.findBy('email', email.toLowerCase().trim())
    if (!user) {
      // Return true to prevent account enumeration
      return true
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = DateTime.now().plus({ minutes: 15 })

    // Store in password_reset_tokens
    await db.table('password_reset_tokens').insert({
      id: crypto.randomUUID(),
      email: user.email,
      otp,
      expires_at: expiresAt.toSQL(),
      is_used: false,
      created_at: DateTime.now().toSQL(),
    })

    // Send email via AWS SES
    await this.mailService.sendOtpMail(user.email, user.firstName, otp)
    return true
  }

  /**
   * Resets password using OTP
   */
  async resetPassword(data: ResetPasswordDTO) {
    const { email, otp, password } = data

    const resetToken = await db
      .from('password_reset_tokens')
      .where('email', email.toLowerCase().trim())
      .where('otp', otp.trim())
      .where('is_used', false)
      .where('expires_at', '>', DateTime.now().toSQL())
      .orderBy('created_at', 'desc')
      .first()

    if (!resetToken) {
      throw new Error('Invalid or expired verification code.')
    }

    const user = await User.findByOrFail('email', email.toLowerCase().trim())
    user.password = password || ''
    await user.save()

    // Mark token as used
    await db
      .from('password_reset_tokens')
      .where('id', resetToken.id)
      .update({ is_used: true, updated_at: DateTime.now().toSQL() })

    return true
  }

  /**
   * Changes password for authenticated user
   */
  async changePassword(user: User, data: ChangePasswordDTO) {
    const isOldPasswordValid = await hash.verify(user.password || '', data.oldPassword || '')
    if (!isOldPasswordValid) {
      throw new Error('Current password does not match.')
    }

    user.password = data.newPassword || ''
    await user.save()
    return true
  }

  /**
   * Gets user profile and account details
   */
  async getMe(userId: string) {
    const user = await User.findOrFail(userId)

    if (user.role === 'pregnant_mum') {
      await user.load('mumProfile')
    } else if (user.role === 'nurse') {
      await user.load('nurseProfile')
    }

    return user
  }
}
