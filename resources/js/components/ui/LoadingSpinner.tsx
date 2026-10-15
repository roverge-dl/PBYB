import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'white' | 'neutral' | 'accent'
  label?: string
  className?: string
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-10 h-10',
}

const variantMap = {
  primary: 'text-primary',
  white: 'text-white',
  neutral: 'text-neutral-500',
  accent: 'text-accent',
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className,
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center justify-center gap-2', className)}
    >
      <Loader2
        className={cn('animate-spin', sizeMap[size], variantMap[variant])}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  )
}

export default LoadingSpinner
