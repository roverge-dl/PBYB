import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Referral from '#models/referral'

export interface LeaderboardEntry {
  rank: number
  userId: string
  fullName: string
  role: string
  totalReferrals: number
}

export default class ReferralService {
  /**
   * Fetch real-time referral leaderboard (top referrers with approved registrations)
   */
  async getReferralLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
    // Query users with count of approved referrals
    const results = await db
      .from('referrals')
      .join('users', 'referrals.referrer_id', 'users.id')
      .where('referrals.status', 'approved')
      .groupBy('users.id', 'users.first_name', 'users.last_name', 'users.role')
      .select('users.id as user_id', 'users.first_name', 'users.last_name', 'users.role')
      .count('referrals.id as total_referrals')
      .orderBy('total_referrals', 'desc')
      .limit(limit)

    return results.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      fullName: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      role: row.role,
      totalReferrals: Number(row.total_referrals || 0),
    }))
  }

  /**
   * Get referral stats for an individual user
   */
  async getUserReferralStats(userId: string) {
    const user = await User.findOrFail(userId)

    const [approvedCount, pendingCount, totalEarnedResult] = await Promise.all([
      Referral.query().where('referrer_id', user.id).where('status', 'approved').count('* as total'),
      Referral.query().where('referrer_id', user.id).where('status', 'pending').count('* as total'),
      Referral.query().where('referrer_id', user.id).where('status', 'approved').sum('commission_amount as total'),
    ])

    const successfulReferrals = Number(approvedCount[0]?.$extras?.total || 0)
    const pendingReferrals = Number(pendingCount[0]?.$extras?.total || 0)
    const commissionEarned = Number(totalEarnedResult[0]?.$extras?.total || 0)

    return {
      userId: user.id,
      referralCode: user.referralCode,
      referralLink: `https://pbyb.com/join?ref=${user.referralCode}`,
      successfulReferrals,
      pendingReferrals,
      commissionEarned,
    }
  }
}
