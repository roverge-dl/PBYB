import React, { useState, useEffect, useRef, useCallback } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, OtpInput, OtpInputHandle, FormErrorBanner } from "../../components/ui";
import { CelebrationModal } from "../../components/modals/CelebrationModal";
import { useLoadingState } from "../../hooks";
import { Mail, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface VerifyEmailProps {
  email?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmail({ email = "" }: VerifyEmailProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<{ role?: string; isPaid?: boolean } | null>(null);

  const verifyLoading = useLoadingState(false, {
    timeoutMs: 12000,
    onTimeout: () => setError("Verification request timed out. Please try again."),
  });

  const resendLoading = useLoadingState(false, {
    timeoutMs: 12000,
    onTimeout: () => setError("Resend request timed out. Please try again."),
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const otpInputRef = useRef<OtpInputHandle>(null);

  const startCountdown = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
    setResendSuccess(false);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startCountdown]);

  const handleOtpChange = (val: string) => {
    setOtp(val);
    if (error) setError(null);
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (otp.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }

    setError(null);

    await verifyLoading.withLoading(
      async () => {
        const res = await fetch("/api/v1/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(data?.message || "Invalid or expired verification code.");
          return;
        }

        const user = data?.data?.user;
        if (user) {
          setVerifiedUser(user);
        }

        // Show celebration confetti modal (Frame 2147225611)
        setShowCelebration(true);
      },
      {
        onError: (err: any) => {
          setError(err?.message || "Verification failed. Please check your connection and try again.");
        },
      }
    );
  };

  const handleResend = async () => {
    if (!canResend || resendLoading.isLoading) return;
    setError(null);

    await resendLoading.withLoading(
      async () => {
        const res = await fetch("/api/v1/auth/resend-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          setResendSuccess(true);
          setOtp("");
          otpInputRef.current?.clear();
          otpInputRef.current?.focus();
          startCountdown();
        } else {
          const data = await res.json().catch(() => null);
          setError(data?.message || "Failed to resend code. Please try again.");
        }
      },
      {
        onError: () => {
          setError("Network error. Please check your connection and try again.");
        },
      }
    );
  };

  const handleProceed = () => {
    setShowCelebration(false);
    // All users redirect to referrals for Phase 1
    router.visit("/referrals");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've sent a 6-digit code to your email${email ? ` address` : ""}. Enter it to confirm your registration.`}
      heroTitle="Confirm Your Account"
      heroSubtitle="Let's build you a healthy blood and safeguard your maternal health together."
    >
      <Head title="Verify Email" />

      {/* Email indicator pill */}
      {email && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
              Code sent to
            </p>
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {email}
            </p>
          </div>
          <Link
            href="/register"
            className="ml-auto flex-shrink-0 text-xs text-primary hover:text-primary-700 font-semibold underline decoration-primary/30 underline-offset-2 transition-colors"
          >
            Change
          </Link>
        </div>
      )}

      {/* Form Error Banner */}
      {error && (
        <FormErrorBanner
          message={error}
          onClose={() => setError(null)}
          className="mb-5"
        />
      )}

      {/* Resend success notice */}
      {resendSuccess && !error && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          A new verification code has been sent to your email.
        </div>
      )}

      <form onSubmit={handleVerify} noValidate className="space-y-6">
        <OtpInput
          ref={otpInputRef}
          length={OTP_LENGTH}
          value={otp}
          onChange={handleOtpChange}
          error={error ?? undefined}
          hint="Enter the 6-digit code sent to your email"
          autoFocus
          disabled={verifyLoading.isLoading}
        />

        {/* Resend section */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">Didn't receive a code?</span>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading.isLoading}
              className={cn(
                "font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors",
                resendLoading.isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {resendLoading.isLoading ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Resend code"
              )}
            </button>
          ) : (
            <span className="font-semibold tabular-nums text-neutral-400">
              Resend in{" "}
              <span
                className={cn(
                  "text-primary transition-colors",
                  countdown <= 10 && "text-amber-500"
                )}
              >
                {formatTime(countdown)}
              </span>
            </span>
          )}
        </div>

        {/* Verify Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={verifyLoading.isLoading}
          disabled={otp.length < OTP_LENGTH || verifyLoading.isLoading}
        >
          Verify Email
        </Button>
      </form>

      {/* Return to sign in link */}
      <p className="mt-6 text-center text-xs text-neutral-600">
        Already verified your account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors"
        >
          Sign In
        </Link>
      </p>

      {/* Confetti Celebration Modal matching Frame 2147225611 */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title="Email verified!"
        subtitle="Your account is verified! Start sharing your referral link and tracking your rewards."
        buttonText="Go to Referrals"
        onButtonClick={handleProceed}
      />
    </AuthLayout>
  );
}
