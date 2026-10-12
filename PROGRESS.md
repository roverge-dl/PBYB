# PBYB (Pregnancy Build Your Blood) - Project Progress & State

**Date:** October 12, 2026  
**Status:** Phase 1 Foundation Complete & Ready for Figma Design System Integration  
**Git Branch:** `master` (All changes cleanly committed)

---

## 1. What Has Been Completed

### A. Architectural Standards & Design Patterns
- **Coupled Monolith**: AdonisJS + Inertia.js (React) in a single unified codebase.
- **Strict Controller Pattern**:
  - Request received via `request.only([...])`.
  - Validated using custom validation library [`app/utils/buchi.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/utils/buchi.ts).
  - Validation failures return HTTP 409 `{ status: 'fail', errors: ..., message: '...' }`.
  - Dedicated business logic encapsulated in `@inject()` services.
  - Standard response envelope: `{ status: 'success' | 'fail', message: string, data?: any, error?: string, errors?: any }`.
  - Zero unnecessary transformers.

### B. Cloud & External Services
- **AWS S3 File Service** ([`app/services/upload_service.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/services/upload_service.ts)): Presigned client upload signatures, server-side uploads, signed read URLs for lab results, and file deletion.
- **AWS SES Email Service** ([`app/services/mail_service.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/services/mail_service.ts)): Transactional email dispatches, OTP verification codes, and registration payment receipts.
- **Paystack Payment Rails** ([`app/services/paystack_service.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/services/paystack_service.ts) & [`app/services/registration_payment_service.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/services/registration_payment_service.ts)):
  - ₦5,000 registration fee initialization and verification.
  - Automated webhook handler (`POST /api/v1/payments/webhook`) with HMAC SHA-512 signature verification.
  - Atomic database transactions updating `Transaction`, activating `User.isPaid`, crediting `Referral` commissions (₦1,000), and dispatching AWS SES receipts.

### C. Database Architecture & Lucid Models
All migrations and models use UUID primary keys with automatic generation:
- `users`: Base identity with auth finder (`withAuthFinder`), dual roles (`pregnant_mum`, `nurse`, `admin`), payment state, and referral codes.
- `pregnant_mum_profiles`: Gestational age, delivery date, health consent, baseline & completion PCV lab values, target tiers.
- `nurse_profiles`: Medical facility details, license info, and verified bank accounts for affiliate disbursements.
- `transactions`: Paystack gateway references, amounts (in Kobo and Naira), payment channels, and JSONB metadata.
- `referrals`: Referrer/referred tracking, commission amount, and status (`pending`, `approved`, `disbursed`).
- `daily_logs`: 14-day challenge submissions, camera enforcement flags, Gemini AI classification, green scores, and water intake.
- `payout_batches`: Admin payout approval ledger and CSV export links.
- `auth_access_tokens`: API tokens provider.
- `password_reset_tokens`: 6-digit OTP codes with 15-minute expirations.

### D. Authentication System (100% Complete)
- Session guard (`web`) for Inertia React and token guard (`api`).
- Google SSO via `google-auth-library` ([`app/services/google_auth_service.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/app/services/google_auth_service.ts)).
- Password reset & OTP flow via AWS SES.
- Authenticated user profile endpoint (`GET /api/v1/auth/me`).

### E. Frontend Setup & Initial Inertia React Views
- Inertia configuration ([`config/inertia.ts`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/config/inertia.ts), [`resources/views/inertia_layout.edge`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/resources/views/inertia_layout.edge), [`resources/js/app.tsx`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/resources/js/app.tsx)).
- **Registration Page** ([`resources/js/pages/auth/register.tsx`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/resources/js/pages/auth/register.tsx)): Role toggle, referral code auto-detection, and account creation.
- **Public Referral Leaderboard** ([`resources/js/pages/referrals/leaderboard.tsx`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/resources/js/pages/referrals/leaderboard.tsx)): Podium badges and live rankings.
- **Pre-Challenge Dashboard** ([`resources/js/pages/dashboard/pre_challenge.tsx`](file:///C:/Users/Dell/Documents/Buchi/buchi/dev/pbcb/resources/js/pages/dashboard/pre_challenge.tsx)): Payment indicator, Paystack checkout trigger, 1-click link/WhatsApp sharing, and pre-challenge checklists.

---

## 2. Exactly Where We Stopped & Next Steps

We paused right at the entry point of **UI Design System & Figma Screen Integration**:

1. **Step 1 on Resumption**: Ingest Figma screens and design tokens:
   - Configure `tailwind.config.js` with exact colors, typography, border radii, and shadows from Figma.
   - Build reusable UI primitives (Buttons, Form inputs with `buchi.ts` error displays, Badges, Modals).
2. **Step 2**: Polish existing Phase 1 screens and build remaining ones to match Figma:
   - Public Landing / Home Page (`resources/js/pages/home.tsx`).
   - Login Page (`resources/js/pages/auth/login.tsx`) with Google SSO button.
   - Forgot & Reset Password pages.
3. **Step 3**: Transition to **Phase 2 (Vision AI & Challenge Progression)**:
   - Google Gemini 3.1 Flash-Lite service for PCV lab OCR and dietary green-food validation.
   - Hardware camera enforcement UI (`capture="environment"`).
