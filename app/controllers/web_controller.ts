import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import ReferralService from '#services/referral_service'

@inject()
export default class WebController {
  constructor(protected referralService: ReferralService) {}

  /**
   * Render Get Started / Role Selection Page (Onboarding Step 1)
   */
  async getStarted({ inertia, request, auth, response }: HttpContext) {
    if (await auth.use('web').check()) {
      return response.redirect('/referrals')
    }
    const role = request.input('role', '')
    return (inertia as any).render('auth/get_started', { role })
  }

  /**
   * Render Register Page
   */
  async register({ inertia, request, auth, response }: HttpContext) {
    if (await auth.use('web').check()) {
      return response.redirect('/referrals')
    }
    const referralCode = request.input('ref', '')
    const role = request.input('role', 'pregnant_mum')
    return (inertia as any).render('auth/register', {
      referralCode,
      role,
      googleClientId: env.get('GOOGLE_WEB_CLIENT_ID', ''),
    })
  }

  /**
   * Render Login / Sign In Page
   */
  async login({ inertia, auth, response }: HttpContext) {
    if (await auth.use('web').check()) {
      return response.redirect('/referrals')
    }
    return (inertia as any).render('auth/login', {
      googleClientId: env.get('GOOGLE_WEB_CLIENT_ID', ''),
    })
  }

  /**
   * Render Forgot Password Page
   */
  async forgotPassword({ inertia }: HttpContext) {
    return (inertia as any).render('auth/forgot_password', {})
  }

  /**
   * Render OTP Verification Page (Step 2 of Password Reset)
   */
  async verifyOtp({ inertia, request }: HttpContext) {
    const email = request.input('email', '')
    return (inertia as any).render('auth/verify_otp', { email })
  }

  /**
   * Render Reset Password Page (Step 3 of Password Reset — new password only)
   */
  async resetPassword({ inertia, request }: HttpContext) {
    const email = request.input('email', '')
    const otp = request.input('otp', '')
    return (inertia as any).render('auth/reset_password', { email, otp })
  }

  /**
   * Render Public / Authenticated Referral Leaderboard Page
   */
  async leaderboard({ inertia, auth }: HttpContext) {
    const isAuth = await auth.use('web').check()
    const user = isAuth ? auth.use('web').user : null
    const leaderboard = await this.referralService.getReferralLeaderboard()

    return (inertia as any).render('referrals/leaderboard', {
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            referralCode: user.referralCode,
            isPaid: user.isPaid,
            initials: user.initials,
          }
        : null,
      leaderboard,
    })
  }

  /**
   * Render Dedicated Referral Page (for Affiliates and Advocates)
   */
  async referrals({ inertia, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const referralStats = await this.referralService.getUserReferralStats(user.id)
    const referrals = await this.referralService.getUserReferrals(user.id)

    return (inertia as any).render('referrals/index', {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        isPaid: user.isPaid,
        initials: user.initials,
      },
      referralStats,
      referrals,
    })
  }

  async preChallengeDashboard({ response }: HttpContext) {
    // Phase 2: Pregnant mum pre-challenge dashboard is temporarily hidden; redirect everyone to referrals
    return response.redirect('/referrals')
  }

  /**
   * Render Email Verification Page with OTP (Post-signup)
   */
  async verifyEmail({ inertia, request, auth }: HttpContext) {
    const email = request.input('email', auth.user?.email || '')
    return (inertia as any).render('auth/verify_email', { email })
  }

  /**
   * Render Paywall / Payment Screen (dashboard 10)
   */
  async payment({ inertia, request, auth, response }: HttpContext) {
    const isAuth = await auth.use('web').check()
    const user = isAuth ? auth.use('web').user : null

    // Affiliates are not required to pay; redirect them directly to their referral page
    if (user?.role === 'nurse') {
      return response.redirect('/referrals')
    }

    const reference = (request.input('reference') || request.input('trxref') || '').trim()

    if (user?.isPaid && !reference && !request.input('force')) {
      return response.redirect('/referrals')
    }

    return (inertia as any).render('payment/payment', {
      user: user
        ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isPaid: user.isPaid,
            isVerified: user.isVerified,
            role: user.role,
          }
        : null,
      email: user?.email || request.input('email', ''),
      reference,
      paystackPublicKey: env.get('PAYSTACK_PUBLIC_KEY', ''),
    })
  }

  /**
   * Render Main Dashboard Screen (Exclusively for Pregnant Mothers)
   * Note: Hidden for Phase 1, redirected to /referrals. Preserved for Phase 2.
   */
  async dashboard({ response }: HttpContext) {
    return response.redirect('/referrals')
  }

  /**
   * Render Design System & Tokens Showcase
   */
  async designSystem({ inertia }: HttpContext) {
    return (inertia as any).render('design_system', {})
  }
}
