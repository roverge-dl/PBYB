import { OAuth2Client } from 'google-auth-library'
import { inject } from '@adonisjs/core'
import env from '#start/env'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import PregnantMumProfile from '#models/pregnant_mum_profile'
import NurseProfile from '#models/nurse_profile'
import Referral from '#models/referral'

const googleClient = new OAuth2Client()

export interface GoogleAuthPayload {
  idToken: string
  role?: 'pregnant_mum' | 'nurse'
  referralCode?: string
}

@inject()
export default class GoogleAuthService {
  private googleClientId = env.get('GOOGLE_WEB_CLIENT_ID', '')

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'PB-'
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Verifies Google ID Token and logs in or registers user
   */
  async authenticate(payload: GoogleAuthPayload) {
    let email: string = ''
    let googleId: string = ''
    let firstName: string = 'Mama'
    let lastName: string = 'User'

    // Check for dev/mock ID token (e.g. "mock_google_id_token_...")
    if (payload.idToken.startsWith('mock_google_token_') || payload.idToken.startsWith('dev_token_')) {
      try {
        const rawPart = payload.idToken.replace(/^(mock_google_token_|dev_token_)/, '')
        const parsed = JSON.parse(Buffer.from(rawPart, 'base64').toString('utf-8'))
        email = parsed.email
        googleId = parsed.sub || `google-mock-${Date.now()}`
        firstName = parsed.given_name || 'Mama'
        lastName = parsed.family_name || 'User'
      } catch {
        email = 'google.user@example.com'
        googleId = `google-mock-${Date.now()}`
        firstName = 'Mama'
        lastName = 'User'
      }
    } else {
      let ticket
      try {
        ticket = await googleClient.verifyIdToken({
          idToken: payload.idToken,
          audience: this.googleClientId ? [this.googleClientId] : undefined,
        })
      } catch (error: any) {
        throw new Error(`Google authentication token invalid: ${error.message}`)
      }

      const googlePayload = ticket.getPayload()
      if (!googlePayload || !googlePayload.email) {
        throw new Error('Google payload did not contain a valid email address')
      }

      email = googlePayload.email.toLowerCase().trim()
      googleId = googlePayload.sub
      firstName = googlePayload.given_name || 'Mama'
      lastName = googlePayload.family_name || 'User'
    }

    email = email.toLowerCase().trim()

    return await db.transaction(async (trx) => {
      // 1. Try finding user by google_id or email
      let user = await User.query({ client: trx })
        .where('googleId', googleId)
        .orWhere('email', email)
        .first()

      let isNew = false

      if (!user) {
        // If it's a new user and role was not yet selected, require role selection
        if (!payload.role) {
          return {
            requiresRoleSelection: true,
            email,
            firstName,
            lastName,
          }
        }

        // Register new user via Google
        isNew = true
        let referrer: User | null = null
        if (payload.referralCode) {
          referrer = await User.query({ client: trx })
            .where('referralCode', payload.referralCode.trim().toUpperCase())
            .first()
        }

        user = new User()
        user.useTransaction(trx)
        user.firstName = firstName
        user.lastName = lastName
        user.email = email
        user.googleId = googleId
        user.role = payload.role || 'pregnant_mum'
        user.referralCode = this.generateReferralCode()
        user.referredBy = referrer ? referrer.id : null
        user.isPaid = user.role === 'nurse' // Affiliates are not required to pay
        user.isVerified = true
        user.isActive = true
        await user.save()

        // Create role profile
        if (user.role === 'pregnant_mum') {
          const mumProfile = new PregnantMumProfile()
          mumProfile.useTransaction(trx)
          mumProfile.userId = user.id
          mumProfile.dailyWaterTargetLiters = 2.5
          mumProfile.dailyGreenTargetServings = 2
          await mumProfile.save()
        } else if (user.role === 'nurse') {
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
      } else {
        // Existing user: Link google_id if not linked
        if (!user.googleId) {
          user.useTransaction(trx)
          user.googleId = googleId
          user.isVerified = true
          await user.save()
        }
      }

      // Load profile
      if (user.role === 'pregnant_mum') {
        await user.load('mumProfile')
      } else if (user.role === 'nurse') {
        await user.load('nurseProfile')
      }

      return {
        user,
        isNew,
      }
    })
  }
}
