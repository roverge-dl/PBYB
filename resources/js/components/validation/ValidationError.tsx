import React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ValidationErrorProps {
  /** Single error message or list of error messages from validator.js */
  error?: string | string[] | null
  /** If multiple errors are present, show all of them as a list (default: false, shows first) */
  showAll?: boolean
  className?: string
}

/**
 * Accompanying component for validator.js:
 * Displays field-level validation errors cleanly with icons and accessible labels.
 */
export const ValidationError: React.FC<ValidationErrorProps> = ({
  error,
  showAll = false,
  className,
}) => {
  if (!error) return null

  const errorMessages: string[] = Array.isArray(error)
    ? error.filter(Boolean)
    : [error].filter(Boolean)

  if (errorMessages.length === 0) return null

  if (showAll && errorMessages.length > 1) {
    return (
      <div
        role="alert"
        className={cn('flex flex-col gap-1 text-xs text-red-500 mt-1', className)}
      >
        {errorMessages.map((msg, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span>{msg}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      role="alert"
      className={cn('flex items-center gap-1.5 text-xs text-red-500 mt-1', className)}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
      <span>{errorMessages[0]}</span>
    </div>
  )
}

export default ValidationError
