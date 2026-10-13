# mrtt-ui — Refactor & Framework Migration Plan

> Jira: [GMW-1110](https://vizzuality.atlassian.net/browse/GMW-1110) (story) + sub-tasks GMW-1111 … GMW-1127.
> Written 2026-10-13. Supersedes `docs/planning/UPGRADE_PLAN.md` (June 2026); re-bases `docs/planning/OFFLINE_*_PLAN.md`.
> Tech Radar consulted 2026-10-13 (`vizzuality-engineering-handbook/decisions/tech-radar/*`).

## 0. Executive summary

`mrtt-ui` is a Create React App 5 + `react-app-rewired` SPA. Both tools are unmaintained. MUI is installed in a mismatched state (`@mui/material` 5, `@mui/system` 7, `@mui/x-date-pickers` alpha). There are 0 tests, ~6 % TypeScript, no CI, no git hooks. axios, yup, luxon, ESLint, Prettier and styled-components are Hold or unlisted on the Tech Radar. Heroku is Hold.

Plan, in four tracks:

1. **Track 1 — stabilise on the current bundler** (dead code, tooling, safety-net tests, strict TS, fetch + TanStack Query, date-fns, zod). Starts now.
2. **Track 2 — framework**: time-boxed SSO spike in **Next.js** and **TanStack Start**, weighted-rubric decision, then a lift-and-shift migration with the UI untouched (client-only render). Heroku stays production; a Vercel project is added for previews/staging.
3. **Track 3 — UI**: MUI + emotion → Tailwind CSS 4 + shadcn/ui in PR-sized slices, then teardown and React 19.
4. **Track 4 — offline support** design re-based on the new stack.

Total ≈ **45–65 dev-days** (one developer). Track 1 overlaps the spike.

## 1. Decisions (2026-10-13)

| Topic | Decision |
| --- | --- |
| Framework | Spike both Next.js (Radar Adopt) and TanStack Start (Radar Trial, RC). Decide with the rubric in §4.1. |
| Hosting | **Heroku stays production.** Vercel (Radar Adopt) is **added** for preview/staging deploys. Heroku is not removed. |
| Auth | Custom route handlers / server functions, no auth library (NextAuth = Hold, Better Auth = Trial). Server-side SSO exchange, backend bearer in an httpOnly cookie, API calls through a same-origin proxy route. |
| UI | Tailwind 4 + shadcn/ui, migrated **after** the framework move. |
| Storybook | Dropped (3 stories, v6 EOL). |
| React | 18 → 19 inside this migration (teardown task). |
| i18n | Transifex `live.js` kept as-is (loaded after hydration). |
| Offline | Designs in `docs/planning/OFFLINE_*` kept; re-based in Track 4. |

## 2. Tech Radar alignment

| Area | Current | Radar | Target |
| --- | --- | --- | --- |
| Framework | CRA 5 + react-app-rewired | not listed | Next.js (Adopt) / TanStack Start (Trial) — spike |
| Hosting | Heroku | Hold | Heroku (prod, kept) + Vercel (Adopt, previews) |
| Language | ~6 % TS, loose tsconfig | TypeScript Adopt | strict TS |
| Lint / format | ESLint 8 + Prettier 2 | Hold (ADR 001) | oxlint + oxfmt (Adopt) |
| UI | MUI 5/7 + emotion + styled-components | sc = Hold; MUI unlisted | Tailwind CSS + shadcn/ui (Adopt) |
| Forms | react-hook-form + yup | yup unlisted | react-hook-form + Zod (Adopt) |
| HTTP | axios 0.27 | Hold | native `fetch` |
| Data | TanStack Query 5 (3 files) | Adopt | TanStack Query everywhere |
| Dates | luxon 2 | unlisted | date-fns 4 (Adopt) |
| Maps | mapbox-gl 2, react-map-gl 7, turf 6 | Adopt | same libs, bumped (Mapbox kept for GMW parity) |
| Auth | custom SSO bridge, in-memory token | NextAuth Hold | custom route handlers + httpOnly cookie |
| Env | raw `process.env.REACT_APP_*` | @t3-oss/env-nextjs Adopt | validated env module |
| Tests | none | Vitest / Playwright Adopt | Vitest + Playwright |
| Toasts | react-toastify | unlisted | sonner (unlisted; sister-app parity) — flagged |
| Icons | @mui/icons-material | react-icons Adopt | react-icons |
| Git hooks / CI / deps | none | Husky, GitHub Actions, Dependabot Adopt | all added |

**Not on the Radar, kept or introduced (need sign-off):** `@tmcw/togeojson`, `shpjs`, `sonner`, `jose` (JWE for the session cookie), `react-day-picker`, `cmdk`, `@radix-ui/*` (shadcn internals), and for offline `@tanstack/react-query-persist-client` + `idb`.

## 3. Audit (verified 2026-10-13)

### 3.1 Dependencies

- **Unused / dead:** `styled-components`, `@mui/styled-engine-sc`, `date-fns` (re-added later), `sass` (no `.scss`), `web-vitals`, `caniuse-lite`, `@testing-library/*` ×4, `@types/jest` (listed twice), `jest`, `@storybook/node-logger`, `@storybook/testing-library`, `@storybook/testing-react`, `resend` (only used by the dead `src/hooks/contact.tsx`).
- **Used but undeclared** (pnpm hazard): `buffer`, `process` (`config-overrides.js`), `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react-hooks` (`.eslintrc.js`).
- **Heavy coupling:** `@mui/material` 64 files, `prop-types` 44, `react-router-dom` 32, `react-hook-form` 27, `axios` 25, `react-toastify` 24, `@mui/system` 14, `@mui/icons-material` 12, `yup` 11, `@emotion/*` 10.
- **Env vars:** `REACT_APP_API_URL` (32 uses, scattered), `REACT_APP_AUTH_URL` (4), `REACT_APP_GMW_URL` (1), `REACT_APP_MAPBOX_ACCESS_TOKEN` (1), `REACT_APP_TRANSIFEX_API_KEY` (`public/index.html` only).
- ~50 outdated packages; majors: react 19, react-router 7, mapbox-gl 3, react-map-gl 8, turf 7, togeojson 7, shpjs 6, luxon 3, react-toastify 11, @hookform/resolvers 5, yup 1, eslint 10, prettier 3.

### 3.2 Architecture

- **Routing** (`src/App.js`): flat react-router table, 22 protected + 6 public routes; `/sites/:siteId/form/costs` declared twice; `GlobalLayout` switches the login header by pathname regex.
- **Form singleton** (`components/FormWrapper/FormWrapperProvider.js`): one `useForm` with a 385-line yup schema above the routes; 10 section forms use `useFormContext`; saves validate per section via `form.trigger(fields)`.
- **Auth** (`hooks/useAuth.js`, `hooks/sso.ts`, `library/auth/interceptor.js`): in-memory token; silent iframe → `postMessage` → `/exchange`; password login → `/users/sign_in` → `/sso/sync`; no 401 handling.
- **Data:** global axios with hand-built URLs; TanStack Query in 3 files; 11 views still `useEffect + axios + isLoading`.
- **Styling:** MUI + emotion, `styled(` ×107 in 29 files, two theme files, `styles/*` and `styles/v2/*` in parallel, `:root { font-size: 62.5% }`.
- **SSR blockers:** mapbox-gl / draw / react-map-gl, shpjs + Buffer polyfill, FileReader / DOMParser, `window.Transifex`, SVGR import, module-level `drawControlRef`, bare imports via `baseUrl: src`.
- **Hosting:** Heroku `procfile` → `scripts/heroku-start.js` (Express static + SPA fallback).
- **Date bug:** `DatePickerUtcMui.js` emits local midnight with offset, not UTC; default values are luxon objects the parser cannot read.

### 3.3 Dead code

Files: `src/hooks/contact.tsx` (Express + Resend router inside the client tree), `src/hooks/registrationInterventionAnswers.ts`, `src/library/useInitializeMonitoringForm.js`, `src/views/Home.js`, `src/views/Site.js`, `src/components/landing/header.jsx`, `src/styles/v2/ui/button.js`, `src/components/Header/index.html`, `plopfile.js`, `plop-templates/`, `.storybook/`, 3 `*.stories.js`. Exports: `PaddedPageTopSection`, `XSmallUpperCase`, `redirectToAuthorize`, `FORM_NAMES_DICTIONARY_MONITORS`. Also: duplicate `StyledLabel`, ~190 commented-out lines in four section forms, duplicate `ReactToastify.css` import, 12 `console.*`, inverted contact-form privacy validation, CRA defaults in `public/manifest.json`.

## 4. Track 2 — framework spike and migration

**Verified against `mangrove-atlas`:** `POST /api/auth/sso/exchange` needs only `{ code }` (JWE decoded with `NEXTAUTH_SECRET`, validated against the backend `current_user`). No GMW cookie, no Origin → **server-side exchange from mrtt's server is viable.** `authorize` validates `redirect_uri` by origin only. `sync` / `logout` set GMW's cookie in the browser → stay as client `fetch(credentials: 'include')`. GMW needs no code change; only `SSO_ALLOWED_ORIGINS` on GMW staging must list `http://localhost:3000` and the mrtt staging / preview origins.

### 4.1 Spike (GMW-1118) — ≤3 days per framework

Endpoints to build in mrtt:

| Endpoint | Does |
| --- | --- |
| `GET /auth/sso-silent?code=` | server exchange → set session cookie → tiny HTML that `parent.postMessage({ type: 'mrtt-sso', status })` |
| `GET /api/auth/sso/callback?code=&returnTo=` | optional top-level variant: exchange → cookie → 302 to a relative `returnTo` |
| `GET /api/auth/session` | unseal cookie → `{ user }`; 401 + clear if invalid; `?verify=1` re-validates |
| `POST /api/auth/login` | password flow: validate token server-side, seal, set cookie |
| `POST /api/auth/logout` | clear cookie; best-effort backend sign_out |
| `/api/proxy/[...path]` | unseal cookie → forward to `${API_URL}` with `Authorization: Bearer`, stream body (xlsx blobs + Content-Disposition); upstream 401 → clear cookie + 401 |

Shared lib: `src/lib/auth/session.ts` (`jose` EncryptJWT, secret `MRTT_SESSION_SECRET`), `src/lib/auth/gmw.ts` (server exchange / validate), `src/lib/auth/sso-client.ts` (browser iframe check, sync, logout). Cookie `__Host-mrtt-session` (prod) / `mrtt-session` (dev), `HttpOnly; Secure; SameSite=Lax; Path=/`, Max-Age 30 d.

Client keeps `API_URL = /api/proxy`, so the 32 `${API_URL}/…` call sites survive with an env rename. `interceptor.js` is deleted; one 401 handler redirects to `/auth/login?returnTo=`. Gating: Next `proxy.ts` cookie-presence matcher + `(protected)/layout.tsx` server check; TanStack `_protected.tsx` `beforeLoad`.

**Must verify (V1–V9):** V1 Set-Cookie from the iframe callback persists in Chrome / Firefox / Safari (fallback: callback posts `{ code }` and the parent does a same-origin exchange) · V2 server-to-server exchange from Heroku · V3 `redirect_uri` from `SITE_URL` env, not `request.url` · V4 proxy streams xlsx and forwards JSON bodies · V5 React 19 + MUI 5 + emotion render unchanged (Next: `AppRouterCacheProvider`; TanStack: `ssr: false`) · V6 map via dynamic import, shapefile upload · V7 Transifex after hydration · V8 Heroku build + start (V8b: Vercel preview) · V9 deep link → login → silent SSO → back to the deep link.

**No-go triggers:** V1 and fallback both fail; V4 cannot stream; V5 needs more than a day of workarounds; V8 fails on the Node buildpack.

**Rubric (1–5 × weight):** SSO fit 25 · DX / migration effort 20 · Radar tier 15 (Next Adopt = 5, TanStack Trial = 2–3 + sign-off) · team familiarity 15 (mangrove-atlas is Next 16) · Heroku deploy 10 · bundle / runtime 5 · risk / maturity 10.

### 4.2 Migration (GMW-1119)

- **Routes (Next):** `app/(auth)/…` (login, login/newUser, signup, password/forgot-password, password/reset), `app/(protected)/…` with `sites/layout.tsx` hosting `<FormWrapperProvider key={siteId ?? 'new'}>` (covers `/sites`, `/sites/new`, `/sites/[siteId]/*`), 8 fixed section pages, 3 monitoring sections as `[[...monitoringFormId]]`, landscapes ×3, organizations ×5. Every `page.tsx` is a 3-line server file importing a `'use client'` view. **TanStack:** `_auth.tsx`, `_protected.tsx`, `_protected/sites.tsx`, `$siteId`, `{-$monitoringFormId}`, `$.tsx`.
- **Codemod:** `useNavigate` 24 → `useRouter` / typed `navigate`; `useParams` 37 → framework import; `useLocation` 8 → `usePathname` (the two regex users become structural); `useSearchParams` 2; `Link` 29 + 3 `styled(Link)`; `Navigate` 2 → `redirect`; bare `baseUrl: src` imports → `@/…`.
- **Client-only:** `'use client'` on views / components / hooks; `ProjectAreaMap` via `dynamic(..., { ssr: false })`; `drawControlRef` → `useRef`; `transformer/shp.js` lazy-imported; SVGR logo → inline `GmwLogo.tsx`; Transifex `liveSettings` `beforeInteractive` + `live.js` `afterInteractive`. shpjs 6 is ESM / ArrayBuffer-based → Buffer polyfill goes (fallback: `import { Buffer } from 'buffer'` scoped in `transformer/shp.js`).
- **Env rename:** `REACT_APP_API_URL` → `API_URL` + `NEXT_PUBLIC_API_URL=/api/proxy`; `REACT_APP_AUTH_URL` → `AUTH_URL` + `NEXT_PUBLIC_AUTH_URL`; `REACT_APP_GMW_URL` → `GMW_URL` + `NEXT_PUBLIC_GMW_URL`; `REACT_APP_MAPBOX_ACCESS_TOKEN`, `REACT_APP_TRANSIFEX_API_KEY` → `NEXT_PUBLIC_*`; new `MRTT_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ENVIRONMENT` (`VITE_` for TanStack).
- **Heroku:** Node 22.x, pnpm via `packageManager`; delete `scripts/heroku-start.js`, `config-overrides.js`, lowercase `procfile`; `Procfile: web: pnpm start`, `heroku-postbuild: pnpm build && rm -rf .next/cache` (Next) or nitro `node-server` output (TanStack). Remove `express`, `react-scripts`, `react-app-rewired`, `webpack`.
- **Vercel (GMW-1120):** project linked to the repo, root `mrtt-ui`, preview per PR + `develop` staging alias, env parity with Heroku staging, preview / staging origins added to GMW `SSO_ALLOWED_ORIGINS`. Heroku untouched.

### 4.3 Track 2 risks

Set-Cookie dropped in the iframe callback → fallback (decide on day 1). Proxy hop + blob buffering → stream `upstream.body`, same region as the API. Gate matcher accidentally covering `/auth/sso-silent` or `/api/proxy` → explicit excludes + Playwright test. Heroku Host rewriting → absolute URLs from `SITE_URL`; validate `returnTo` is relative. Next emotion / MUI / Transifex SSR friction → cache provider + `afterInteractive`; escape hatch: `dynamic(ssr: false)` on the whole protected tree. TanStack RC API churn → pin, isolate in ~6 files, Trial sign-off. React 19 peer-deps (`@mui/x-date-pickers` alpha, `react-mui-dropzone`, `@mui/styles`) may block the spike install → check first.

## 5. Track 3 — UI migration

**Why after the framework:** Tailwind 4 under CRA 5 requires patching CRA's postcss-loader (throwaway work). The framework PR renders the app client-only, so MUI / emotion need no SSR plumbing. Fallback if the spike slips past ~3 weeks: patch `config-overrides.js` to use `@tailwindcss/postcss` and start the scaffold on CRA.

- **Scaffold (GMW-1121):** `postcss.config.mjs`, `src/styles/globals.css` with `@theme` tokens (brand scale aligned with mangrove-atlas: `brand-800 #00857f` = current MUI primary; the emotion `#009b93` is retired → product sign-off), **drop `:root { font-size: 62.5% }`** (all `styles/*.js` rems are ×10 px), `src/lib/cn.ts`, `components.json`, `src/components/ui/*` (copy customised components from mangrove-atlas, add the rest via the shadcn CLI), sonner `Toaster`, react-icons.
- **Shared layer (GMW-1122):** layout / header / footer / `QuestionNav` / loading; primitives; `FormInput.tsx` reading `control` from context + `FormSelect` / `FormTextarea` / `FormRadioGroup`; `DatePickerUtc.tsx` (react-day-picker 9 `timeZone="UTC"`, `UTCDate` formatting, same `field` API); `ProjectAreaMap` on `react-dropzone`; mapbox-gl 3 / react-map-gl 8 / turf 7; `react-toastify` → `sonner`; `styles/*.js` re-pointed to `ui/typography.tsx` / `ui/layout.tsx` shims.
- **MUI → shadcn map:** TextField → Input / Textarea in `FormField`; TextField-select + MenuItem / Select → `Select*`; Menu → `DropdownMenu`; Box / Stack → div + flex; FormLabel / FormControl / FormGroup → Label / FormItem / fieldset; Typography → `ui/typography.tsx`; Button / IconButton / `@mui/base` Button → `Button` cva variants; Checkbox + FormControlLabel → Checkbox + Label; Radio / RadioGroup → `RadioGroup*`; Alert → alert; Dialog → `Dialog*`, ConfirmPrompt → `AlertDialog*`; List → ul / li; CircularProgress / Backdrop → `ui/loading` + overlay; Autocomplete → Popover + Command combobox; `useMediaQuery` / `@mui/styles useTheme` → responsive classes; MobileDatePicker → Calendar in Popover; DropzoneArea → react-dropzone; tables → `odd:bg-row-odd even:bg-row-even`.
- **Section forms (GMW-1123):** five PRs — ProjectDetails + SiteBackground + RestorationAims; CausesOfDecline + PreRestorationAssessment; SiteInterventions; Costs; ManagementStatus + Socioeconomic + Ecological. Each file: MUI → Tailwind, `.js` → `.tsx`, prop-types → TS in one touch.
- **Views, auth, landing (GMW-1124)**, then **teardown + React 19 (GMW-1125)**, then **Playwright (GMW-1126)**.

## 6. Track 1 — forms, data, dates, TypeScript, tooling

- **yup → zod (GMW-1117):** `src/forms/schemas/<section>.ts` ×10 (`shape`, `refine`, `defaultValues`); `index.ts` composes `z.object({ ...shapes }).superRefine(...)` (spread, not `.merge()`); `shape satisfies Record<keyof typeof questionMapping[S], z.ZodTypeAny>`; `RegistrationFormValues = z.input<…>`; `multiSelectWithOther` keeps `path: ['selectedValues']`; 10 standalone forms get colocated schemas; `@hookform/resolvers` 5.
- **Data (GMW-1115):** `src/lib/env.ts`; `src/lib/api.ts` `createClient({ baseUrl, auth, credentials })` → `api`, `authApi`, `gmwApi`; `ApiError`; `blob()` + `src/lib/download.ts`; `onUnauthorized`; `src/queries/*` with `queryOptions()` and the key hierarchy `['sites']`, `['sites', id]`, `['sites', id, 'registration']`, `['sites', id, 'monitors', mid]`, …; the 11 `useEffect + axios` consumers converted; `makeQueryClient` → `src/lib/queryClient.ts`. On CRA the client injects the bearer; after the framework PR it points at `/api/proxy`.
- **Dates (GMW-1116):** `src/lib/dates.ts` (`toUtcDay`, `toUtcIso`, `todayUtcIso`, `formatUtcDay` via `@date-fns/utc`); emit `YYYY-MM-DDT00:00:00.000Z`; confirm with the API owner that date answers are dates, not timestamps.
- **TypeScript (GMW-1114):** `strict`, `jsx: react-jsx`, `moduleResolution: bundler`, `paths { "@/*": ["src/*"] }`; conversion order lib → data (`as const`) → forms → ui → shared components → sections → views; `src/types/api.ts`.
- **Tooling (GMW-1112):** `.oxlintrc.json`, `.oxfmtrc.json` (mirrors `.prettierrc`), husky 9 + lint-staged, Vitest 4 + Testing Library 16, `.github/workflows/ci.yml`, `dependabot.yml`, `sonar-project.properties`.
- **Safety-net tests (GMW-1113):** `mapDataForApi` ↔ `formatApiAnswersForForm` round-trip per section; table-driven validation cases vs yup (re-run vs zod later); `sso.ts`; KML / shapefile transformers; pure helpers.

## 7. Track 4 — offline support (GMW-1127)

Both models in `docs/planning/OFFLINE_*` stay valid; the decision point (always-on sync vs explicit download / push) is unchanged. Re-base: service worker via `serwist` (Next) or `vite-plugin-pwa` (TanStack Start) instead of CRA Workbox; session persistence redesigned around the httpOnly cookie and `/api/proxy`; `@tanstack/react-query-persist-client` + `idb` still the storage core (not on the Radar — flag). Estimates unchanged (11.5–19 d always-on, 15–23 d explicit).

## 8. Sequencing and effort (1 dev, dev-days)

| Task | Jira | Days | Depends on | Parallel with spike |
| --- | --- | --- | --- | --- |
| Dead code + unused deps | GMW-1111 | 0.5–1 | — | yes |
| Tooling | GMW-1112 | 1.5–2 | 1111 | yes |
| Safety-net tests | GMW-1113 | 2–3 | 1112 | yes |
| TS baseline | GMW-1114 | 2–3 | 1113 | yes |
| fetch + TanStack Query | GMW-1115 | 3–4 | 1114 | yes |
| luxon → date-fns | GMW-1116 | 0.5 | 1114 | yes |
| yup → zod | GMW-1117 | 3–4 | 1113, 1116 | yes |
| Framework spike | GMW-1118 | ≤6 | — | — |
| Framework migration | GMW-1119 | 5–8 | 1118 | no |
| Vercel project | GMW-1120 | 0.5–1 | 1119 | no |
| Tailwind + shadcn scaffold | GMW-1121 | 2–3 | 1119 | no |
| Shared layer | GMW-1122 | 4–6 | 1121 | no |
| Section forms (5 PRs) | GMW-1123 | 8–12 | 1122 | no |
| Views + auth + landing | GMW-1124 | 5–7 | 1122 | no |
| Teardown + React 19 | GMW-1125 | 1–2 | 1123, 1124 | no |
| Playwright | GMW-1126 | 2–3 | 1119 | partially |
| Offline re-base | GMW-1127 | 1–2 (design) | 1125 | no |

Track 1 ≈ 13–18 d; Track 2 ≈ 8–12 d (+ spike); Track 3 ≈ 22–33 d. Critical path: spike → migration → scaffold → shared layer → forms.

## 9. Risks

1. SSO server-side exchange and iframe Set-Cookie behaviour — answered by the spike; fallback designed.
2. Retiring the 10 px rem changes every rem-based size — visual review per PR.
3. `#009b93` → `#00857f` brand convergence — product sign-off.
4. `ProjectAreaMap.js` (react-map-gl 8 + mapbox-gl 3 + draw ref refactor) is the riskiest single file.
5. Date semantics change from local-offset to `Z` — API owner to confirm.
6. GMW `SSO_ALLOWED_ORIGINS` must include localhost / staging / Vercel origins — config var only.
7. TanStack Start is RC and Radar Trial — sign-off required if it wins.

## 10. Verification per phase

`pnpm lint && pnpm check-types && pnpm test:unit && pnpm build` green; manual SSO end-to-end (silent iframe, password login, logout, deep-link return) against GMW staging; a representative section form (init, validation, save, invalidation); map render + draw + KML / shapefile upload; Heroku review app and Vercel preview boot before the framework PR merges; bundle size and dev-server start time recorded before / after.
