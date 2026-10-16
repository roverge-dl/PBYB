import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { CelebrationModal } from "../../components/modals/CelebrationModal";
import {
  Activity,
  Home,
  BookOpen,
  BarChart3,
  UserCheck,
  Bell,
  Menu,
  X,
  ChevronRight,
  Upload,
  Trophy,
  Users,
  Copy,
  Check,
  ArrowRight,
  LogOut,
  Flame,
  CheckCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface DashboardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    role: string;
    referralCode: string;
    isPaid: boolean;
    initials: string;
  };
  referralStats?: {
    totalReferrals: number;
    approvedReferrals: number;
    pendingReferrals: number;
    totalPoints: number;
    totalEarnedNaira: number;
    unpaidCommissionNaira: number;
  };
  showWelcome?: boolean;
}

export default function Dashboard({
  user,
  referralStats,
  showWelcome = false,
}: DashboardProps) {
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(showWelcome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralCode = user.referralCode || "MEYENE";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://pbyb.com";
  const referralLink = `${origin}/register?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    router.visit("/login");
  };

  const streakDays = [
    { label: "W", status: "missed" },
    { label: "T", status: "missed" },
    { label: "F", status: "completed" },
    { label: "S", status: "completed" },
    { label: "S", status: "completed" },
    { label: "M", status: "completed" },
    { label: "Today", status: "current" },
  ];

  const recentReferrals = [
    { name: "Chioma Okafor", time: "2 hours ago", initials: "CO" },
    { name: "Chioma Okafor", time: "2 hours ago", initials: "CO" },
    { name: "Chioma Okafor", time: "2 hours ago", initials: "CO" },
    { name: "Chioma Okafor", time: "2 hours ago", initials: "CO" },
  ];

  const totalPoints = referralStats?.totalPoints ?? 340;
  const referralsCount = referralStats?.totalReferrals ?? 340;

  return (
    <div className="min-h-screen bg-[#FBF9FB] flex">
      <Head title="Dashboard - PBYB Challenge" />

      {/* ========================================================= */}
      {/* 1. Desktop Left Sidebar (dashboard 2) */}
      {/* ========================================================= */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-neutral-100 bg-white p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          {/* BirthSafe Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/images/birthsafe-logo.png"
              alt="BirthSafe"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="font-sans text-xl font-bold tracking-tight text-neutral-900">
              Birth<span className="text-[#800090]">Safe</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <Home className="w-5 h-5 text-neutral-400" />
              <span>Home</span>
            </Link>

            {/* Active PCV Item (dashboard 2 Figma highlight) */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3.5 px-4 py-3 text-sm font-semibold text-white bg-[#800090] rounded-xl shadow-sm transition-all"
            >
              <Activity className="w-5 h-5 text-white" />
              <span>PCV</span>
            </Link>

            <Link
              href="/referrals"
              className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-neutral-400" />
              <span>Referrals</span>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-neutral-400" />
              <span>Leaderboards</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3.5 px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <UserCheck className="w-5 h-5 text-neutral-400" />
              <span>My Profile</span>
            </Link>
          </nav>
        </div>

        {/* Bottom User Profile Pill (dashboard 2) */}
        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold">
                {user.initials || "SF"}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user.fullName || "Sarah Udo"}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                {user.email || "sarah@gmail.com"}
              </p>
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
      </aside>

      {/* ========================================================= */}
      {/* 2. Main Content Wrapper */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header (Desktop & Mobile) */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Mobile Hamburger & Logo (Home Page 1) */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                aria-label="Open menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <img
                src="/images/birthsafe-logo.png"
                alt="BirthSafe"
                className="h-7 w-auto"
              />
            </div>

            {/* Desktop Greeting (dashboard 2) */}
            <div className="hidden md:block">
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 font-sans tracking-tight">
                Welcome, {user.firstName || "Sarah"}
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Let's keep building your blood today.
              </p>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* User Pill / Avatar */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold">
                    {user.initials || "CO"}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-xs font-bold text-neutral-900 leading-none truncate">
                    {user.fullName || "Anthonia Feyikemi"}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 truncate">
                    {user.email || "anto@gmail.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Page Title (Home Page 1) */}
        <div className="px-4 pt-5 pb-1 md:hidden">
          <h2 className="text-xl font-bold text-neutral-900">
            Welcome, {user.firstName || "Sarah"}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Let's keep building your blood today.
          </p>
        </div>

        {/* Main Dashboard Body */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* ========================================================= */}
          {/* 3. Streak Card (dashboard 2 & Home Page 1) */}
          {/* ========================================================= */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a008a] via-[#850098] to-[#5a0066] p-6 md:p-8 text-white shadow-xl">
            {/* Background ambient lighting */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left Streak Metric */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm text-2xl">
                  <Flame className="w-7 h-7 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-anton text-5xl md:text-6xl tracking-wide text-white font-bold">
                    4
                  </span>
                  <span className="text-sm md:text-base font-semibold text-white/90">
                    day streak
                  </span>
                </div>
              </div>

              {/* Right Week Tracker Pills */}
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {streakDays.map((day, idx) => {
                  if (day.status === "completed") {
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white text-[#800090] flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[10px] text-white/80 font-medium">
                          {day.label}
                        </span>
                      </div>
                    );
                  }

                  if (day.status === "current") {
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center" />
                        <span className="text-[10px] text-white font-semibold">
                          Today
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center" />
                      <span className="text-[10px] text-white/60 font-medium">
                        {day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section: Status & Upload CTA */}
            <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>Today: not uploaded yet</span>
              </div>

              <button
                type="button"
                onClick={() => alert("PCV Upload flow modal will open here.")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#800090] hover:bg-neutral-100 active:scale-[0.98] transition-all font-semibold text-xs md:text-sm shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Upload today's result</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. Pregnancy Safeguarding Tools Banner */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-[#E8F3FA] p-4 border border-[#d6e9f5] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c58b68] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-900">
                Pregnancy safeguarding tools
              </p>
              <a
                href="#safeguarding"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Navigating to safeguarding guidelines.");
                }}
                className="text-xs text-[#800090] font-semibold hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <span>Visit our website</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. Two-Column Stats & Referrals Section */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Recent referrals (dashboard 2) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-neutral-100 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-neutral-900">
                  Recent referrals
                </h3>
                <Link
                  href="/leaderboard"
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
                >
                  See all
                </Link>
              </div>

              <div className="space-y-3">
                {recentReferrals.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl border border-neutral-100 bg-[#FAFAFA] hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#433b5c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {item.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Metrics & Invite Box (dashboard 2) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Metric Cards Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Total points */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-subtle relative flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#F6E8F7] text-[#800090] flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#800090]" />
                    </div>
                    <p className="text-xs font-medium text-neutral-500 mt-3">
                      Total points
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900 mt-1">
                      {totalPoints}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>

                {/* Referrals */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-subtle relative flex flex-col justify-between">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#FDECEF] text-[#E04F75] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#E04F75]" />
                    </div>
                    <p className="text-xs font-medium text-neutral-500 mt-3">
                      Referrals
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-neutral-900 mt-1">
                      {referralsCount}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Invite friends, earn points (dashboard 2 & Home Page 1) */}
              <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-subtle">
                <h4 className="text-sm md:text-base font-bold text-neutral-900">
                  Invite friends, earn points
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  You earn points every time someone signs up.
                </p>

                <div className="mt-4 flex items-center justify-between rounded-full bg-neutral-100 p-1.5 pl-4 gap-2 border border-neutral-200/50">
                  <span className="text-xs text-neutral-600 truncate font-mono">
                    {referralLink}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#800090] text-white hover:bg-[#6b0079] active:scale-95 transition-all text-xs font-semibold shrink-0"
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
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================= */}
      {/* 6. Mobile Slide-out Drawer (Home Page 2) */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Top: Logo & Close */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <img
                  src="/images/birthsafe-logo.png"
                  alt="BirthSafe"
                  className="h-8 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-[#800090] hover:bg-neutral-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items (Home Page 2) */}
              <nav className="mt-6 space-y-1">
                {[
                  "Home",
                  "Upload Blood Count",
                  "My Routine",
                  "Supplements",
                  "My Records",
                  "Profile",
                  "About Us",
                  "Chat with Us",
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item === "Home") router.visit("/dashboard");
                    }}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium text-neutral-700 hover:text-[#800090] transition-colors text-left"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Sign Out (Home Page 2) */}
            <div className="pt-6 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-bold text-[#800090]">Sign Out</p>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">
                    {user.email || "sarahudo@gmail.com"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#800090]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. Payment Success / Welcome Confetti Modal (dashboard 11 & Home Page) */}
      {/* ========================================================= */}
      <CelebrationModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
        title={`Welcome ${user.firstName || "Sarah"}!`}
        subtitle="Congratulations! Your membership is active. Let's keep building your blood and safeguarding your maternal health."
        buttonText="Get Started"
        onButtonClick={() => setWelcomeModalOpen(false)}
      />
    </div>
  );
}
