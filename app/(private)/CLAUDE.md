# app/(private)/ — authenticated dashboard

## Purpose
The signed-in business-owner application: a route group (the `(private)` folder name is a Next.js grouping and does **not** appear in the URL). Contains the dashboard pages plus ~40 shared UI components. Access is gated client-side by a token check.

## Key files / subdirectories
- `dashboard/layout.tsx` — the auth gate: calls `verifyToken()` and redirects to `/login` on failure; wraps all dashboard pages.
- `dashboard/` — feature pages, each a `page.tsx`: `home`, `overview`, `space`, `appointment`, `customers`, `product`, `orders`, `messaging`, `subscription`, `payments`, `payout`, `liveagent1/3/4/5`, `support`, `yourspace`, etc.
- `customerspace/`, `customisespace/`, `spacebusiness/` — space setup/customization flows.
- `components/` — shared UI: `ConfirmationModal.tsx`, `StatusBadge.tsx`, `Navbar.tsx`, `table.tsx`, `pagination.tsx`, `spaceiq.tsx`, `upgradetopro.tsx`, `setting1/2/3.tsx`, `material/` (MUI-based).
- `Iqcontext.tsx` — React context for the Space-IQ feature flag.

## Data flow
`dashboard/layout.tsx` verifies the `localStorage` token → renders the page → page (client component) calls `@/app/Apis/publicapi` functions → axios → Laravel API → state → render. Modals/components receive data via props.

## Dependencies
- **Depends on:** `@/app/Apis/publicapi`, `@/app/context/SettingContext`, `Iqcontext`, MUI v7, Tailwind, react-toastify/react-hot-toast.
- **Depended on by:** routed directly by Next.js; not imported elsewhere.

## Conventions
- Pages are `page.tsx` with `"use client"`. Components are `React.FC<Props>` default exports (see `docs/PATTERNS.md` §9 in the backend repo).
- ⚠️ Auth here is a **UX guard only**, not a security boundary — the API must enforce auth.
- ⚠️ Component file casing is mixed (`ConfirmationModal.tsx` vs `croosehq.tsx`, `setting1.tsx`).

## Common commands
None group-specific; run the app with `npm run dev`.
