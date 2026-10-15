import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button } from "../../components/ui";
import { cn } from "../../lib/utils";

type UserRole = "mum" | "affiliate";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface GetStartedProps {
  role?: string;
}

const MumIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 text-primary"
    aria-hidden="true">
    <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AffiliateIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="w-7 h-7 text-primary"
    aria-hidden="true">
    <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M4 26c0-3.314 2.686-6 6-6h12c3.314 0 6 2.686 6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "mum",
    label: "I'm a mum",
    description:
      "Track your blood count, build a daily streak and earn rewards as you go",
    icon: <MumIcon />,
  },
  {
    value: "affiliate",
    label: "I'm an affiliate",
    description:
      "Invite mums with your own link and earn points for everyone who joins",
    icon: <AffiliateIcon />,
  },
];

export default function GetStarted({
  role: initialRole = "",
}: GetStartedProps) {
  const getInitialSelection = (): UserRole | null => {
    if (initialRole === "affiliate" || initialRole === "nurse")
      return "affiliate";
    if (initialRole === "mum" || initialRole === "pregnant_mum") return "mum";
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      if (urlRole === "affiliate" || urlRole === "nurse") return "affiliate";
      if (urlRole === "mum" || urlRole === "pregnant_mum") return "mum";
    }
    return null;
  };

  const [selected, setSelected] = useState<UserRole | null>(
    getInitialSelection,
  );

  const handleProceed = () => {
    if (!selected) return;
    const roleParam = selected === "affiliate" ? "affiliate" : "pregnant_mum";
    router.visit(`/register?role=${roleParam}`);
  };

  return (
    <AuthLayout
      title="Welcome to the PBYB Challenge"
      subtitle="Tell us how you'll be joining. It only takes a couple of minutes to get set up."
      heroTitle="Create Your Account"
      // heroSubtitle="Lorem ipsum dolor sit amet consectetur. Facilisis"
    >
      {/* Role selection cards */}
      <div className="space-y-3 mb-10">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all duration-200",
                "hover:border-primary/40 hover:bg-primary-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isSelected
                  ? "border-primary bg-accent/20 shadow-sm"
                  : "border-neutral-200 bg-white",
              )}
              aria-pressed={isSelected}>
              {/* Icon pill */}
              <div
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary/15" : "bg-primary/10",
                )}>
                {option.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  {option.label}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                  {option.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-neutral-300 bg-white",
                )}>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Proceed CTA */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selected}
        onClick={handleProceed}
        className={cn(!selected && "opacity-50 cursor-not-allowed")}>
        Proceed
      </Button>

      {/* Sign In link */}
      <p className="mt-5 text-center text-xs text-neutral-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
