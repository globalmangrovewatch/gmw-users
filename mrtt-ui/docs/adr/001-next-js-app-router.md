# ADR 001: Migrate from Create React App to Next.js App Router

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1143, GMW-1118 (proof of concept), GMW-1119 (migration)

---

## Context

`mrtt-ui` is a Create React App 5 SPA customised through `react-app-rewired` and `config-overrides.js`. Both are unmaintained; CRA has had no release since 2022 and its webpack 5 pin blocks modern tooling (Tailwind 4's PostCSS plugin, Turbopack, current Jest/Vitest integrations). The app has no SSR requirement today, but every structural upgrade now costs throwaway work against CRA's build.

The sister application `mangrove-atlas` (GMW) runs Next.js 16 App Router, Tailwind 4, Vitest, Playwright and oxlint. The two apps share the backend (`gmw-api`), the SSO flow and the product team. Next.js is **Adopt** on the Vizzuality Tech Radar; CRA is unlisted.

Constraints: one developer; production must stay on Heroku (ADR 002); the MUI-based UI cannot be rewritten in the same step (ADR 004); the map (mapbox-gl, mapbox-gl-draw, shpjs) and Transifex `live.js` are browser-only.

## Decision

Migrate `mrtt-ui` to **Next.js App Router** as a lift-and-shift: routes, navigation hooks and env handling move; the UI tree stays client-only (`'use client'` views, `next/dynamic` with `ssr: false` for the map) until ADR 004 lands. A time-boxed (≤3 days) proof of concept on auth (ADR 003) gates the migration with explicit go / no-go criteria.

- `app/(auth)` and `app/(protected)` layouts; every `page.tsx` is a thin server file importing a client view.
- `react-router-dom` replaced by `next/navigation` and `next/link` via codemod.
- `@t3-oss/env-nextjs` replaces raw `process.env.REACT_APP_*`.
- `express`, `react-scripts`, `react-app-rewired`, `webpack` and the custom Heroku start script are removed.

No alternative framework was evaluated beyond those listed below; parity with `mangrove-atlas` was the deciding factor.

## Alternatives considered

- **Stay on CRA and patch `config-overrides.js`** for each new need (Tailwind 4, Vitest). Lowest immediate cost, but every patch is bespoke and unsupported; the pile of overrides is the problem being solved.
- **Vite SPA.** Smallest migration diff and no SSR concerns. Rejected: diverges from the sister app (two stacks for one team), no route handlers for the auth design in ADR 003, Vite is not the Radar's default for apps.
- **Remix / React Router 7 framework mode.** Capable, but Hold / unlisted on the Radar and no in-house experience.

## Consequences

**Positive**

- One stack across GMW and MRTT: shared `ui/*` components, auth libraries, CI templates and reviewer knowledge.
- Server-side route handlers unlock the cookie-based auth and API proxy (ADR 003) and Vercel previews (ADR 002).
- Unblocks Tailwind 4, Vitest, Turbopack and React 19 without bundler patches.

**Negative / risks**

- 8–12 dev-days for the framework track alone, on top of the UI track.
- Interim period where MUI / emotion run inside Next.js client-only; SSR friction is bounded by the `dynamic(ssr: false)` escape hatch but is real (risk 7 in the plan).
- Module-level state (`drawControlRef`), `Buffer`/`process` polyfills and SVGR imports need refactoring for the new bundler.
- Any future SSR use (SEO for the landing page, server data loading) is possible but not planned; the migration does not deliver it by itself.
