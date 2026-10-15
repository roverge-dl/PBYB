import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'light' | 'danger' | 'white'
  size?: 'sm' | 'md' | 'lg'
  isPill?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isPill = true,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 active:scale-[0.98] select-none'

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[32px]',
      md: 'text-sm px-6 py-3 gap-2 min-h-[46px]',
      lg: 'text-base px-8 py-3.5 gap-2.5 min-h-[52px]',
    }

    const roundedStyles = isPill ? 'rounded-full' : 'rounded-xl'

    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary-700 active:bg-primary-800 shadow-button disabled:bg-[#EBEBEB] disabled:text-[#A8A8A8] disabled:shadow-none',
      secondary:
        'bg-transparent border border-primary text-primary hover:bg-accent-100/50 active:bg-accent-200/50 disabled:border-neutral-200 disabled:text-neutral-400',
      outline:
        'bg-transparent border border-primary text-primary hover:bg-accent-100/50 active:bg-accent-200/50 disabled:border-neutral-200 disabled:text-neutral-400',
      ghost:
        'bg-transparent text-primary hover:bg-accent-100/40 active:bg-accent-200/40 disabled:text-neutral-300',
      light:
        'bg-accent-100 text-primary-800 hover:bg-accent-200 active:bg-accent-300 disabled:bg-neutral-100 disabled:text-neutral-400',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500/30 disabled:bg-neutral-100 disabled:text-neutral-400',
      white:
        'bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 shadow-subtle disabled:bg-neutral-100 disabled:text-neutral-400',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          roundedStyles,
          variantStyles[variant],
          fullWidth && 'w-full',
          disabled && 'cursor-not-allowed pointer-events-none opacity-80',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
