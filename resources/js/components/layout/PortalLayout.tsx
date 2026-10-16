import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import {
  Home,
  Activity,
  Users,
  Trophy,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  Award,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface PortalUser {
  id: string
  firstName: string
  lastName: string
  fullName?: string
  email: string
  role: 'pregnant_mum' | 'nurse' | 'admin' | string
  referralCode?: string
  isPaid?: boolean
  initials?: string
}

interface PortalLayoutProps {
  user?: PortalUser | null
  activeTab: 'home' | 'pcv' | 'referrals' | 'leaderboard'
  children: React.ReactNode
}

export function PortalLayout({ user, activeTab, children }: PortalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isNurse = user?.role === 'nurse'
  const displayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'
  const initials = user?.initials || displayName.slice(0, 2).toUpperCase() || 'US'

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    } catch {
      // Ignore network errors on logout
    }
    router.visit('/login')
  }

  return (
    <div className="min-h-screen bg-[#FBF9FB] flex">
      {/* ========================================================= */}
      {/* 1. Desktop Left Sidebar */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-neutral-100 bg-white p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* BirthSafe Brand Header */}
          <Link href="/referrals" className="flex items-center gap-2.5">
            <img
              src="/images/birthsafe-logo.png"
              alt="BirthSafe"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="font-sans text-xl font-bold tracking-tight text-neutral-900">
              Birth<span className="text-[#800090]">Safe</span>
            </span>
          </Link>

          {/* Role Status Tag */}
          <div className="px-3.5 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isNurse ? (
                <Award className="w-4 h-4 text-[#800090]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#800090]" />
              )}
              <span className="text-xs font-bold text-[#800090]">
                {isNurse ? 'Affiliate Partner' : 'Pregnancy Challenge'}
              </span>
            </div>
            {isNurse && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active
              </span>
            )}
          </div>

          {/* Navigation Links (Role Filtered) */}
          <nav className="space-y-1.5">
            {/* Phase 2: Home & PCV Tracker screens temporarily hidden for pregnant mums */}
            {/* Referrals (Accessible to all) */}
            <Link
              href="/referrals"
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 text-sm rounded-xl transition-all',
                activeTab === 'referrals'
                  ? 'font-semibold text-white bg-[#800090] shadow-sm'
                  : 'font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <Users className={cn('w-5 h-5', activeTab === 'referrals' ? 'text-white' : 'text-neutral-400')} />
              <span>Referrals</span>
            </Link>

            {/* Leaderboard (Accessible to both) */}
            <Link
              href="/leaderboard"
              className={cn(
                'flex items-center gap-3.5 px-4 py-3 text-sm rounded-xl transition-all',
                activeTab === 'leaderboard'
                  ? 'font-semibold text-white bg-[#800090] shadow-sm'
                  : 'font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <Trophy className={cn('w-5 h-5', activeTab === 'leaderboard' ? 'text-white' : 'text-neutral-400')} />
              <span>Leaderboards</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Pill & Sign Out */}
        {user ? (
          <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-900 truncate">{displayName}</p>
                <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-6 border-t border-neutral-100">
            <Link
              href="/login"
              className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-bold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </aside>

      {/* ========================================================= */}
      {/* 2. Mobile Drawer Navigation */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <span className="font-sans text-lg font-bold tracking-tight text-neutral-900">
                  Birth<span className="text-[#800090]">Safe</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Role Status Tag */}
              <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2">
                <span className="text-xs font-bold text-[#800090]">
                  {isNurse ? 'Affiliate Partner' : 'Pregnancy Challenge'}
                </span>
              </div>

              <nav className="space-y-1">
                {/* Phase 2: Home and PCV tracker hidden */}
                <Link
                  href="/referrals"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl',
                    activeTab === 'referrals'
                      ? 'font-semibold text-white bg-[#800090]'
                      : 'font-medium text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  <Users className="w-4 h-4" />
                  <span>Referrals</span>
                </Link>

                <Link
                  href="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl',
                    activeTab === 'leaderboard'
                      ? 'font-semibold text-white bg-[#800090]'
                      : 'font-medium text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboards</span>
                </Link>
              </nav>
            </div>

            {user ? (
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{displayName}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-neutral-400 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full text-center py-2 px-3 text-xs font-bold text-primary bg-primary/10 rounded-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Main Content Canvas */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 md:px-8 py-3.5">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Mobile Brand / Hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <span className="font-sans text-base font-bold text-neutral-900">
                Birth<span className="text-[#800090]">Safe</span>
              </span>
            </div>

            <div className="hidden md:block">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {isNurse ? 'Affiliate Management' : 'Challenge Portal'}
              </span>
            </div>

            {/* Top Right User Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              <div className="w-9 h-9 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
