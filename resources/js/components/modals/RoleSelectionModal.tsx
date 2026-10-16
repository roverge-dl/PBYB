import React, { useState } from 'react'
import { Modal, Button } from '../ui'
import { cn } from '../../lib/utils'

export type UserRoleType = 'pregnant_mum' | 'nurse'

export interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (role: UserRoleType) => void
  isLoading?: boolean
}

export function RoleSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('pregnant_mum')

  const handleConfirm = () => {
    onConfirm(selectedRole)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How will you be joining?"
      description="Choose your account type to complete your sign-up with Google."
      size="md"
    >
      <div className="space-y-4 pt-2">
        {/* Pregnant Mum Card */}
        <button
          type="button"
          onClick={() => setSelectedRole('pregnant_mum')}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200',
            selectedRole === 'pregnant_mum'
              ? 'border-[#800090] bg-[#800090]/5 ring-1 ring-[#800090]'
              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
              selectedRole === 'pregnant_mum' ? 'bg-[#800090]/15 text-[#800090]' : 'bg-neutral-100 text-neutral-600'
            )}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden="true">
              <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900">I&apos;m a Pregnant Mum</p>
            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
              Track blood count, build a daily health streak, and join the pregnancy challenge.
            </p>
          </div>
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
              selectedRole === 'pregnant_mum'
                ? 'border-[#800090] bg-[#800090]'
                : 'border-neutral-300 bg-white'
            )}
          >
            {selectedRole === 'pregnant_mum' && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </button>

        {/* Affiliate / Nurse Card */}
        <button
          type="button"
          onClick={() => setSelectedRole('nurse')}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200',
            selectedRole === 'nurse'
              ? 'border-[#800090] bg-[#800090]/5 ring-1 ring-[#800090]'
              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
          )}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors',
              selectedRole === 'nurse' ? 'bg-[#800090]/15 text-[#800090]' : 'bg-neutral-100 text-neutral-600'
            )}
          >
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6" aria-hidden="true">
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
              <circle cx="22" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 26c0-3.314 2.686-6 6-6h12c3.314 0 6 2.686 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900">I&apos;m an Affiliate Partner</p>
            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
              Invite expectant mothers with your personal link and earn rewards for every referral.
            </p>
          </div>
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
              selectedRole === 'nurse'
                ? 'border-[#800090] bg-[#800090]'
                : 'border-neutral-300 bg-white'
            )}
          >
            {selectedRole === 'nurse' && (
              <span className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  )
}
