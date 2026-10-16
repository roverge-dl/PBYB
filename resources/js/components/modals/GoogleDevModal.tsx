import React, { useState } from 'react'
import { Modal, Button, Input } from '../ui'
import { Sparkles, Mail, CheckCircle2 } from 'lucide-react'

export interface GoogleDevModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (customEmail: string) => void
  role?: 'pregnant_mum' | 'nurse'
  isLoading?: boolean
}

export function GoogleDevModal({
  isOpen,
  onClose,
  onConfirm,
  role = 'pregnant_mum',
  isLoading = false,
}: GoogleDevModalProps) {
  const roleLabel = role === 'nurse' ? 'Affiliate / Nurse' : 'Pregnant Mum'
  const defaultEmail = role === 'nurse' ? 'nurse.chisom@gmail.com' : 'sarah.udo@gmail.com'
  const [email, setEmail] = useState(defaultEmail)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onConfirm(email.trim())
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Sign-In"
      description={`Authenticate as ${roleLabel} using Google`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-neutral-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900">Google Account Selected</p>
            <p className="text-xs text-neutral-500 truncate">Role: <span className="font-medium text-primary">{roleLabel}</span></p>
          </div>
        </div>

        <div>
          <Input
            label="Google Account Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-name@gmail.com"
            helperText="Confirm or enter the Google account to authenticate with"
            required
            autoFocus
          />
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Email verification is automatically completed via Google. You'll be redirected straight to activate membership or dashboard.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Continue with Google
          </Button>
        </div>
      </form>
    </Modal>
  )
}
