import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ReferralService from '#services/referral_service'

@inject()
export default class WebController {
  constructor(protected referralService: ReferralService) {}

  /**
   * Render Get Started / Role Selection Page (Onboarding Step 1)
   */
  async getStarted({ inertia, request }: HttpContext) {
    const role = request.input('role', '')
    return (inertia as any).render('auth/get_started', { role })
  }

  /**
   * Render Register Page
   */
  async register({ inertia, request }: HttpContext) {
    const referralCode = request.input('ref', '')
    const role = request.input('role', 'pregnant_mum')
    return (inertia as any).render('auth/register', { referralCode, role })
  }

  /**
   * Render Login / Sign In Page
   */
  async login({ inertia }: HttpContext) {
    return (inertia as any).render('auth/login', {})
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
   * Render Public Referral Leaderboard Page
   */
  async leaderboard({ inertia }: HttpContext) {
    const leaderboard = await this.referralService.getReferralLeaderboard()
    return (inertia as any).render('referrals/leaderboard', { leaderboard })
  }

  /**
   * Render Pre-Challenge Hub
   */
  async preChallengeDashboard({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const referralStats = await this.referralService.getUserReferralStats(user.id)

    return (inertia as any).render('dashboard/pre_challenge', {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        isPaid: user.isPaid,
      },
      referralStats,
    })
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

    if (user?.isPaid && !request.input('force')) {
      return response.redirect('/dashboard')
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
    })
  }

  /**
   * Render Main Dashboard Screen (dashboard 2, Home Page 1, Home Page 2, and dashboard 11)
   */
  async dashboard({ inertia, request, auth }: HttpContext) {
    const user = await auth.use('web').authenticate()
    const referralStats = await this.referralService.getUserReferralStats(user.id)
    const showWelcome = request.input('welcome') === '1' || request.input('paid') === 'true'

    return (inertia as any).render('dashboard/index', {
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
      showWelcome,
    })
  }

  /**
   * Render Design System & Tokens Showcase
   */
  async designSystem({ inertia }: HttpContext) {
    return (inertia as any).render('design_system', {})
  }
}
