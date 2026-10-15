import React from 'react'
import { cn } from '../../lib/utils'
import { Pencil } from 'lucide-react'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  name?: string
  initials?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'primary' | 'accent' | 'secondary' | 'neutral'
  badge?: React.ReactNode
  showEditBadge?: boolean
  onEditClick?: () => void
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = '',
  name,
  initials,
  size = 'md',
  variant = 'primary',
  badge,
  showEditBadge = false,
  onEditClick,
  ...props
}) => {
  const getInitials = () => {
    if (initials) return initials
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const sizeStyles = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  }

  const variantStyles = {
    primary: 'bg-primary-900 text-white font-semibold',
    accent: 'bg-accent-200 text-primary-900 font-semibold',
    secondary: 'bg-secondary-200 text-secondary-950 font-semibold',
    neutral: 'bg-neutral-200 text-neutral-800 font-semibold',
  }

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)} {...props}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-subtle',
          sizeStyles[size],
          variantStyles[variant]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials()}</span>
        )}
      </div>

      {badge && (
        <div className="absolute -bottom-1 -right-1 z-10 flex items-center justify-center">
          {badge}
        </div>
      )}

      {showEditBadge && (
        <button
          type="button"
          onClick={onEditClick}
          className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white shadow-card hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Edit profile picture"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
