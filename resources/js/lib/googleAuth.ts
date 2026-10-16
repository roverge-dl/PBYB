/**
 * Google Sign-In SDK helper for Google Identity Services (GIS)
 * Handles client library loading, token generation, and popup trigger.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          prompt: (momentListener?: (notification: any) => void) => void
          renderButton: (parent: HTMLElement, options: any) => void
        }
      }
    }
  }
}

let scriptLoadPromise: Promise<boolean> | null = null

export function loadGoogleScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.google?.accounts?.id) return Promise.resolve(true)

  if (scriptLoadPromise) return scriptLoadPromise

  scriptLoadPromise = new Promise((resolve) => {
    const existing = document.getElementById('google-gsi-client')
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.id = 'google-gsi-client'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.warn('Failed to load Google GIS client library from accounts.google.com')
      resolve(false)
    }
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

export interface GoogleAuthResponse {
  idToken: string
  email?: string
  name?: string
}

/**
 * Triggers Google Sign-In popup or fallback simulation in development
 */
export async function triggerGoogleAuth(options?: {
  clientId?: string
  role?: 'pregnant_mum' | 'nurse'
  defaultEmail?: string
}): Promise<string> {
  const clientId = options?.clientId

  // If a valid Google Client ID is provided, try official Google One Tap / GSI
  if (clientId && clientId.trim() !== '') {
    const loaded = await loadGoogleScript()
    if (loaded && window.google?.accounts?.id) {
      return new Promise<string>((resolve, reject) => {
        try {
          window.google!.accounts.id.initialize({
            client_id: clientId,
            callback: (res) => {
              if (res?.credential) {
                resolve(res.credential)
              } else {
                reject(new Error('No credential returned from Google'))
              }
            },
            cancel_on_tap_outside: true,
          })

          // Trigger prompt
          window.google!.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.info('Google GSI prompt skipped or not displayed:', notification.getNotDisplayedReason?.())
            }
          })
        } catch (err) {
          reject(err)
        }
      })
    }
  }

  // Fallback dev token for local testing without OAuth Client credentials
  // This produces a base64 encoded payload that backend GoogleAuthService parses
  const devPayload = {
    email: options?.defaultEmail || `google_mama_${Date.now().toString().slice(-5)}@example.com`,
    sub: `google_user_${Date.now()}`,
    given_name: options?.role === 'nurse' ? 'Nurse' : 'Sarah',
    family_name: 'Udo',
  }
  const token = `dev_token_${btoa(JSON.stringify(devPayload))}`
  return Promise.resolve(token)
}
