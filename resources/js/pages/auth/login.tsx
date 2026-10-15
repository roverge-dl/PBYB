import React, { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { AuthLayout } from '../../components/auth/AuthLayout'
import {
  Button,
  Input,
  PasswordInput,
  SocialButton,
  FormErrorBanner,
} from '../../components/ui'
import { useValidator, useLoadingState } from '../../hooks'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    clearError(field)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearAllErrors()

    // 1. Client-side validation with validator.js
    const isValid = await validate([
      {
        input: { value: formData.email, field: 'email', type: 'text' },
        rules: { required: true, email: true },
        alias: 'Email address',
      },
      {
        input: { value: formData.password, field: 'password', type: 'text' },
        rules: { required: true },
        alias: 'Password',
      },
    ])

    if (!isValid) return

    startLoading()

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        stopLoading('failed')
        setServerErrors(data, 'Invalid email or password. Please try again.')
        return
      }

      // Login successful -> redirect to dashboard with state-aware lifecycle
      router.visit('/dashboard/pre-challenge', {
        onSuccess: () => stopLoading('done'),
        onError: () => {
          stopLoading('failed')
          setGeneralError('Session redirect failed. Please reload and try again.')
        },
        onFinish: () => stopLoading('done'),
      })
    } catch (err: any) {
      stopLoading('failed')
      setGeneralError(err?.message || 'An unexpected network error occurred. Please try again.')
    }
  }

  return (
    <AuthLayout
      title="Welcome back, Mama"
      subtitle="Enter your credentials to continue your pregnancy blood health journey."
      heroTitle="Welcome back, Mama"
      heroSubtitle="Continue logging your PCV tests, earning referral milestones, and connecting with our health care team."
    >
      <Head title="Sign In" />

      {/* Form Error Banner */}
      <FormErrorBanner
        message={generalError}
        onClose={() => clearAllErrors()}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="sarahudo@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />

        {/* Password with Forgot Password Link */}
        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            required
          />

          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:text-primary-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Switch to Register Link */}
      <div className="mt-5 text-center text-xs text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/get-started"
          className="font-semibold text-primary hover:text-primary-700 underline decoration-primary/40 underline-offset-2 transition-colors"
        >
          Sign up
        </Link>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#FDFBFD] px-3 text-neutral-400">Or</span>
        </div>
      </div>

      {/* Google Sign In */}
      <div>
        <SocialButton
          provider="google"
          actionText="Sign in with"
          onClick={() => {
            alert('Google authentication will redirect to Google OAuth in production.')
          }}
        />
      </div>
    </AuthLayout>
  )
}
