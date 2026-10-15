# ADR 005: Native `fetch` client + TanStack Query for all data access; axios removed

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1115

---

## Context

Data access is axios 0.27 (**Hold** on the Radar) with hand-built URLs in 25 files, a global interceptor injecting the bearer, and 11 views on `useEffect + axios + isLoading` state. TanStack Query 5 (**Adopt**) is installed but used in three files, so cache invalidation after a site mutation is ad hoc. Blob downloads (xlsx reports) and `js-file-download` are wired separately in two views.

After ADR 003 the browser no longer holds a token, and all backend calls go through `/api/proxy`; the interceptor has nothing to inject.

## Decision

- `src/lib/api.ts`: `createClient({ baseUrl, auth, credentials })` on native `fetch`, producing `api` (backend; on CRA injects the bearer, on Next.js points at `/api/proxy` with no client token), `authApi` (sign-in / sign-up / password) and `gmwApi` (SSO sync / logout, `credentials: 'include'`). Typed `ApiError { status, body }`, `204 → undefined`, `blob()` for report endpoints, `onUnauthorized(cb)` hook.
- `src/lib/download.ts` `saveBlob` replaces `js-file-download` and the hand-rolled `createObjectURL` code.
- **TanStack Query everywhere**: `src/queries/{sites,organizations,landscapes,users}.ts` with `queryOptions()` factories and a key hierarchy (`['sites']`, `['sites', id]`, `['sites', id, 'registration']`, `['sites', id, 'monitors', mid]`, …) so a mutation invalidates by prefix. Per-resource mutation hooks. The 11 `useEffect + axios` consumers are converted.
- `axios` and `js-file-download` are removed.
- Orval (Radar Adopt) is evaluated only if the API exposes OpenAPI; not a blocker.

## Alternatives considered

- **Keep axios, add TanStack Query.** Removes the manual loading state but keeps a Hold dependency and its interceptor model, which ADR 003 makes redundant.
- **ky / ofetch.** Thin wrappers that add little over `fetch` once a 40-line client exists; one more dependency to track.
- **Server Components / `fetch` in RSC.** Not available while the tree is client-only (ADR 001); the query layer keeps that door open.

## Consequences

**Positive**

- Loading / error / cache semantics become uniform; save → invalidate → refetch is one pattern.
- Switching the backend base URL to `/api/proxy` after the Next.js PR is a one-line change.
- Removes an unmaintained major version of axios and its CVE surface.

**Negative / risks**

- 3–4 dev-days touching every data-fetching view; regression risk covered by the safety-net tests (GMW-1113) and manual checks on a section form.
- Error-message plumbing (`err.body.error` on sign-in) must be preserved explicitly; `fetch` does not throw on HTTP errors by default.
