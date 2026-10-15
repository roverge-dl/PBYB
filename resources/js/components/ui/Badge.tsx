import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  isPill?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  isPill = true,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200/60',
    accent: 'bg-accent-200 text-primary-900 border border-accent-300',
    secondary: 'bg-secondary-100 text-secondary-900 border border-secondary-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium select-none',
        sizeStyles[size],
        isPill ? 'rounded-full' : 'rounded-lg',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </span>
  )
}
