import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { PortalLayout, PortalUser } from '../../components/layout/PortalLayout'
import { Trophy, Crown, ArrowLeft, Users, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LeaderboardUser {
  rank: number
  userId: string
  fullName: string
  role: 'pregnant_mum' | 'nurse' | string
  totalReferrals: number
}

interface LeaderboardProps {
  user?: PortalUser | null
  leaderboard?: LeaderboardUser[]
}

export default function Leaderboard({ user = null, leaderboard = [] }: LeaderboardProps) {
  // Demo mock podium if empty to preserve exact Figma aesthetics
  const displayLeaderboard = leaderboard.length > 0
    ? leaderboard
    : [
        { rank: 1, userId: '1', fullName: 'Amina Yusuf', role: 'nurse', totalReferrals: 24 },
        { rank: 2, userId: '2', fullName: 'Maya Chen', role: 'pregnant_mum', totalReferrals: 21 },
        { rank: 3, userId: '3', fullName: 'Ella Wilson', role: 'nurse', totalReferrals: 19 },
        { rank: 4, userId: '4', fullName: 'Priya Sharma', role: 'nurse', totalReferrals: 16 },
        { rank: 5, userId: '5', fullName: 'Grace Okafor', role: 'pregnant_mum', totalReferrals: 14 },
        { rank: 6, userId: '6', fullName: 'Sofia Martinez', role: 'nurse', totalReferrals: 12 },
        { rank: 7, userId: '7', fullName: 'Chloe Brown', role: 'pregnant_mum', totalReferrals: 10 },
      ]

  const top1 = displayLeaderboard.find((u) => u.rank === 1) || displayLeaderboard[0]
  const top2 = displayLeaderboard.find((u) => u.rank === 2) || displayLeaderboard[1]
  const top3 = displayLeaderboard.find((u) => u.rank === 3) || displayLeaderboard[2]

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return (name || 'US').slice(0, 2).toUpperCase()
  }

  // Calculate display points (total referrals * 100 or ₦1,000 commission)
  const getPoints = (referrals: number) => {
    return referrals * 100
  }

  return (
    <PortalLayout user={user} activeTab="leaderboard">
      <Head title="Leaderboard - PBYB Challenge" />

      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Leaderboard
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Top community advocates and maternal health champions.
            </p>
          </div>

          <Link
            href="/referrals"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>My Referrals</span>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. Podium Top 3 (Matching Figma Leaderboard.png) */}
        {/* ========================================================= */}
        {displayLeaderboard.length >= 3 && (
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-md mx-auto text-center">
              {/* Rank 2 (Left) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white border-2 border-neutral-200 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#E7F5FC] text-[#23536A] flex items-center justify-center text-sm sm:text-base font-bold">
                      {getInitials(top2.fullName)}
                    </div>
                  </div>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-400 text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white">
                    2
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate w-full mt-1">
                  {top2.fullName}
                </h4>
                <div className="mt-1 px-3 py-1 bg-[#F7EEF8] rounded-xl">
                  <span className="font-extrabold text-xs sm:text-sm text-[#800090]">
                    {getPoints(top2.totalReferrals).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-medium">points</span>
                </div>
              </div>

              {/* Rank 1 (Center with Gold Crown) */}
              <div className="flex flex-col items-center transform -translate-y-2">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-400 mb-1" />
                <div className="relative mb-2">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white border-2 border-amber-400 shadow-md flex items-center justify-center ring-4 ring-amber-100">
                    <div className="w-full h-full rounded-full bg-[#800090] text-white flex items-center justify-center text-base sm:text-lg font-extrabold">
                      {getInitials(top1.fullName)}
                    </div>
                  </div>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
                    1
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 truncate w-full mt-1">
                  {top1.fullName}
                </h4>
                <div className="mt-1 px-3.5 py-1 bg-[#F7EEF8] rounded-xl border border-primary/10">
                  <span className="font-extrabold text-sm sm:text-base text-[#800090]">
                    {getPoints(top1.totalReferrals).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-medium">points</span>
                </div>
              </div>

              {/* Rank 3 (Right) */}
              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white border-2 border-neutral-200 shadow-sm flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#FDFBFD] text-neutral-700 flex items-center justify-center text-sm sm:text-base font-bold">
                      {getInitials(top3.fullName)}
                    </div>
                  </div>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-700 text-white text-[11px] font-extrabold flex items-center justify-center border-2 border-white">
                    3
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate w-full mt-1">
                  {top3.fullName}
                </h4>
                <div className="mt-1 px-3 py-1 bg-[#F7EEF8] rounded-xl">
                  <span className="font-extrabold text-xs sm:text-sm text-[#800090]">
                    {getPoints(top3.totalReferrals).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-medium">points</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. Ranked List (Matching Figma Leaderboard.png) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          {displayLeaderboard.map((item) => (
            <div
              key={item.userId}
              className={cn(
                'bg-white p-3.5 sm:p-4 rounded-2xl border shadow-xs hover:border-neutral-200 transition-all flex items-center justify-between',
                item.userId === user?.id
                  ? 'border-primary ring-1 ring-primary/20 bg-primary/5'
                  : 'border-neutral-100'
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Initials Circle */}
                <div className="w-10 h-10 rounded-full bg-[#F7EEF8] text-[#800090] font-bold text-xs flex items-center justify-center shrink-0">
                  {getInitials(item.fullName)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-neutral-900 truncate flex items-center gap-2">
                    <span>{item.fullName}</span>
                    {item.userId === user?.id && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-extrabold">
                        You
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Rank #{item.rank} • {item.totalReferrals} invites
                  </p>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <span className="font-extrabold text-sm sm:text-base text-neutral-900">
                  {getPoints(item.totalReferrals).toLocaleString()}
                </span>
                <p className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                  Points
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  )
}
