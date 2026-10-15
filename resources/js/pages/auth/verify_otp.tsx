import React, { useState, useEffect, useRef, useCallback } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, OtpInput, OtpInputHandle, FormErrorBanner } from "../../components/ui";
import { useLoadingState } from "../../hooks";
import { Mail, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

interface VerifyOtpProps {
  email?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtp({ email = "" }: VerifyOtpProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const verifyLoading = useLoadingState(false, {
    timeoutMs: 12000,
    onTimeout: () => setError("Verification timed out. Please try again."),
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

  // Start / restart the 60-second resend countdown
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

  // Start countdown immediately on mount
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

    verifyLoading.startLoading();
    setError(null);

    try {
      // Optimistic: navigate to reset-password passing email + otp
      router.visit(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
        {
          onError: () => {
            setError("Failed to open reset page. Please try again.");
            verifyLoading.stopLoading("failed");
          },
          onFinish: () => {
            verifyLoading.stopLoading();
          },
        }
      );
    } catch {
      setError("An unexpected error occurred. Please try again.");
      verifyLoading.stopLoading("failed");
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading.isLoading) return;
    setError(null);

    await resendLoading.withLoading(
      async () => {
        const res = await fetch("/api/v1/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          setResendSuccess(true);
          setOtp("");
          otpInputRef.current?.clear();
          otpInputRef.current?.focus();
          startCountdown();
        } else {
          const data = await res.json();
          setError(data.message || "Failed to resend code. Please try again.");
        }
      },
      {
        onError: () => {
          setError("Network error. Please check your connection and try again.");
        },
      }
    );
  };

  // Format seconds as mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout
      title="Enter Verification Code"
      subtitle={`We've sent a 6-digit code to your email${email ? ` address` : ""}. It expires in 10 minutes.`}
      heroTitle="Check Your Email"
      heroSubtitle="A secure one-time password was sent to you. Enter it below to continue resetting your password.">
      {/* Email indicator pill */}
      {email && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border border-primary/15">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-neutral-500 font-medium  tracking-wide">
              Code sent to
            </p>
            <p className="text-sm font-semibold text-neutral-900 truncate">
              {email}
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="ml-auto flex-shrink-0 text-xs text-primary hover:text-primary-700 font-semibold underline decoration-primary/30 underline-offset-2 transition-colors">
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

      {/* General / resend success feedback */}
      {resendSuccess && !error && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />A new code has been sent
          to your email.
        </div>
      )}

      <form onSubmit={handleVerify} noValidate className="space-y-6">
        {/* OTP Input */}
        <OtpInput
          ref={otpInputRef}
          length={OTP_LENGTH}
          value={otp}
          onChange={handleOtpChange}
          error={error ?? undefined}
          // label="Verification Code"
          hint="Enter the 6-digit code from your email"
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
                resendLoading.isLoading && "opacity-50 cursor-not-allowed",
              )}>
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
                  countdown <= 10 && "text-amber-500",
                )}>
                {formatTime(countdown)}
              </span>
            </span>
          )}
        </div>

        {/* Verify CTA */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={verifyLoading.isLoading}
          disabled={otp.length < OTP_LENGTH || verifyLoading.isLoading}>
          Verify Code
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-xs text-neutral-600">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
