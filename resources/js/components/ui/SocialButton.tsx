import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export type SocialProvider = 'google' | 'facebook' | 'apple'

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: SocialProvider
  variant?: 'pill' | 'rounded' | 'icon'
  actionText?: 'Sign in with' | 'Sign up with' | 'Continue with'
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  (
    {
      className,
      provider,
      variant = 'pill',
      actionText = 'Sign in with',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isIconOnly = variant === 'icon'

    const providerNames: Record<SocialProvider, string> = {
      google: 'Google',
      facebook: 'Facebook',
      apple: 'Apple',
    }

    const renderIcon = () => {
      switch (provider) {
        case 'google':
          return (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
          )
        case 'facebook':
          return (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
            </svg>
          )
        case 'apple':
          return (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.61 1.34-.56.64-1.05 1.7-0.92 2.73 1 .08 2.01-.49 2.6-1.22" />
            </svg>
          )
      }
    }

    const shapeStyles = {
      pill: 'rounded-full px-6 py-3 min-h-[48px] w-full',
      rounded: 'rounded-xl px-5 py-3 min-h-[48px] w-full',
      icon: 'rounded-xl p-3 w-12 h-12 justify-center',
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-3 border border-neutral-200 bg-white font-medium text-neutral-800 transition-all duration-200 hover:bg-neutral-50 active:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-sm shadow-subtle disabled:opacity-60 disabled:cursor-not-allowed',
          shapeStyles[variant],
          className
        )}
        {...props}
      >
        {renderIcon()}
        {!isIconOnly && (
          <span>{children || `${actionText} ${providerNames[provider]}`}</span>
        )}
      </button>
    )
  }
)

SocialButton.displayName = 'SocialButton'
