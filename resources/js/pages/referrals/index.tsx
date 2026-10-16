import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { PortalLayout, PortalUser } from '../../components/layout/PortalLayout'
import {
  Users,
  Copy,
  Check,
  Share2,
  Trophy,
  ArrowRight,
  Sparkles,
  Coins,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

interface ReferralItem {
  id: string
  referredName: string
  referredEmail: string
  initials: string
  status: 'pending' | 'approved' | 'disbursed'
  commissionAmount: number
  createdAt: string | null
}

interface ReferralsPageProps {
  user: PortalUser
  referralStats?: {
    userId: string
    referralCode: string
    referralLink: string
    successfulReferrals: number
    pendingReferrals: number
    commissionEarned: number
    totalReferrals: number
  }
  referrals?: ReferralItem[]
}

export default function ReferralsIndex({
  user,
  referralStats,
  referrals = [],
}: ReferralsPageProps) {
  const [copied, setCopied] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'approved' | 'pending'>('all')

  const referralCode = user.referralCode || 'PB-MAMA'
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pbyb.com'
  const fullInviteLink = `${origin}/register?ref=${referralCode}`

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullInviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Join the Pregnancy Build Your Blood (PBYB) Challenge',
      text: `Hi! I'm inviting you to join the Pregnancy Build Your Blood (PBYB) 14-day cohort. Protect your maternal health, build your blood count, and win prizes! Sign up here:`,
      url: fullInviteLink,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // Fallback to WhatsApp if share cancelled or unsupported
      }
    }

    // WhatsApp Fallback
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareData.text} ${fullInviteLink}`
    )}`
    window.open(waUrl, '_blank')
  }

  // Format relative time or readable date
  const formatTimeAgo = (isoDate: string | null) => {
    if (!isoDate) return 'Recently'
    const date = new Date(isoDate)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hr ago'
    if (diffHours < 24) return `${diffHours} hrs ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const filteredReferrals = referrals.filter((item) => {
    if (activeFilter === 'approved') return item.status === 'approved' || item.status === 'disbursed'
    if (activeFilter === 'pending') return item.status === 'pending'
    return true
  })

  const totalReferrals = referralStats?.totalReferrals ?? referrals.length
  const successfulReferrals = referralStats?.successfulReferrals ?? referrals.filter((r) => r.status === 'approved').length
  const pendingReferrals = referralStats?.pendingReferrals ?? referrals.filter((r) => r.status === 'pending').length
  const commissionEarned = referralStats?.commissionEarned ?? successfulReferrals * 1000

  // Fallback demo items if user has no referrals yet to match Figma visual preview
  const displayReferrals = filteredReferrals

  return (
    <PortalLayout user={user} activeTab="referrals">
      <Head title="Referrals & Invitations - BirthSafe" />

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Referrals
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Invite pregnant mothers to build their blood. Earn ₦1,000 commission for every paid registration.
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all self-start sm:self-auto"
          >
            <Trophy className="w-4 h-4 text-primary" />
            <span>View Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. Main Invite Card (Matching Figma Referrals.png) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
              Invite friends, earn points
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              You earn points and ₦1,000 cash reward every time someone signs up.
            </p>
          </div>

          {/* Copy Link Input Bar */}
          <div className="flex items-center gap-2 p-1.5 pl-4 bg-[#F7EEF8] rounded-2xl border border-[#ECD4ED]">
            <input
              type="text"
              readOnly
              value={fullInviteLink}
              className="bg-transparent border-0 text-sm font-medium text-neutral-800 focus:outline-none flex-1 truncate"
            />
            <button
              onClick={handleCopyLink}
              type="button"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#800090] text-white text-xs font-bold hover:bg-[#660073] active:scale-95 transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </>
              )}
            </button>
          </div>

          {/* Big Purple Share Pill Button (from Referrals.png) */}
          <button
            onClick={handleShare}
            type="button"
            className="w-full py-4 px-6 rounded-full bg-[#800090] hover:bg-[#660073] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. Referral Metrics Overview */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Total Invited
            </span>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              {totalReferrals}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Approved
            </span>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {successfulReferrals}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
              Pending
            </span>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1">
              {pendingReferrals}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Commission
            </span>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-[#800090] mt-1">
              ₦{commissionEarned.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. Referrals List (Matching Figma Referrals.png / Referrals (1).png) */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-900">Referrals</h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={cn(
                  'px-3 py-1 rounded-full transition-all',
                  activeFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                All ({referrals.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('approved')}
                className={cn(
                  'px-3 py-1 rounded-full transition-all',
                  activeFilter === 'approved'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                Approved ({successfulReferrals})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('pending')}
                className={cn(
                  'px-3 py-1 rounded-full transition-all',
                  activeFilter === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                Pending ({pendingReferrals})
              </button>
            </div>
          </div>

          {/* Referral Rows */}
          <div className="space-y-3">
            {displayReferrals.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs hover:border-neutral-200 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Initials Avatar badge */}
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                      item.status === 'approved'
                        ? 'bg-[#E7F5FC] text-[#23536A]'
                        : 'bg-[#F7EEF8] text-[#800090]'
                    )}
                  >
                    {item.initials}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 truncate">
                      {item.referredName}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {formatTimeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'text-[11px] font-bold px-2.5 py-1 rounded-full capitalize',
                      item.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'disbursed'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {item.status === 'approved'
                      ? '+₦1,000 Earned'
                      : item.status === 'disbursed'
                      ? 'Disbursed'
                      : 'Pending Registration'}
                  </span>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {displayReferrals.length === 0 && (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-100 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F7EEF8] text-[#800090] flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-neutral-900">
                    No referrals yet
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                    Share your unique referral link with pregnant mothers in your network to start earning rewards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-6 py-2.5 rounded-full bg-[#800090] text-white text-xs font-bold hover:bg-[#660073] transition-all inline-flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Start Sharing Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  )
}
