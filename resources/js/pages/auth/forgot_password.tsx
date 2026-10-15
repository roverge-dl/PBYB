import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button, Input, FormErrorBanner } from '../../components/ui'
import { CheckCircle2 } from 'lucide-react'
import { useValidator, useLoadingState } from '../../hooks'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
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

    const isValid = await validate([
      {
        input: { value: email, field: 'email', type: 'text' },
        rules: { required: true, email: true },
        alias: 'Email address',
      },
    ])

    if (!isValid) return

    startLoading()

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        stopLoading('failed')
        setServerErrors(data, 'Unable to process password reset request.')
        return
      }

      stopLoading('done')
      setIsSuccess(true)
    } catch (err: any) {
      stopLoading('failed')
      setGeneralError(err?.message || 'An unexpected network error occurred. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address to reset your password"
      heroTitle="Password Recovery"
      heroSubtitle="We will send a secure verification code to your email so you can set a new password."
    >
      <Head title="Forgot Password" />

      {/* Form Error Banner */}
      <FormErrorBanner
        message={generalError}
        onClose={() => clearAllErrors()}
      />

      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-neutral-900 font-sans">
              Check your inbox
            </h3>
            <p className="text-sm text-neutral-600 max-w-sm mx-auto">
              If an account with <strong className="text-neutral-900">{email}</strong> exists, we&apos;ve sent a reset code.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.visit(`/verify-otp?email=${encodeURIComponent(email)}`)}
            >
              Enter Verification Code
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                setIsSuccess(false)
                clearAllErrors()
              }}
            >
              Try another email
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="sarahudo@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError('email')
            }}
            error={errors.email}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </div>
        </form>
      )}

      {/* Switch to Sign In Link */}
      <div className="mt-6 text-center text-xs text-neutral-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  )
}
