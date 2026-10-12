import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import ReferralService from '#services/referral_service'
import { trackReferralSchema } from '#validators/referral'

@inject()
export default class ReferralController {
  constructor(protected referralService: ReferralService) {}

  /**
   * Get public referral leaderboard
   */
  async leaderboard({ response }: HttpContext) {
    try {
      const leaderboard = await this.referralService.getReferralLeaderboard()

      return response.ok({
        status: 'success',
        message: 'Referral leaderboard retrieved successfully',
        data: leaderboard,
      })
    } catch (error: any) {
      console.error('Leaderboard error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to retrieve leaderboard.',
        error: error.message,
      })
    }
  }

  /**
   * Verify referral code
   */
  async verifyCode({ request, response }: HttpContext) {
    try {
      const data = request.only(['referralCode'])

      const validatedData = await trackReferralSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Referral Code Validation Failed',
        })
      }

      return response.ok({
        status: 'success',
        message: 'Referral code is valid',
        data: {
          referralCode: data.referralCode,
          isValid: true,
        },
      })
    } catch (error: any) {
      console.error('Verify referral error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to verify referral code.',
        error: error.message,
      })
    }
  }
}
