# mrtt-ui Upgrade & Modernization Plan

> Status: proposal · Author: generated 2026-06-25 · Aligns with Vizzuality Tech Radar

## Context

`mrtt-ui` is a Create React App (CRA) single-page app: `react-scripts` 5.0.1 + `react-app-rewired`, React 18, react-router-dom v6, ~142 source files (~18k LOC). It hosts the MRTT site/landscape/organization forms for Global Mangrove Watch, with cross-subdomain SSO into the GMW backend and a Mapbox map. In production an Express script serves the static CRA build on Heroku (no SSR).

The stack has drifted off the maintained path:

- **CRA is effectively abandoned.** `react-scripts` gets no meaningful releases; the React team no longer recommends CRA for new or existing apps. It is **not on the Vizzuality Tech Radar**.
- **MUI is in a broken state.** `package.json` pins `@mui/material` `^5.6.4` alongside `@mui/system` `^7.0.2` and `@mui/x-date-pickers` `^5.0.0-alpha.2` — a major-version mismatch that is a latent runtime/type bug, not just tech debt. MUI is **not on the Tech Radar**.
- **Styling is split** across emotion (the real CSS-in-JS layer, 29 files), `@mui/styled-engine-sc`, a dead `styled-components` dependency, and an emerging `src/styles/v2/ui/*` component layer.
- **Risky/old deps:** `axios` `^0.27.2` (pre-1.0), `yup` `^0.32`, redundant `luxon` + `date-fns` (date-fns unused), Storybook 6 (EOL).
- **No tests** (0 test files) and **~4% TypeScript** adoption (6 of 142 files), non-strict tsconfig.

This plan modernizes toward the Tech Radar **Adopt** set (Next.js, Tailwind, shadcn/ui, Vitest, Zod) while keeping what already aligns (React 18, TanStack Query v5, react-map-gl, react-hook-form).

---

## Tech Radar alignment (consulted 2026-06-25)

| Area            | Current             | Radar tier                    | Target                    |
| --------------- | ------------------- | ----------------------------- | ------------------------- |
| Framework       | CRA / react-scripts | not listed                    | **Next.js** (Adopt)       |
| Build (interim) | react-app-rewired   | —                             | **Vite** (Trial) or Next  |
| UI components   | MUI 5 (mismatched)  | not listed                    | **shadcn/ui** (Adopt)     |
| Styling         | emotion + sc        | sc = deprioritised            | **Tailwind CSS** (Adopt)  |
| Validation      | yup 0.32            | not listed                    | **Zod** (Adopt)           |
| Unit tests      | Jest (unused)       | Jest=maintain, Vitest=default | **Vitest** (Adopt)        |
| Data fetching   | TanStack Query v5   | **Adopt**                     | keep                      |
| Maps            | react-map-gl 7      | **Adopt**                     | keep / bump               |
| i18n (if added) | custom language.js  | next-intl = Adopt             | **next-intl** (with Next) |
| Env validation  | raw process.env     | @t3-oss/env-nextjs = Adopt    | **@t3-oss/env-nextjs**    |

Alternative noted: **TanStack Start** (Trial) is the Radar's evaluated Next.js alternative. Recommend Next.js (Adopt) for production; TanStack Start only if the team wants to pilot it.

---

## Should we move to Next.js?

### Advantages of migrating

- **Supported, default framework.** Tech Radar Adopt; active releases, large ecosystem, hiring/onboarding alignment with other Vizzuality projects.
- **First-class TypeScript, routing, and tooling** out of the box — replaces the `react-app-rewired` + `config-overrides.js` polyfill hacks and the hand-rolled Express SPA host.
- **File-based routing** maps cleanly onto the existing ~22 protected + 6 auth routes.
- **Built-in env validation path** (`@t3-oss/env-nextjs`), image/asset optimization, code-splitting, and a real production server (replaces `scripts/heroku-start.js`).
- **Unlocks Radar-adjacent libraries** (`next-intl`, `@t3-oss/env-nextjs`) for the currently custom i18n/env code.
- **SSR/SSG optional, not mandatory** — can ship as a client-rendered app first, adopt server rendering later where it helps (e.g. public site/landscape pages, PDF/report routes).

### Caveats / risks of migrating

- **SSO is the most sensitive piece — but it's a risk _and_ an opportunity.** Today mrtt is an OAuth-style **client**: a hidden iframe hits GMW's `/api/auth/sso/authorize`, GMW redirects back with a short-lived signed code, mrtt `postMessage`s it up, exchanges it at `/api/auth/sso/exchange` for a backend bearer token, holds that token **in memory**, and attaches it via an axios `Authorization` interceptor (`withCredentials`). _Verified against the GMW app (`mangrove-atlas`, Next.js + NextAuth):_
  - **Risk:** GMW is **not** a standard OAuth/OIDC provider — it's a bespoke bridge. There is no drop-in NextAuth "GMW provider"; mrtt must implement a **custom NextAuth provider** that drives the existing `/authorize`→`/exchange` handshake. The `gmw-sso-token` cookie is `httpOnly` + `__Secure-` + `SameSite=None` + `domain=.globalmangrovewatch.org` and **must be preserved exactly**; the cross-subdomain iframe step is still required (mrtt JS can't read that cookie). GMW's **CORS + redirect allowlist are pinned to mrtt's current public origin** — the migrated app must keep that origin or GMW config changes (cross-repo coordination). The current in-memory token doesn't exist during SSR. Do **not** try to "merge NextAuth sessions" (shared secret/cookie/version-locked) — the token-exchange design deliberately avoids that.
  - **Opportunity:** the hard, security-critical half (signed 30s code, server-side token re-validation at every hop, cross-domain cookie, redirect/CORS allowlists) is **already built and hardened on GMW's side**. Migrating mrtt to Next.js lets a custom NextAuth provider perform the exchange **server-side** and store the backend token in an **httpOnly session**, deleting mrtt's iframe + postMessage + in-memory-token machinery — net cleaner and a security upgrade.
  - **Net:** lower risk than building SSO from scratch (the protocol exists and works), but it's a custom-provider rewrite with cross-repo config coupling — so **prototype the exchange first**.
- **Env var rename churn:** every `process.env.REACT_APP_*` → `NEXT_PUBLIC_*` (or server-only) across the codebase.
- **CSS-in-JS + SSR friction:** emotion/MUI need extra setup under the App Router. Largely moot if MUI is removed in favor of Tailwind/shadcn first (see sequencing).
- **Mapbox is client-only** — `react-map-gl` must be dynamically imported (`ssr: false`); GL has no SSR story.
- **Heroku deploy change:** Procfile/start command and build pipeline change from static-serve to `next start`.

### Caveats / risks of NOT migrating (staying on CRA)

- **No security/maintenance updates.** CRA/`react-scripts` is unmaintained — transitive vulns won't be patched upstream; you inherit the maintenance burden via `react-app-rewired` overrides.
- **Off the Tech Radar** — diverges from org standards, harder cross-team support and onboarding.
- **Build stagnation:** slow dev server / dated webpack vs. Vite/Next; no modern DX (fast refresh edge cases, polyfill hacks remain).
- **Compounding debt:** React 19+, newer tooling, and Radar libraries increasingly assume Vite/Next; staying on CRA makes each future upgrade harder.

**Recommendation:** Migrate, but **decouple the UI-library migration from the framework migration** (below). The biggest near-term risk (broken MUI versions) and the biggest strategic win (off CRA) are separable workstreams. If a full Next.js move is too large to schedule now, **Vite (Trial) is a low-cost interim** that removes the CRA/react-app-rewired liability while keeping the SPA model, then Next.js later.

---

## Phased roadmap

Ordered to de-risk: stabilize first, then re-platform, then swap the UI library. Each phase is independently shippable.

### Phase 0 — Stabilize & quick wins (low risk, do first)

- **Fix the MUI version mismatch.** Align `@mui/material`, `@mui/system`, `@mui/icons-material` on one major (pin all to MUI 5 latest, or all to 6) and move `@mui/x-date-pickers` off `alpha` to a stable release. _This is a correctness fix, not optional._
- Remove **dead deps:** `styled-components` (unused), `date-fns` (unused — consolidate on `luxon`).
- Bump **axios** `0.27 → 1.x` (verify the auth interceptor in `src/library/auth/interceptor.js` and `withCredentials` calls).
- Decide Storybook: upgrade `6 → 8` or drop it (only 3 stories: CheckboxGroup, ConfirmPrompt, MobileFooter).
- Centralize env access behind one module (prep for later validation + Next rename).

### Phase 1 — Test & TypeScript baseline

- Stand up **Vitest** + Testing Library; add smoke tests for auth/SSO flow, form init, and routing before any migration (currently 0 tests = no safety net).
- Turn on incremental TS: `strict` on new files, convert high-traffic modules (`hooks/sso.ts` exists; expand to `library/`, `hooks/`, form logic).

### Phase 2 — Build/framework migration

Two options — pick per appetite:

- **2a (recommended target): Next.js (App Router).**
  1. Scaffold Next app; port `src/` with path-alias parity (current `baseUrl: src` + webpack `resolve.modules`).
  2. Map react-router routes → file-based routes (`/sites`, `/sites/:siteId/...`, `/auth/*`, etc.).
  3. **Re-implement SSO as a custom NextAuth provider** that performs GMW's `/authorize`→`/exchange` handshake server-side and stores the backend token in an httpOnly session (replacing the iframe + postMessage + in-memory token + axios interceptor). Preserve the `__Secure-gmw-sso-token` cookie attributes (`domain=.globalmangrovewatch.org`, `SameSite=None`, `httpOnly`) and confirm GMW's CORS/redirect allowlist still covers the new app's public origin (coordinate with `mangrove-atlas`). _Prototype this exchange before committing the full move._
  4. Rename `REACT_APP_*` → `NEXT_PUBLIC_*`; add `@t3-oss/env-nextjs` validation.
  5. Dynamic-import Mapbox (`ssr: false`).
  6. Replace `scripts/heroku-start.js` with `next start`; update Heroku Procfile/build.
- **2b (interim, lower cost): Vite.** Replace CRA + react-app-rewired with Vite, keep react-router SPA model and SSO as-is. Removes the CRA liability fast; Next.js can follow later.

### Phase 3 — MUI → shadcn/ui + Tailwind (largest UI workstream)

Scope: **74 files** import `@mui/*`, **21 distinct component types**, **29 emotion/styled files**. Strategy = abstract, then swap, leveraging the existing `src/styles/v2/ui/*` layer.

1. Add **Tailwind** + **shadcn/ui** (Radix-based). Port `src/styles/themeMui.js` tokens (palette, typography, breakpoints, component overrides for `MuiFormLabel`/`MuiButton`/dropzone) into Tailwind theme config.
2. Replace the **shared component layer first**: `src/styles/v2/ui/{button,input,typography,divider}.js`, then `src/components/Form/FormInput.js` (the react-hook-form `Controller` wrapper around MUI `TextField`).
3. Roll out by component family — inputs (TextField/Select/MenuItem/Autocomplete → shadcn Input/Select/Combobox), then Dialog/Menu/Alert/Checkbox/Radio, then Box/Stack/Typography layout → Tailwind utilities.
4. **Date picker:** no direct shadcn equivalent for `@mui/x-date-pickers` — replace with `react-day-picker` (shadcn's recommended calendar) + the existing luxon/UTC adapter logic.
5. **Dropzone:** `react-mui-dropzone` is MUI-coupled — replace with `react-dropzone` + a shadcn-styled wrapper.
6. Migrate emotion styled components (Header, landing, about, contact) to Tailwind; remove emotion + `@mui/styled-engine-sc` once MUI is gone.

### Phase 4 — Validation & cleanup

- Migrate **yup → Zod** (12 files; `@hookform/resolvers` supports both — swap resolver per form).
- Remove now-unused styling/UI deps; final dependency prune.
- Expand test coverage over migrated surfaces.

---

## Effort & time estimate

Assumes **1 experienced frontend dev, full-time**, QA inline, no major scope creep. Ranges (not points) — SSO and the 74-file UI swap carry real variance. Scale down proportionally if 2 devs run Phase 3 in parallel with Phase 1/2.

| Phase                         | Time         | Risk           | Notes                                                                            |
| ----------------------------- | ------------ | -------------- | -------------------------------------------------------------------------------- |
| 0 Stabilize                   | **1–3 days** | Low            | MUI mismatch fix urgent; re-verify each component renders after align            |
| 1 Tests/TS baseline           | **1–1.5 wk** | Low            | Vitest setup + smoke tests for auth/forms/routing; incremental TS                |
| 2a Framework — Next.js        | **1–2 wk**   | **High (SSO)** | Incl. ~1 wk SSO prototype up front; route map, env rename, Mapbox, deploy        |
| 2b Framework — Vite (interim) | **1–1.5 wk** | Low            | Alternative to 2a; keeps SPA + SSO as-is                                         |
| 3 MUI→shadcn + Tailwind       | **1–2 wk**   | Medium         | 74 files / 21 components / 29 emotion files; date-picker + dropzone replacements |
| 4 yup→Zod + cleanup           | **1–2 days** | Low            | 12 files; per-form resolver swap                                                 |

### Totals

- **Full target (Next.js path: P0+1+2a+3+4):** ≈ **3.5–6.5 weeks** (~1–1.5 months, 1 dev).
- **Pragmatic interim (Vite path: P0+1+2b+3+4):** ≈ **3.5–6 weeks** — defers Next.js to a later, separate effort. (Barely shorter than the full path: Phase 2b only undercuts 2a by a few days, so the framework choice is now driven by strategy, not timeline.)
- **Stabilize-only (P0+1):** ≈ **1–2 weeks** — removes the urgent MUI/axios risk and adds a test net without re-platforming.

Biggest single line item is now a tie between **Phase 2a (framework)** and **Phase 3 (UI swap)** at 1–2 wk each. SSO remains the biggest _risk_ multiplier on Phase 2 — a failed SSO prototype could push 2a toward the high end or force a rethink. These estimates are aggressive; the ~1 wk SSO prototype and the 74-file UI swap are where overruns are most likely.

---

## Appendix — full dependency audit

`pnpm outdated` reports **~50 outdated packages** (snapshot 2026-06-25). The headline risks above are not the whole story. Grouped by how to treat them:

### A. Safe minor/patch bumps — do anytime (low risk)

| Package                   | Current → Latest          |
| ------------------------- | ------------------------- |
| `@tanstack/react-query`   | 5.74 → 5.101              |
| `react-hook-form`         | 7.56 → 7.80               |
| `express`                 | 5.1 → 5.2                 |
| `sass`                    | 1.87 → 1.101              |
| `@emotion/styled`         | 11.14.0 → 11.14.1         |
| `@mapbox/mapbox-gl-draw`  | 1.5.0 → 1.5.1             |
| `caniuse-lite`, `webpack` | data/transitive (via CRA) |

### B. Major bumps needing their own decision (breaking)

| Package                                      | Current → Latest | Note                                                                    |
| -------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| `react` / `react-dom`                        | 18.3 → **19**    | Major; gates react-router 7, MUI, testing-library. Big standalone call. |
| `react-router-dom`                           | 6.30 → **7**     | Major (Remix merge); loader/API changes.                                |
| `mapbox-gl`                                  | 2.15 → **3**     | Major; GL JS v3 perf + licensing change. Verify draw plugin compat.     |
| `react-map-gl`                               | 7.1 → **8**      | Pairs with mapbox-gl 3.                                                 |
| `typescript`                                 | 5.8 → **6**      | Major.                                                                  |
| `luxon`                                      | 2.5 → **3**      | Date lib API changes.                                                   |
| `react-toastify`                             | 9.1 → **11**     | Major API changes.                                                      |
| `resend`                                     | 4.4 → **6**      | Email SDK (used for invites/notifications).                             |
| `@turf/*` (area, bbox, bbox-polygon, convex) | 6.5 → **7.3**    | ESM-only in v7.                                                         |
| `@tmcw/togeojson`                            | 5.8 → **7**      | ESM changes.                                                            |
| `shpjs`                                      | 4.0 → **6**      | Shapefile parser; verify import flow.                                   |
| `web-vitals`                                 | 2.1 → **5**      | Metrics API changed.                                                    |
| `plop`                                       | 3.1 → **4**      | Dev scaffolding tool.                                                   |

### C. Absorbed/replaced by the migration phases — do NOT bump piecemeal on CRA

| Package(s)                                                                                                                                              | Current → Latest      | Handled in                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------- |
| `axios`                                                                                                                                                 | 0.27 → 1.18           | **Phase 0**                                 |
| `yup` 0.32→1.7 + `@hookform/resolvers` 2→**5**                                                                                                          | (3 majors)            | **Phase 4** (→ Zod)                         |
| `@mui/material`/`system`/`icons` 5/7→**9**, `@mui/x-date-pickers` 5→**9**, `@mui/styles` (deprecated), `@mui/styled-engine-sc`                          |                       | **Phase 3** (removed entirely)              |
| `eslint` 8→**10**, `eslint-config-prettier` 8→10, `eslint-plugin-prettier` 4→5, `prettier` 2→**3**                                                      | flat-config migration | **Phase 2** (with Vite/Next toolchain)      |
| `jest` 27→**30**, `@testing-library/react` 13→**16**, `jest-dom` 5→6, `user-event` 13→14, `dom` 8→10, `@types/jest` 27→**30**                           |                       | **Phase 1** (→ Vitest)                      |
| All `@storybook/*` 6.5→**8/10**, `@storybook/testing-library`, `@storybook/testing-react`, `storybook-addon-react-router-v6`, `eslint-plugin-storybook` | EOL                   | **Phase 0** decision (upgrade to 8 or drop) |
| `react-scripts`, `webpack`                                                                                                                              |                       | **Phase 2** (removed)                       |
| `@types/node` 18→26, `@types/react`/`react-dom` 18→**19**                                                                                               |                       | follows React 19 + runtime                  |

### D. Remove — dead code

| Package               | Reason                                    |
| --------------------- | ----------------------------------------- |
| `styled-components` 5 | Unused; emotion is the real styling layer |
| `date-fns` 2          | Unused; consolidate on `luxon`            |

> **Sequencing note:** React 19, react-router 7, and mapbox-gl 3 (group B) are the biggest _new_ decisions surfaced by the full audit. React 19 in particular is best paired with the framework migration (Phase 2), since Next 15 / modern Vite assume it and several group-C bumps (MUI 9, testing-library 16, react-router 7) target React 19. Treat "React 18 → 19" as a gate inside Phase 2 rather than a standalone Phase 0 item.

## Verification

- **Per phase:** `pnpm lint`, `pnpm build`, and (after Phase 1) `pnpm test` green.
- **Auth/SSO** (every phase touching it): manual end-to-end — silent SSO iframe check, login/logout, token refresh on a fresh load, cross-subdomain cookie behavior against a real GMW env.
- **Forms:** init from API, validation errors, submit (PATCH/PUT/POST) for a representative form (e.g. site interventions) — verify TanStack Query invalidation still fires.
- **Map:** Mapbox renders + draw tools work (esp. after Next dynamic-import change).
- **Deploy:** Heroku build + boot on a review app before merging Phase 2.
- Capture before/after bundle size and dev-server start time as migration KPIs.

---

## Open questions for the team

1. **Framework appetite:** full Next.js now (2a), or Vite interim then Next later (2b)?
2. **MUI hold/migrate:** confirm OK to fix the version mismatch as a stopgap (Phase 0) even though MUI is ultimately being removed (Phase 3)?
3. **Storybook:** keep + upgrade to 8, or drop (only 3 stories)?
4. **i18n:** adopt `next-intl` to replace the custom `language.js`, or keep custom?
5. **Timeline:** sequential phases, or run Phase 3 (UI) in parallel with Phase 1/2?
