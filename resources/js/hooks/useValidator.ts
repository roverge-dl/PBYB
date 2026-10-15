import { useState, useCallback } from 'react'
import { runValidation, ValidationFieldObject, ValidationErrors } from '../utils/validator'

export interface UseValidatorReturn {
  /** Record of field name -> first error message string for direct input binding */
  errors: Record<string, string>
  /** Record of field name -> array of all error messages */
  errorList: ValidationErrors
  /** General non-field error message */
  generalError: string | null
  /** Check if a field has any error */
  hasError: (field: string) => boolean
  /** Get first error message for a field */
  getError: (field: string) => string | undefined
  /** Run client-side validation using validator.js */
  validate: (fields: ValidationFieldObject[]) => Promise<boolean>
  /** Set backend errors from Adonis API response */
  setServerErrors: (errorData: any, defaultMessage?: string) => void
  /** Clear an error when user modifies a field */
  clearError: (field: string) => void
  /** Set a general error banner */
  setGeneralError: (message: string | null) => void
  /** Clear all errors */
  clearAllErrors: () => void
}

/**
 * Custom hook to integrate validator.js into React forms with state awareness
 */
export function useValidator(): UseValidatorReturn {
  const [errorList, setErrorList] = useState<ValidationErrors>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
    setErrorList((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
    setErrorList({})
    setGeneralError(null)
  }, [])

  const validate = useCallback(async (fields: ValidationFieldObject[]): Promise<boolean> => {
    clearAllErrors()
    const result = await runValidation(fields)

    if (result.status === false && result.errors) {
      setErrorList(result.errors)
      const firstErrors: Record<string, string> = {}
      for (const [key, msgs] of Object.entries(result.errors)) {
        if (msgs && msgs.length > 0) {
          firstErrors[key] = msgs[0]
        }
      }
      setErrors(firstErrors)
      return false
    }

    return true
  }, [clearAllErrors])

  const setServerErrors = useCallback((errorData: any, defaultMessage: string = 'Validation failed') => {
    if (!errorData) {
      setGeneralError(defaultMessage)
      return
    }

    // Handle object structure from Adonis backend: { errors: { email: ["..."], ... }, message: "..." }
    if (errorData.errors && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
      setErrorList(errorData.errors)
      const firstErrors: Record<string, string> = {}
      for (const [key, msgs] of Object.entries(errorData.errors)) {
        if (Array.isArray(msgs) && msgs.length > 0) {
          firstErrors[key] = msgs[0] as string
        } else if (typeof msgs === 'string') {
          firstErrors[key] = msgs
        }
      }
      setErrors(firstErrors)
      if (errorData.message) {
        setGeneralError(errorData.message)
      }
      return
    }

    // Handle array structure: [ { field: 'email', message: '...' } ]
    if (Array.isArray(errorData.errors)) {
      const fieldMap: Record<string, string> = {}
      const listMap: ValidationErrors = {}
      errorData.errors.forEach((err: { field?: string; message?: string }) => {
        if (err.field && err.message) {
          fieldMap[err.field] = err.message
          listMap[err.field] = listMap[err.field] ? [...listMap[err.field], err.message] : [err.message]
        }
      })
      setErrors(fieldMap)
      setErrorList(listMap)
      if (errorData.message) setGeneralError(errorData.message)
      return
    }

    // Handle general message
    if (typeof errorData.message === 'string') {
      setGeneralError(errorData.message)
      return
    }

    if (typeof errorData === 'string') {
      setGeneralError(errorData)
      return
    }

    setGeneralError(defaultMessage)
  }, [])

  const hasError = useCallback((field: string): boolean => {
    return Boolean(errors[field])
  }, [errors])

  const getError = useCallback((field: string): string | undefined => {
    return errors[field]
  }, [errors])

  return {
    errors,
    errorList,
    generalError,
    hasError,
    getError,
    validate,
    setServerErrors,
    clearError,
    setGeneralError,
    clearAllErrors,
  }
}

export default useValidator
