import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, FormErrorBanner } from "../../components/ui";
import { CelebrationModal } from "../../components/modals/CelebrationModal";
import { useLoadingState } from "../../hooks";
import { CheckCheck, Sparkles, ShieldCheck, Loader2 } from "lucide-react";

interface PaymentPageProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isPaid: boolean;
    isVerified: boolean;
    role?: string;
  } | null;
  email?: string;
  reference?: string;
  paystackPublicKey?: string;
}

export default function PaymentPage({
  user,
  email = "",
  reference: initialReference = "",
}: PaymentPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const hasVerifiedRef = useRef(false);

  const paymentLoading = useLoadingState(false, {
    timeoutMs: 20000,
    onTimeout: () => setError("Payment request timed out. Please try again."),
  });

  const userEmail = (user?.email || email || "").trim();

  // Affiliates are not required to pay; redirect to referrals page
  useEffect(() => {
    if (user?.role === "nurse") {
      router.visit("/referrals");
    }
  }, [user]);

  // Dynamically load Paystack Inline v2 SDK script
  useEffect(() => {
    const scriptId = "paystack-inline-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Check URL query parameters or initialReference prop on mount for callback verification
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const refParam =
      initialReference || urlParams.get("reference") || urlParams.get("trxref");

    if (refParam && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      handleVerify(refParam);
    }
  }, [initialReference]);

  /**
   * Verify transaction with the backend
   */
  const handleVerify = async (ref: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reference: ref }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.data?.verified) {
        // Clean the query parameters from URL history
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        setShowCelebration(true);
      } else {
        setError(
          data?.message ||
            "Payment verification was unsuccessful. Please check with your bank or try again."
        );
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Network error while verifying payment. Please refresh the page."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Handle Make Payment:
   * 1. Initialize transaction with backend Paystack service
   * 2. Attempt Paystack popup popup modal; gracefully fall back to hosted authorization URL
   */
  const handlePayment = async () => {
    setError(null);

    await paymentLoading.withLoading(
      async () => {
        const callbackUrl = window.location.origin + "/payment";

        const res = await fetch("/api/v1/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: userEmail,
            callbackUrl,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setError(
            data?.message || "Failed to initialize payment. Please try again."
          );
          return;
        }

        // If the user already paid, proceed to referrals
        if (data?.data?.alreadyPaid) {
          router.visit("/referrals");
          return;
        }

        const accessCode = data?.data?.accessCode;
        const authUrl = data?.data?.authorizationUrl;
        const ref = data?.data?.reference;

        // 1. Try Paystack Popup (inline modal)
        const PaystackPop = (window as any).PaystackPop;
        if (accessCode && typeof PaystackPop !== "undefined") {
          try {
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode, {
              onSuccess: (transaction: any) => {
                const finalRef = transaction?.reference || ref;
                handleVerify(finalRef);
              },
              onCancel: () => {
                setError("Payment window was closed.");
              },
            });
            return;
          } catch (popupErr) {
            console.warn("Paystack popup failed, falling back to redirect:", popupErr);
          }
        }

        // 2. Standard Paystack redirect fallback
        if (authUrl) {
          window.location.href = authUrl;
          return;
        }

        setError("Unable to launch Paystack gateway. Please try again.");
      },
      {
        onError: (err: any) => {
          setError(
            err?.message ||
              "Payment service is currently unavailable. Please check your network."
          );
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
        setShowCelebration(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Payment simulation failed.");
      }
    });
  };

  const handleProceedToDashboard = () => {
    setShowCelebration(false);
    router.visit("/referrals");
  };

  return (
    <AuthLayout
      title="Activate your membership"
      subtitle="Pay ₦5,000 fee to unlock your account"
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

      {/* Verifying Banner */}
      {isVerifying && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[#ECD4ED]/40 border border-[#800090]/20 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-[#800090] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#800090]">
              Verifying your payment with Paystack…
            </p>
            <p className="text-xs text-neutral-600">
              Please wait a moment while we confirm your transaction.
            </p>
          </div>
        </div>
      )}

      {/* Membership Fee Purple Card (dashboard 10) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#800090] via-[#700080] to-[#4c0056] p-6 text-white shadow-xl">
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
              Full access to the 30-day blood booster challenge
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
              Referral rewards (₦1,000 per paid friend) & leaderboard eligibility
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
          isLoading={paymentLoading.isLoading || isVerifying}
          disabled={paymentLoading.isLoading || isVerifying}
          onClick={handlePayment}
          className="bg-[#800090] hover:bg-[#6b0079] text-white shadow-button py-4 text-base font-semibold"
        >
          {isVerifying ? "Verifying Payment…" : "Make Payment"}
        </Button>

        {/* Development testing quick button */}
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={paymentLoading.isLoading || isVerifying}
          className="w-full text-center text-xs font-semibold text-[#800090] hover:text-[#5a0066] transition-colors py-1 flex items-center justify-center gap-1.5 opacity-90 disabled:opacity-50"
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

      {/* Celebration Modal upon successful verification */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleProceedToDashboard}
        title="Membership Activated!"
        subtitle="Your ₦5,000 membership fee is confirmed. Welcome to Pregnancy Blood Count Booster!"
        buttonText="Proceed to Dashboard"
        onButtonClick={handleProceedToDashboard}
      />
    </AuthLayout>
  );
}
