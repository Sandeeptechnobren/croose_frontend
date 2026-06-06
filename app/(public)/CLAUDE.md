# app/(public)/ — unauthenticated pages

## Purpose
Pre-login screens: account creation, sign-in, email/OTP verification, and password recovery. The `(public)` folder is a Next.js route group (not part of the URL). A client-side guard sends already-authenticated users to the dashboard.

## Key files / subdirectories
- `login/page.tsx` — sign-in; calls `loginApi` then `verifyToken` from `@/app/Apis/publicapi`, stores the token in `localStorage`.
- `signup/page.tsx` — registration; uses `registerApi`, `verifySignupOtpApi`, `completeRegistrationApi`.
- `emailverification/` — email/OTP confirmation step.
- `forgotcard/page.tsx` — forgot-password entry (`addForgetPassword`).
- `component/publiroute.tsx` — client-side guard: redirects to the dashboard if a token already exists.
- `component/navbar.tsx`, `component/selectbox.tsx`, `component/page.tsx` — shared pre-auth UI.

## Data flow
User submits a form (Formik) → page calls a `@/app/Apis/publicapi` function → axios → Laravel `AuthController` (`/login`, `/register`, `/send_otp`, reset endpoints) → on success the token is saved to `localStorage` and the user is routed into `(private)`.

## Dependencies
- **Depends on:** `@/app/Apis/publicapi` (auth functions), Formik, Tailwind, react-toastify.
- **Depended on by:** routed by Next.js; `publiroute.tsx` complements the `(private)` auth gate.

## Conventions
- Pages are `"use client"` components using Formik for forms. Default exports.
- ⚠️ Two reset endpoints exist (`/reset_password` vs `/reset-password`) — one is likely stale; confirm against `routes/api.php` before wiring new reset UI.
- See `docs/PATTERNS.md` §9 & §12 (in the backend repo's `docs/`).

## Common commands
None group-specific; run with `npm run dev`.
