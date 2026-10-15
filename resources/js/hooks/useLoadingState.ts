import { useState, useRef, useEffect, useCallback } from 'react'

export interface UseLoadingOptions {
  /** Maximum duration before safety watchdog automatically terminates loading (ms). Default: 12000 */
  timeoutMs?: number
  /** Callback fired if the safety watchdog fires because an async action or session stalled */
  onTimeout?: () => void
  /** Callback fired on error */
  onError?: (error: unknown) => void
}

export interface UseLoadingStateReturn {
  isLoading: boolean
  isIdle: boolean
  isDone: boolean
  isFailed: boolean
  setIsLoading: (val: boolean) => void
  startLoading: (customTimeout?: number) => void
  stopLoading: (status?: 'done' | 'failed' | 'idle') => void
  /**
   * Executes an async operation wrapped in state-aware lifecycle management.
   * Automatically guarantees that loading state resets even if exceptions, session stalls, or network breaks occur.
   */
  withLoading: <T>(
    asyncFn: () => Promise<T>,
    options?: { timeoutMs?: number; onError?: (err: unknown) => void; onSuccess?: (val: T) => void }
  ) => Promise<T | undefined>
}

/**
 * State-aware loading state hook:
 * Prevents eternal loading spinners when requests, sessions, or navigation handlers fail or finish.
 */
export function useLoadingState(initialLoading: boolean = false, options: UseLoadingOptions = {}): UseLoadingStateReturn {
  const { timeoutMs = 12000, onTimeout, onError: defaultOnError } = options

  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'failed'>(
    initialLoading ? 'loading' : 'idle'
  )

  const isMountedRef = useRef(true)
  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (watchdogTimerRef.current) {
        clearTimeout(watchdogTimerRef.current)
      }
    }
  }, [])

  const clearWatchdog = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current)
      watchdogTimerRef.current = null
    }
  }, [])

  const stopLoading = useCallback((status: 'done' | 'failed' | 'idle' = 'idle') => {
    clearWatchdog()
    if (isMountedRef.current) {
      setState(status)
    }
  }, [clearWatchdog])

  const startLoading = useCallback((customTimeout?: number) => {
    clearWatchdog()
    if (isMountedRef.current) {
      setState('loading')
    }

    const duration = customTimeout ?? timeoutMs
    if (duration > 0) {
      watchdogTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          console.warn(`[useLoadingState] Operation timed out after ${duration}ms, resetting loading state.`)
          setState('failed')
          if (onTimeout) onTimeout()
        }
      }, duration)
    }
  }, [clearWatchdog, timeoutMs, onTimeout])

  const setIsLoading = useCallback((val: boolean) => {
    if (val) {
      startLoading()
    } else {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      callOptions?: { timeoutMs?: number; onError?: (err: unknown) => void; onSuccess?: (val: T) => void }
    ): Promise<T | undefined> => {
      startLoading(callOptions?.timeoutMs)
      try {
        const result = await asyncFn()
        if (isMountedRef.current) {
          stopLoading('done')
          if (callOptions?.onSuccess) {
            callOptions.onSuccess(result)
          }
        }
        return result
      } catch (err) {
        if (isMountedRef.current) {
          stopLoading('failed')
          if (callOptions?.onError) {
            callOptions.onError(err)
          } else if (defaultOnError) {
            defaultOnError(err)
          }
        }
        throw err
      } finally {
        if (isMountedRef.current) {
          clearWatchdog()
        }
      }
    },
    [startLoading, stopLoading, clearWatchdog, defaultOnError]
  )

  return {
    isLoading: state === 'loading',
    isIdle: state === 'idle',
    isDone: state === 'done',
    isFailed: state === 'failed',
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}

export default useLoadingState
