import React from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface FormErrorBannerProps {
  message?: string | null
  errors?: Record<string, string[] | string> | null
  onClose?: () => void
  className?: string
}

/**
 * Accompanying component for validator.js:
 * Displays form-level error banners and summaries of failed fields.
 */
export const FormErrorBanner: React.FC<FormErrorBannerProps> = ({
  message,
  errors,
  onClose,
  className,
}) => {
  if (!message && (!errors || Object.keys(errors).length === 0)) {
    return null
  }

  // Extract all distinct error messages if present
  const errorEntries = errors
    ? Object.entries(errors).flatMap(([_, val]) => (Array.isArray(val) ? val : [val]))
    : []

  return (
    <div
      role="alert"
      className={cn(
        'mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            {message && <p className="font-semibold text-red-800">{message}</p>}
            {errorEntries.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 text-red-600">
                {errorEntries.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 -mt-1 text-red-400 hover:text-red-600 rounded-md transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default FormErrorBanner
