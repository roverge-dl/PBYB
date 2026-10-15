import React, { forwardRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { AlertCircle, ChevronDown } from 'lucide-react'

export interface CountryCode {
  name: string
  code: string
  flag: string
  dialCode: string
}

export const COUNTRIES: CountryCode[] = [
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬', dialCode: '+234' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭', dialCode: '+233' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪', dialCode: '+254' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', dialCode: '+1' },
]

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  hint?: string
  error?: string
  selectedCountry?: CountryCode
  onCountryChange?: (country: CountryCode) => void
  onChange?: (value: string, dialCode: string) => void
  containerClassName?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      label = 'Phone Number',
      hint,
      error,
      selectedCountry = COUNTRIES[0],
      onCountryChange,
      onChange,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [currentCountry, setCurrentCountry] = useState<CountryCode>(selectedCountry)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const isError = Boolean(error)

    const handleCountrySelect = (c: CountryCode) => {
      setCurrentCountry(c)
      onCountryChange?.(c)
      setIsDropdownOpen(false)
    }

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-800 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <div
            className={cn(
              'flex items-center w-full bg-white rounded-xl border transition-all duration-200 min-h-[48px] px-3 focus-within:ring-2',
              isError
                ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20'
                : 'border-neutral-200 hover:border-neutral-300 focus-within:border-primary focus-within:ring-primary/20',
              disabled && 'bg-neutral-50 cursor-not-allowed opacity-80'
            )}
          >
            {/* Country Selector */}
            <div className="relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 pr-2 py-1 text-sm font-medium text-neutral-700 hover:text-neutral-900 focus:outline-none select-none"
              >
                <span className="text-xl leading-none">{currentCountry.flag}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-sm text-neutral-600 pl-1">{currentCountry.dialCode}</span>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl border border-neutral-200 shadow-card py-1 z-50 max-h-60 overflow-y-auto">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-neutral-50 transition-colors',
                          currentCountry.code === country.code &&
                            'bg-accent-100/50 text-primary font-medium'
                        )}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="flex-1 truncate">{country.name}</span>
                        <span className="text-neutral-400">{country.dialCode}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-neutral-200 mx-2" />

            {/* Input field */}
            <input
              id={inputId}
              ref={ref}
              type="tel"
              disabled={disabled}
              onChange={(e) => onChange?.(e.target.value, currentCountry.dialCode)}
              placeholder="7012345678"
              className={cn(
                'flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 text-sm font-normal outline-none py-2.5',
                className
              )}
              {...props}
            />
          </div>
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

PhoneInput.displayName = 'PhoneInput'
