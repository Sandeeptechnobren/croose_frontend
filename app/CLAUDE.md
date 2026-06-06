# app/ — Next.js App Router root

## Purpose
The entire frontend lives here (no `src/`). A Next.js 15 App Router SPA dashboard for business owners, talking to the Laravel API over axios. Routes are split into two groups: `(public)` (unauthenticated) and `(private)` (authenticated).

## Key files / subdirectories
- `layout.tsx` — root layout; mounts global providers and the `react-toastify` container.
- `page.tsx` — home route (renders the signup form). `globals.css` — Tailwind v4 entry.
- `(public)/` — login, signup, email verification, forgot-password + client-side route guard.
- `(private)/` — the dashboard app (spaces, products, orders, appointments, messaging, subscriptions, payments) + ~40 shared components.
- `Apis/publicapi.tsx` — **the single API client**; every backend call goes through it.
- `context/SettingContext.tsx`, `content/Content.tsx` — global settings-modal state + mount point. `(private)/Iqcontext.tsx` — Space-IQ flag context.

## Data flow
Browser → a `page.tsx` (client component) → imports a named function from `@/app/Apis/publicapi` → axios call with `Authorization: Bearer <token>` (token from `localStorage`) → Laravel API → `response.data` rendered.

## Dependencies
- **Depends on:** the Laravel API (`NEXT_PUBLIC_API_BASE_URL`), axios, Formik, Tailwind v4, MUI v7, react-toastify.
- **Depended on by:** nothing — this is the top of the frontend.

## Conventions
- Components: typed `React.FC<Props>`, Tailwind inline, `export default`. See `docs/PATTERNS.md` §9 (in the backend repo's `docs/`).
- Path alias `@/*` → project root; import shared modules via `@/app/...`.
- Add `"use client"` to anything using hooks/state/`localStorage`.

## Common commands
```
npm install
npm run dev      # next dev --turbopack (http://localhost:3000)
npm run build && npm run start
```
