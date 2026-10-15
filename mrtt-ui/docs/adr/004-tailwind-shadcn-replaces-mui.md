# ADR 004: Replace MUI, emotion and styled-components with Tailwind CSS 4 + shadcn/ui

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1121 (scaffold), GMW-1122 (shared layer), GMW-1123 (section forms), GMW-1124 (views), GMW-1125 (teardown + React 19)

---

## Context

The UI uses `@mui/material` 5 with `@mui/system` 7 and an alpha `@mui/x-date-pickers`, emotion, and `styled-components` (107 `styled(` calls in 29 files; `styled-components` itself is unused but installed). styled-components is **Hold** on the Radar; MUI is unlisted; Tailwind CSS and shadcn/ui are **Adopt** and are what `mangrove-atlas` uses. A global `:root { font-size: 62.5% }` makes every `rem` 10 px, so all sizing tokens are non-standard. The brand primary differs between the emotion theme (`#009b93`) and the MUI theme (`#00857f`, equal to GMW's `brand-800`).

Tailwind 4 under CRA 5 needs the PostCSS loader patched; under Next.js it is zero-config. The framework migration (ADR 001) renders client-only, so MUI needs no SSR plumbing in the interim.

## Decision

- Migrate to **Tailwind CSS 4 + shadcn/ui**, **after** the Next.js migration lands. Both styling systems coexist until teardown.
- Theme tokens via `@theme` in `globals.css`, derived from `theme.js` / `themeMui.js` and aligned to `mangrove-atlas` (`brand-800 #00857f`; `#009b93` retired — product sign-off required). The 10 px rem is dropped; sizes are re-expressed in 16 px rem.
- `src/components/ui/*` copied from `mangrove-atlas` where customised, the rest added with the shadcn CLI. `sonner` replaces `react-toastify`, `react-icons` replaces `@mui/icons-material`, `react-day-picker` (via shadcn Calendar) replaces the MUI date picker, `react-dropzone` replaces `react-mui-dropzone`.
- Migration in PR-sized slices: shared layer first, then section forms in five PRs grouped by shared row components, then views / auth / landing, then teardown (remove all `@mui/*`, `@emotion/*`, `prop-types`, legacy `styles/*.js`) together with the React 18 → 19 bump.
- Storybook is **dropped** (3 stories, v6 EOL). Component coverage moves to Vitest + Testing Library.

## Alternatives considered

- **Fix the MUI version mismatch and stay on MUI.** Cheapest; keeps a stack the Radar does not list, a second design system next to GMW's, emotion runtime CSS, and the 10 px rem.
- **Tailwind first, on CRA.** Would start the visible work sooner but requires throwaway PostCSS patching of CRA; kept only as the fallback if the proof of concept slips past ~3 weeks.
- **Radix primitives without shadcn.** Same engine, more hand-rolled styling; shadcn gives parity with the sister app's `ui/*` for free.
- **Keep Storybook (upgrade to v8).** Three stories do not justify the upgrade and maintenance; revisit when the `ui/*` library grows.

## Consequences

**Positive**

- One design system across GMW and MRTT; components and reviewers transfer directly.
- Build-time CSS, no emotion runtime, smaller bundle; MUI / emotion / styled-components / prop-types leave the dependency tree.
- Brand and spacing converge with GMW; standard rem sizing.

**Negative / risks**

- 22–33 dev-days, the largest track; every screen needs visual review at mobile and desktop against production.
- Retiring the 10 px rem changes every rem-based size at once; mistakes are visual, not type-checked.
- `ProjectAreaMap.js` (map libs bump + dropzone swap + draw-ref refactor) is the riskiest single file.
- `sonner`, `react-day-picker`, `cmdk`, `@radix-ui/*` are not on the Radar and need sign-off; chosen for sister-app parity.
- Brand colour change `#009b93 → #00857f` is user-visible and needs product approval before the scaffold PR.
