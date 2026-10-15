import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Check } from 'lucide-react'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: string
  containerClassName?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, containerClassName, id, checked, disabled, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-3 cursor-pointer select-none group',
          disabled && 'cursor-not-allowed opacity-60',
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center',
              'border-neutral-300 bg-white group-hover:border-primary/60',
              'peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20',
              disabled && 'bg-neutral-100 border-neutral-200 peer-checked:bg-neutral-300 peer-checked:border-neutral-300',
              className
            )}
          >
            <Check
              strokeWidth={3}
              className={cn(
                'w-3.5 h-3.5 text-white transition-opacity duration-150',
                checked ? 'opacity-100' : 'opacity-0'
              )}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
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
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
