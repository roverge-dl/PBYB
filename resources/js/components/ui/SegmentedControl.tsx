import React from 'react'
import { cn } from '../../lib/utils'

export interface SegmentedControlItem<T extends string | number> {
  value: T
  label: React.ReactNode
  badge?: React.ReactNode
}

export interface SegmentedControlProps<T extends string | number> {
  items: SegmentedControlItem<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullWidth?: boolean
}

export function SegmentedControl<T extends string | number>({
  items,
  value,
  onChange,
  size = 'md',
  className,
  fullWidth = false,
}: SegmentedControlProps<T>) {
  const sizeStyles = {
    sm: 'p-1 text-xs min-h-[36px]',
    md: 'p-1.5 text-sm min-h-[46px]',
    lg: 'p-2 text-base min-h-[52px]',
  }

  const itemPadding = {
    sm: 'px-3 py-1',
    md: 'px-5 py-2',
    lg: 'px-6 py-2.5',
  }

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center bg-white rounded-2xl border border-neutral-100 shadow-subtle',
        sizeStyles[size],
        fullWidth && 'w-full flex',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value

        return (
          <button
            key={String(item.value)}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
              itemPadding[size],
              fullWidth && 'flex-1',
              isActive
                ? 'bg-accent-200 text-primary-950 font-semibold shadow-subtle'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            <span>{item.label}</span>
            {item.badge && <span>{item.badge}</span>}
          </button>
        )
      })}
    </div>
  )
}
