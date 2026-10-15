import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { X } from 'lucide-react'
import { Button } from '../ui'

export interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle: string
  buttonText: string
  onButtonClick: () => void
  isLoading?: boolean
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  subtitle,
  buttonText,
  onButtonClick,
  isLoading = false,
}: CelebrationModalProps) {
  useEffect(() => {
    if (!isOpen) return

    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#800090', '#ECD4ED', '#89CFF0', '#F59E0B', '#10B981'],
      })
    } catch {
      // Graceful fallback if canvas-confetti isn't supported in environment
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-[420px] rounded-3xl bg-white p-7 text-center shadow-2xl transition-all scale-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebration / Confetti Graphic */}
        <div className="relative mx-auto mt-2 mb-4 flex h-44 w-full items-center justify-center overflow-hidden">
          {/* Subtle soft circular glow background */}
          <div className="absolute h-36 w-36 rounded-full bg-[#EBF5FB]" />

          {/* Render image from public directory with high visual fidelity */}
          <img
            src="/images/confetti-celebration.png"
            alt="Celebration"
            className="relative z-10 max-h-40 w-auto object-contain"
            onError={(e) => {
              // Fallback SVG if image not loaded
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>

        {/* Modal Title */}
        <h3 className="text-2xl font-bold text-neutral-900 tracking-tight font-sans">
          {title}
        </h3>

        {/* Modal Subtitle */}
        <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed max-w-[320px] mx-auto">
          {subtitle}
        </p>

        {/* Action CTA Button */}
        <div className="mt-7">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            onClick={onButtonClick}
            className="bg-[#800090] hover:bg-[#6b0079] text-white shadow-button py-3.5 text-base font-semibold"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CelebrationModal
