import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ReferralService from '#services/referral_service'

@inject()
export default class WebController {
  constructor(protected referralService: ReferralService) {}

  /**
   * Render Register Page
   */
  async register({ inertia, request }: HttpContext) {
    const referralCode = request.input('ref', '')
    return inertia.render('auth/register', { referralCode })
  }

  /**
   * Render Public Referral Leaderboard Page
   */
  async leaderboard({ inertia }: HttpContext) {
    const leaderboard = await this.referralService.getReferralLeaderboard()
    return inertia.render('referrals/leaderboard', { leaderboard })
  }

  /**
   * Render Pre-Challenge Hub
   */
  async preChallengeDashboard({ auth, inertia }: HttpContext) {
    const user = auth.getUserOrFail()
    const referralStats = await this.referralService.getUserReferralStats(user.id)

    return inertia.render('dashboard/pre_challenge', {
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
}
