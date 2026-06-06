# app/Apis/ — the single API client

## Purpose
One module, `publicapi.tsx`, contains **every** backend call in the app as individual named-export async functions. Each builds an axios request to `${BASE_URL}/api/...`, attaches the bearer token from `localStorage`, and returns `response.data`.

## Key files
- `publicapi.tsx` — the whole client. Notable exports:
  - `BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL` (defined ~line 1034).
  - `axiosRequest({method,url,headers,body,formData})` — shared wrapper that throws `new Error(error.response.data.message)`.
  - Domain functions: `loginApi`, `verifyToken`, `registerApi`, `createSpace`, `getSpaceList`, `getAllProducts`, `getAllServices`, `createSubscription`, `InstanceActivationStatus`, `getUserStatus`, `findAccountByEmail`, etc.

## Data flow
A page/component imports the needed function(s) → function reads `localStorage.getItem("token")` → axios call to the Laravel API → returns parsed JSON (`response.data`) → caller updates state. Errors surface via `error.response.data.message`.

## Dependencies
- **Depends on:** axios, `NEXT_PUBLIC_API_BASE_URL`, the Laravel API route shapes (`routes/api.php`).
- **Depended on by:** virtually every `page.tsx` and modal in `(public)/` and `(private)/` (imported as `import { fn } from '@/app/Apis/publicapi'`).

## Conventions
- **Named exports**, `camelCase` verb-led names; one function per endpoint. See `docs/PATTERNS.md` §10 & §12.
- ⚠️ The file has ~960 lines of **commented-out duplicate code** before the live code (~line 968); a second `import axios` + `BASE_URL` redeclaration sits mid-file. Add new functions near the live block.
- ⚠️ Some functions **hardcode** `https://api.joincroose.com` / a raw IP instead of `BASE_URL` — always use `BASE_URL`. Token is `console.log`-ed in places; avoid logging secrets in new code.

## Common commands
None module-specific (exercised by `npm run dev`).
