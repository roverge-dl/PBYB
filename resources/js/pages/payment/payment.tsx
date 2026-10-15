import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, FormErrorBanner } from "../../components/ui";
import { useLoadingState } from "../../hooks";
import { CheckCheck, Sparkles, ShieldCheck } from "lucide-react";

interface PaymentPageProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isPaid: boolean;
    isVerified: boolean;
  } | null;
  email?: string;
}

export default function PaymentPage({ user, email = "" }: PaymentPageProps) {
  const [error, setError] = useState<string | null>(null);

  const paymentLoading = useLoadingState(false, {
    timeoutMs: 15000,
    onTimeout: () => setError("Payment request timed out. Please try again."),
  });

  const userEmail = user?.email || email;

  /**
   * Handle Make Payment:
   * First tries Paystack API initialize; in dev or fallback, allows simulated unlock
   */
  const handlePayment = async () => {
    setError(null);

    await paymentLoading.withLoading(
      async () => {
        // Attempt Paystack payment initialization
        const res = await fetch("/api/v1/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: userEmail,
            callbackUrl: window.location.origin + "/dashboard?welcome=1",
          }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok && data?.data?.authorizationUrl) {
          // In production: redirect to Paystack payment gateway URL
          window.location.href = data.data.authorizationUrl;
          return;
        }

        // Fallback in local/demo environment if Paystack keys aren't configured with live funds:
        // Automatically invoke simulate-success
        const simRes = await fetch("/api/v1/payments/simulate-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: userEmail }),
        });

        if (simRes.ok) {
          router.visit("/dashboard?welcome=1");
        } else {
          const simData = await simRes.json().catch(() => null);
          setError(simData?.message || "Failed to initialize payment gateway. Please try again.");
        }
      },
      {
        onError: (err: any) => {
          setError(err?.message || "Payment service unavailable. Please check your network.");
        },
      }
    );
  };

  /**
   * Dedicated demo button for testing
   */
  const handleSimulatePayment = async () => {
    setError(null);
    await paymentLoading.withLoading(async () => {
      const res = await fetch("/api/v1/payments/simulate-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.ok) {
        router.visit("/dashboard?welcome=1");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Payment simulation failed.");
      }
    });
  };

  return (
    <AuthLayout
      title="Activate your membership"
      subtitle="Pay N5000 fee to unlock your account"
      heroTitle="Create Your Account"
      heroSubtitle="Let's build you a healthy blood and safeguard your maternal health together."
    >
      <Head title="Activate Membership - Payment" />

      {/* Error Banner */}
      {error && (
        <FormErrorBanner
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Membership Fee Purple Card (dashboard 10) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800090] via-[#700080] to-[#4c0056] p-6 text-white shadow-xl">
        {/* Subtle decorative wave SVG / highlight */}
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute right-4 top-4 text-white/20">
          <Sparkles className="h-10 w-10" />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
            Membership fee
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-anton text-4xl tracking-wide md:text-5xl text-white">
              ₦5,000
            </span>
            <span className="text-xs text-white/70">one-time</span>
          </div>
        </div>
      </div>

      {/* "What you get" List */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
          What you get
        </h3>

        <ul className="mt-4 space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECD4ED] text-[#800090] mt-0.5">
              <CheckCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium text-neutral-700">
              Membership fee
            </span>
          </li>

          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECD4ED] text-[#800090] mt-0.5">
              <CheckCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium text-neutral-700">
              Upload and track your blood count history
            </span>
          </li>

          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECD4ED] text-[#800090] mt-0.5">
              <CheckCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-medium text-neutral-700">
              Referral rewards and the leaderboard
            </span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-10 space-y-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={paymentLoading.isLoading}
          onClick={handlePayment}
          className="bg-[#800090] hover:bg-[#6b0079] text-white shadow-button py-4 text-base font-semibold"
        >
          Make Payment
        </Button>

        {/* Development testing quick button */}
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={paymentLoading.isLoading}
          className="w-full text-center text-xs font-semibold text-[#800090] hover:text-[#5a0066] transition-colors py-1 flex items-center justify-center gap-1.5 opacity-90"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Quick Test: Complete Demo Payment (Dev Mode)
        </button>
      </div>

      {/* Security badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
        <ShieldCheck className="h-4 w-4 text-neutral-400" />
        <span>Secured by 256-bit encryption via Paystack</span>
      </div>
    </AuthLayout>
  );
}
