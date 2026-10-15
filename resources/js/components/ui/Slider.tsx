import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  onChange: (value: number) => void
  containerClassName?: string
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      step = 1,
      label,
      showValue = false,
      onChange,
      disabled,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

    return (
      <div className={cn('w-full flex flex-col gap-2', containerClassName)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-sm font-medium text-neutral-800">
            {label && <span>{label}</span>}
            {showValue && <span className="text-primary font-semibold">{value}</span>}
          </div>
        )}

        <div className="relative flex items-center h-6 w-full select-none">
          {/* Background Track */}
          <div className="absolute w-full h-2 rounded-full bg-accent-400 overflow-hidden">
            {/* Active Left Track */}
            <div
              className="h-full bg-primary rounded-full transition-all duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Native Range Input (Transparent overlay with custom thumb) */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              'absolute w-full h-2 opacity-0 cursor-pointer z-10',
              disabled && 'cursor-not-allowed',
              className
            )}
            {...props}
          />

          {/* Custom Styled Thumb */}
          <div
            className="absolute pointer-events-none w-5 h-5 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)] border border-neutral-100 transition-all duration-75 transform -translate-x-1/2"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'
