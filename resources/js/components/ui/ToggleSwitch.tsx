import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Check, Minus } from 'lucide-react'

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
  containerClassName?: string
  id?: string
}

export const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      disabled = false,
      className,
      containerClassName,
      id,
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-3 select-none',
          disabled && 'opacity-60 cursor-not-allowed',
          containerClassName
        )}
      >
        <button
          id={id}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            checked ? 'bg-primary' : 'bg-[#D1D5DB]',
            disabled && 'cursor-not-allowed',
            className
          )}
        >
          <span
            className={cn(
              'pointer-events-none flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-subtle ring-0 transition duration-200 ease-in-out',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          >
            {checked ? (
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
            ) : (
              <Minus className="w-3.5 h-3.5 text-neutral-400" strokeWidth={3} />
            )}
          </span>
        </button>

        {(label || description) && (
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => !disabled && onChange(!checked)}
          >
            {label && (
              <span className="text-sm font-medium text-neutral-800 leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-neutral-500 mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

ToggleSwitch.displayName = 'ToggleSwitch'
