import React from 'react'
import { Head, Link } from '@inertiajs/react'

interface LeaderboardUser {
  rank: number
  userId: string
  fullName: string
  role: 'pregnant_mum' | 'nurse' | string
  totalReferrals: number
}

interface LeaderboardProps {
  leaderboard: LeaderboardUser[]
}

export default function Leaderboard({ leaderboard = [] }: LeaderboardProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <Head title="Referral Leaderboard - PBYB Challenge" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-3">
            🏆 Viral Referral Race
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Top Advocates Leaderboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Invite fellow mums and colleagues to build their blood. Earn ₦1,000 per verified sign-up and compete for top prizes!
          </p>
        </div>

        {/* Podium Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 items-end">
            {/* Rank 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm border-2 border-slate-300 mb-2">
                {leaderboard[1].fullName.slice(0, 2).toUpperCase()}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate w-full">{leaderboard[1].fullName}</h4>
              <p className="text-emerald-600 font-extrabold text-sm sm:text-base mt-1">{leaderboard[1].totalReferrals} invites</p>
            </div>

            {/* Rank 1 */}
            <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 p-5 rounded-3xl shadow-lg shadow-emerald-500/20 text-center flex flex-col items-center text-white transform -translate-y-2">
              <span className="text-3xl mb-1">👑</span>
              <div className="w-14 h-14 rounded-full bg-white text-emerald-700 font-extrabold flex items-center justify-center text-base border-4 border-emerald-200 mb-2">
                {leaderboard[0].fullName.slice(0, 2).toUpperCase()}
              </div>
              <h4 className="text-sm sm:text-base font-extrabold truncate w-full">{leaderboard[0].fullName}</h4>
              <p className="text-emerald-100 font-bold text-sm sm:text-base mt-1">{leaderboard[0].totalReferrals} invites</p>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full mt-2">1st Place</span>
            </div>

            {/* Rank 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm border-2 border-amber-300 mb-2">
                {leaderboard[2].fullName.slice(0, 2).toUpperCase()}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate w-full">{leaderboard[2].fullName}</h4>
              <p className="text-emerald-600 font-extrabold text-sm sm:text-base mt-1">{leaderboard[2].totalReferrals} invites</p>
            </div>
          </div>
        )}

        {/* List of ranks */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
          <div className="divide-y divide-slate-100">
            {leaderboard.map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-7 text-center font-bold text-sm ${user.rank <= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    #{user.rank}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{user.fullName}</h4>
                    <span className="text-[11px] font-medium text-slate-500 capitalize">
                      {user.role === 'pregnant_mum' ? 'Pregnant Mum' : 'Nurse'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-600">{user.totalReferrals}</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sign-ups</p>
                </div>
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No referrals recorded yet. Be the first to invite!
              </div>
            )}
          </div>
        </div>

        {/* Join CTA */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all"
          >
            Get Your Own Referral Link & Join Now
          </Link>
        </div>
      </div>
    </div>
  )
}
