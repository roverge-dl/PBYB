import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button, PasswordInput, FormErrorBanner } from '../../components/ui'
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { useValidator, useLoadingState } from '../../hooks'

interface ResetPasswordProps {
  email?: string
  otp?: string
}

export default function ResetPassword({
  email: initialEmail = '',
  otp: initialOtp = '',
}: ResetPasswordProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    errors,
    generalError,
    validate,
    setServerErrors,
    clearError,
    setGeneralError,
    clearAllErrors,
  } = useValidator()

  const { isLoading, startLoading, stopLoading } = useLoadingState(false, {
    timeoutMs: 12000,
    onTimeout: () => {
      setGeneralError('Request timed out. Please check your network connection and try again.')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearAllErrors()

    // Client-side validation using validator.js (including must_match rule)
    const isValid = await validate([
      {
        input: { value: password, field: 'password', type: 'text' },
        rules: { required: true, min_length: 8 },
        alias: 'New Password',
      },
      {
        input: { value: confirmPassword, field: 'confirmPassword', type: 'text' },
        rules: { required: true, must_match: 'password' },
        alias: 'Confirm Password',
      },
    ])

    if (!isValid) return

    startLoading()

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: initialEmail,
          otp: initialOtp,
          password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        stopLoading('failed')
        if (data?.errors?.otp) {
          setGeneralError('Invalid or expired verification code. Please start over.')
        } else {
          setServerErrors(data, 'Failed to reset password. Please try again.')
        }
        return
      }

      stopLoading('done')
      setIsSuccess(true)
    } catch (err: any) {
      stopLoading('failed')
      setGeneralError(err?.message || 'An unexpected network error occurred. Please try again.')
    }
  }

  // ─── Success state ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Saved!"
        subtitle="Your password has been successfully reset."
        heroTitle="Password Changed"
        heroSubtitle="You can now sign in securely with your new password."
      >
        <Head title="Password Saved" />

        <div className="flex flex-col items-center text-center space-y-6 py-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <div className="space-y-2 max-w-xs">
            <h3 className="text-xl font-bold text-neutral-900 font-sans">All done!</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Your password has been successfully reset. You can now sign in with your new credentials.
            </p>
          </div>

          <div className="w-full pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.visit('/login')}
            >
              Sign In Now
            </Button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  // ─── Form state ───────────────────────────────────────────────────────────
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Enter new password"
      heroTitle="Set New Password"
      heroSubtitle="Your security is our priority. Choose a strong password of at least 8 characters."
    >
      <Head title="Reset Password" />

      {/* Security badge */}
      <div className="mb-5 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary/5 border border-primary/15">
        <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
        <p className="text-xs text-neutral-600">
          Your code has been verified. Choose a strong new password below.
        </p>
      </div>

      {/* Form Error Banner */}
      <FormErrorBanner
        message={generalError}
        onClose={() => clearAllErrors()}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* New Password */}
        <PasswordInput
          label="New Password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            clearError('password')
          }}
          error={errors.password}
          required
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            clearError('confirmPassword')
          }}
          error={errors.confirmPassword}
          required
        />

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Save Password
          </Button>
        </div>
      </form>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-xs text-neutral-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
