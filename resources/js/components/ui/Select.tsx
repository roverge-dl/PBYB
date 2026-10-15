import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { ChevronDown, AlertCircle } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  hint?: string
  error?: string
  options?: SelectOption[]
  placeholder?: string
  containerClassName?: string
  children?: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      hint,
      error,
      options,
      placeholder = 'Select',
      containerClassName,
      id,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const isError = Boolean(error)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-800 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-neutral-900 text-sm font-normal rounded-xl border transition-all duration-200 outline-none appearance-none cursor-pointer',
              'min-h-[48px] px-4 py-3 pr-10',
              isError
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20',
              disabled && 'bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-neutral-400">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="text-neutral-900 py-1"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 pointer-events-none text-neutral-400" />
        </div>

        {error ? (
          <div className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : hint ? (
          <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Select.displayName = 'Select'
