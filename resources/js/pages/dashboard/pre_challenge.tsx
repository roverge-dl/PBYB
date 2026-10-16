import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'

interface PreChallengeProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    referralCode: string
    isPaid: boolean
  }
  referralStats?: {
    successfulReferrals: number
    pendingReferrals: number
    commissionEarned: number
  }
}

export default function PreChallengeDashboard({ user, referralStats }: PreChallengeProps) {
  const [copied, setCopied] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  const referralLink = `${window.location.origin}/register?ref=${user.referralCode}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePaystackCheckout = async () => {
    setIsPaying(true)
    try {
      const res = await fetch('/api/v1/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          callbackUrl: `${window.location.origin}/dashboard/pre-challenge`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.data?.authorizationUrl) {
        window.location.href = data.data.authorizationUrl
      } else {
        alert(data.message || 'Payment initialization failed')
        setIsPaying(false)
      }
    } catch {
      alert('Unable to initialize payment. Please try again.')
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Head title="Pre-Challenge Hub - PBYB" />

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-600/20">
              PB
            </div>
            <span className="font-bold text-slate-900 text-base">PBYB Challenge</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/referrals"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Referrals
            </Link>
            <Link
              href="/leaderboard"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Leaderboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
              {user.firstName[0]}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-700/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
                1-Week Pre-Challenge Phase
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
                Welcome, {user.firstName}!
              </h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-md">
                Get ready for the 14-day blood building cohort. Invite friends and prepare your baseline records.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:text-right min-w-[150px]">
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-bold">Registration Status</span>
              <div className="mt-1">
                {user.isPaid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold text-sm">
                    ✓ Confirmed & Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold text-sm">
                    ⚠ Payment Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unpaid Warning Banner */}
        {!user.isPaid && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-3xl">💳</span>
              <div>
                <h3 className="text-base font-bold text-amber-900">Complete Your ₦5,000 Registration Fee</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Secure your slot in the 14-day cohort, access daily checklists, and enable affiliate payouts.
                </p>
              </div>
            </div>
            <button
              onClick={handlePaystackCheckout}
              disabled={isPaying}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isPaying ? 'Redirecting to Paystack...' : 'Pay ₦5,000 via Paystack'}
            </button>
          </div>
        )}

        {/* Referral Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Viral Referral Link</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share this link with expectant mothers and friends. Earn ₦1,000 per verified sign-up!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Earned Commissions</span>
              <p className="text-2xl font-black text-emerald-600">
                ₦{(referralStats?.commissionEarned || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono text-slate-700 truncate">{referralLink}</span>
              <span className="text-xs font-bold text-emerald-600 uppercase ml-2 bg-emerald-50 px-2 py-1 rounded-md">
                {user.referralCode}
              </span>
            </div>

            <button
              onClick={copyReferralLink}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                `Join me in the Pregnancy Build Your Blood (PBYB) Challenge! Let's boost our blood count safely: ${referralLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Pre-Challenge Checklist */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Pre-Challenge Onboarding Checklist</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.isPaid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {user.isPaid ? '✓' : '1'}
              </span>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">Pay ₦5,000 Registration Fee</h4>
                <p className="text-[11px] text-slate-500">Unlocks Day 1 checklist and live cohort coaching.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 opacity-80">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">Photograph & Upload Baseline PCV Lab Report</h4>
                <p className="text-[11px] text-slate-500">Multimodal Gemini Vision OCR reads your baseline haematocrit percentage.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 opacity-80">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">Stock Green Vegetables & Challenge Foods</h4>
                <p className="text-[11px] text-slate-500">Ugu (fluted pumpkin), spinach, waterleaf, beetroot, and hydration kits.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
