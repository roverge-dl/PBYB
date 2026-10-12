# PBYB (Pregnancy Build Your Blood) - Architecture & Coding Standards

This document outlines the architecture, directory conventions, and coding patterns adopted for the **PBYB Challenge Platform**.

---

## 1. Architectural Strategy: Coupled Monolith (AdonisJS + Inertia.js React)
* **Single Codebase**: Houses backend routing, business logic, PostgreSQL database migrations, background queues, and frontend React components.
* **Inertia.js**: Bridges backend AdonisJS controllers to client-side React views without maintaining an out-of-band GraphQL/REST API layer, meeting the 7-day Phase 1 production deployment deadline.
* **AWS Services**:
  - **AWS S3**: Handles lab report images, food uploads, and receipts.
  - **AWS SES**: Transactional emails, account verification OTPs, and payment confirmation receipts.

---

## 2. Controller-Service-Response Pattern

### A. Controller Flow
Every controller action strictly follows this lifecycle:
1. **Receive Request**: Pull relevant inputs using `request.only([...])` or `request.input(...)`.
2. **Validate Request**: Execute domain schema function powered by `app/utils/buchi.ts`.
3. **Handle Validation Failure**: If `validatedData.status === false`, immediately return HTTP 409 with:
   ```json
   {
     "status": "fail",
     "errors": { "field": ["error message"] },
     "message": "Descriptive message"
   }
   ```
4. **Delegate to Dedicated Service**: Controller never performs database queries directly; it calls an `@inject()`-ed service.
5. **Standardized Response Envelope**:
   ```json
   {
     "status": "success",
     "message": "Action was successful",
     "data": { ... }
   }
   ```
6. **Error Handling**: Catch block catches exceptions and formats:
   ```json
   {
     "status": "fail",
     "message": error.message || "Fallback error message",
     "error": error.message
   }
   ```

### B. Avoiding Transformers
Per project guidelines, transformers are bypassed. Controllers and services return models, plain objects, or explicit DTOs directly.

---

## 3. Custom Validation Library (`app/utils/buchi.ts`)
The validation framework matches the `birthsafe-backend` implementation:
- Rule definition in `app/validators/*.ts`.
- Supports rules:
  - `required: boolean`
  - `email: boolean`
  - `unique: 'table_name'` (runs Lucid DB checks)
  - `exists: 'table_name'`
  - `min_length: number`, `max_length: number`, `char_length: number`
  - `must_have_number: boolean`
  - `has_special_character: boolean`
  - `in: any[]`
  - `numeric: boolean`, `boolean: boolean`
  - `max_size: number` (MB), `allowed_extensions: string[]` (for S3 file uploads)

---

## 4. AWS Services Integration

### AWS S3 (`app/services/upload_service.ts`)
- Presigned upload signatures (`generateUploadSignature`) for client direct uploads.
- Server-side multipart streaming (`uploadFile`).
- Signed read URLs (`getSignedReadUrl`) for medical lab reports.
- Object deletion (`deleteFile`).

### AWS SES (`app/services/mail_service.ts`)
- Automated transaction receipts (`sendRegistrationReceipt`).
- Email verification OTP dispatch (`sendOtpMail`).
- Direct SES client integration using `@aws-sdk/client-ses`.

---

## 5. Directory Structure
```
pbcb/
├── app/
│   ├── controllers/
│   │   ├── auth_controller.ts
│   │   ├── payment_controller.ts
│   │   └── referral_controller.ts
│   ├── services/
│   │   ├── auth_service.ts
│   │   ├── mail_service.ts               # AWS SES
│   │   ├── paystack_service.ts
│   │   ├── registration_payment_service.ts
│   │   ├── referral_service.ts
│   │   └── upload_service.ts             # AWS S3
│   ├── utils/
│   │   └── buchi.ts                      # Custom validation engine
│   └── validators/
│       ├── auth.ts
│       ├── payment.ts
│       └── referral.ts
├── config/
├── start/
│   ├── env.ts
│   └── routes.ts
├── ARCHITECTURE.md
├── pbyb.pdf
└── package.json
```
