import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'accent' | 'secondary'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'xl' | '2xl' | '3xl'
  isInteractive?: boolean
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'lg',
  rounded = '2xl',
  isInteractive = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-neutral-100 shadow-card',
    elevated: 'bg-white shadow-card-hover border border-neutral-100/80',
    outline: 'bg-white border border-neutral-200',
    accent: 'bg-accent-50 border border-accent-200',
    secondary: 'bg-secondary-50 border border-secondary-200',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
    xl: 'p-6 sm:p-8',
  }

  const roundedStyles = {
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  return (
    <div
      className={cn(
        'transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        roundedStyles[rounded],
        isInteractive &&
          'cursor-pointer hover:shadow-card-hover hover:border-primary/30 active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
