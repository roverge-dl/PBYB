import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import {
  Button,
  Input,
  PasswordInput,
  SocialButton,
  FormErrorBanner,
} from "../../components/ui";
import { PencilLine } from "lucide-react";
import { cn } from "../../lib/utils";
import { useValidator, useLoadingState } from "../../hooks";

interface RegisterProps {
  referralCode?: string;
  role?: string;
}

export default function Register({
  referralCode = "",
  role: initialRole = "",
}: RegisterProps) {
  // Determine role from props or URL query parameter
  const getResolvedRole = () => {
    if (initialRole) return initialRole;
    if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      if (urlRole) return urlRole;
    }
    return "pregnant_mum";
  };

  const [role, setRole] = useState(getResolvedRole);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    } else if (typeof window !== "undefined") {
      const urlRole = new URLSearchParams(window.location.search).get("role");
      if (urlRole) setRole(urlRole);
    }
  }, [initialRole]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    referralCode: referralCode,
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation hook powered by validator.js
  const {
    errors,
    errorList,
    generalError,
    validate,
    setServerErrors,
    clearError,
    setGeneralError,
    clearAllErrors,
  } = useValidator();

  // State-aware loading hook with safety watchdog
  const { isLoading, startLoading, stopLoading } = useLoadingState(false, {
    timeoutMs: 12000,
    onTimeout: () => {
      setGeneralError("Request timed out. Please check your network connection and try again.");
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAllErrors();

    if (!agreedToTerms) {
      setServerErrors({ terms: ["Please agree to the Terms and Conditions of Birthsafe."] });
      return;
    }

    // 1. Run client-side validation using validator.js
    const isValid = await validate([
      {
        input: { value: formData.firstName, field: "firstName", type: "text" },
        rules: { required: true, min_length: 2 },
        alias: "First name",
      },
      {
        input: { value: formData.lastName, field: "lastName", type: "text" },
        rules: { required: true, min_length: 2 },
        alias: "Last name",
      },
      {
        input: { value: formData.email, field: "email", type: "text" },
        rules: { required: true, email: true },
        alias: "Email address",
      },
      {
        input: { value: formData.password, field: "password", type: "text" },
        rules: {
          required: true,
          min_length: 8,
          must_have_number: true,
          has_special_character: true,
        },
        alias: "Password",
      },
    ]);

    if (!isValid) {
      // Validation failed: stop immediately, no eternal spinner
      return;
    }

    // 2. Start state-aware loading
    startLoading();

    // Map UI role to backend allowed roles ('pregnant_mum' | 'nurse')
    const backendRole =
      role === "affiliate" || role === "nurse" ? "nurse" : "pregnant_mum";

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure session cookies are sent and saved
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          password: formData.password,
          role: backendRole,
          referralCode: formData.referralCode?.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        stopLoading("failed");
        setServerErrors(data, "Registration failed. Please check your information.");
        return;
      }

      // 3. Registration successful → redirect to email verification OTP screen
      const encodedEmail = encodeURIComponent(formData.email.trim());
      router.visit(`/verify-email?email=${encodedEmail}`, {
        onSuccess: () => stopLoading("done"),
        onError: () => {
          stopLoading("failed");
          setGeneralError("Session verification failed. Please try signing in directly.");
        },
        onFinish: () => stopLoading("done"),
      });
    } catch (err: any) {
      stopLoading("failed");
      setGeneralError(err?.message || "An unexpected network error occurred. Please try again.");
    }
  };

  const roleLabel =
    role === "affiliate" || role === "nurse"
      ? "I'm an affiliate"
      : "I'm a mum";

  return (
    <AuthLayout heroTitle="Create Your Account">
      <Head title="Create Your Account" />

      {/* Role badge — matches Figma dashboard 9 pill above the title */}
      <div className="mb-4 -mt-2">
        <button
          type="button"
          onClick={() =>
            router.visit(`/get-started?role=${encodeURIComponent(role)}`)
          }
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
            "bg-primary text-white hover:bg-primary-700 transition-colors",
          )}
          aria-label="Change user type">
          {roleLabel}
          <PencilLine size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Form Error Banner */}
      <FormErrorBanner
        message={generalError}
        onClose={() => clearAllErrors()}
      />

      {/* Google SSO — appears above the email form in dashboard 9 */}
      <div className="mb-4">
        <SocialButton
          provider="google"
          actionText="Sign in with"
          onClick={() => {
            alert(
              "Google authentication will redirect to Google OAuth in production.",
            );
          }}
        />
      </div>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#FDFBFD] px-3 text-neutral-400">
            or sign up with your email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Sarah"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
            required
          />
          <Input
            label="Last Name"
            placeholder="Udo"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
            required
          />
        </div>

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          placeholder="sarahudo@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />

        {/* City & Referral — side by side on one row to reduce form height */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City of Residence"
            placeholder="e.g. Lagos"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            error={errors.city}
          />
          <Input
            label="Referral code (optional)"
            placeholder="PB-XXXXX"
            value={formData.referralCode}
            onChange={(e) => handleChange("referralCode", e.target.value)}
            error={errors.referralCode}
          />
        </div>

        {/* Password */}
        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />

        {/* Terms & Conditions checkbox */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer group select-none">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  clearError("terms");
                }}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                  agreedToTerms
                    ? "border-primary bg-primary"
                    : "border-neutral-300 bg-white group-hover:border-primary/60",
                  errors.terms && "border-red-400",
                )}>
                {agreedToTerms && (
                  <svg
                    viewBox="0 0 10 8"
                    fill="none"
                    className="w-2.5 h-2.5 text-white"
                    aria-hidden="true">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-neutral-600 leading-relaxed">
              I agree to the{" "}
              <a
                href="#terms"
                className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors"
                onClick={(e) => e.stopPropagation()}>
                Terms and conditions
              </a>{" "}
              of Birthsafe
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-red-500 pl-6">{errors.terms}</p>
          )}
        </div>

        {/* Submit Button: Disabled until agreedToTerms is true, state-aware loading */}
        <div className="pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!agreedToTerms || isLoading}
            isLoading={isLoading}>
            Sign Up
          </Button>
        </div>
      </form>

      {/* Switch to Login */}
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
