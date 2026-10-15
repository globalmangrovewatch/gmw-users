# ADR 003: Custom auth — server-side SSO exchange, httpOnly session cookie, same-origin API proxy

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1118 (proof of concept), GMW-1119 (migration)

---

## Context

Today MRTT authenticates with a custom bridge to GMW's SSO: a silent iframe to GMW's `authorize` endpoint, a `postMessage` with a one-time code, a browser-side exchange for a backend bearer token kept **in memory**, and an axios interceptor that injects it. The token is lost on reload (re-triggering the silent check) and is readable by any script on the page.

Verified against `mangrove-atlas`: `POST /api/auth/sso/exchange` needs only `{ code }` and no GMW cookie or `Origin`, so the exchange can happen **server to server**. `authorize` validates `redirect_uri` by origin only. `sync` / `logout` set GMW's own cookie and must stay browser calls. GMW needs no code change, only `SSO_ALLOWED_ORIGINS`.

Tech Radar: NextAuth is **Hold**, Better Auth is **Trial**. Neither models "exchange a code from a sibling app for a third-party bearer and proxy it"; both would be bent around the GMW flow.

## Decision

Implement auth with **plain Next.js route handlers and no auth library**:

- `GET /auth/sso-silent?code=` — server-side exchange with GMW, seal the backend bearer into a session cookie, return a tiny page that `postMessage`s the result to the parent.
- `GET /api/auth/session`, `POST /api/auth/login` (password flow), `POST /api/auth/logout`.
- `/api/proxy/[...path]` — unseal the cookie, forward to `${API_URL}` with `Authorization: Bearer`, stream the body (xlsx downloads included), map upstream 401 to clear-cookie + 401.
- Cookie `__Host-mrtt-session`: `HttpOnly; Secure; SameSite=Lax; Path=/`, 30 days, sealed with `jose` (`EncryptJWT`, secret `MRTT_SESSION_SECRET`). `jose` is a crypto utility, not an auth framework; it is unlisted on the Radar and flagged for sign-off.
- Gating: `proxy.ts` cookie-presence matcher plus a server-side `getSession()` in `app/(protected)/layout.tsx`.
- The client keeps `NEXT_PUBLIC_API_URL=/api/proxy`, so the 32 existing API call sites survive with an env rename and no client-side token handling.

The design is validated by a ≤3-day proof of concept with checks V1–V9 (iframe `Set-Cookie` persistence with a `postMessage` fallback, Heroku server-to-server exchange, `redirect_uri` from `NEXT_PUBLIC_SITE_URL`, streaming, deep-link return). Failure of V1 and its fallback, or of streaming, stops the migration for re-planning.

## Alternatives considered

- **NextAuth with a custom provider.** Hold on the Radar; its session model assumes it owns the OAuth dance, and GMW is not an OAuth/OIDC provider. Would need a custom provider plus a custom adapter for the bearer.
- **Better Auth.** Trial only; same mismatch with the GMW code exchange; adds a dependency the sister app does not use.
- **Keep the in-memory token and the client-side interceptor** on Next.js. Smallest change, but keeps the reload gap and the XSS-readable token, and blocks any future server-side data loading.
- **Non-httpOnly cookie read by the client.** Fixes reload, not the exposure.

## Consequences

**Positive**

- Backend bearer never reaches browser JavaScript; survives reloads; no silent-SSO round trip on every load.
- One auth surface shared conceptually with `mangrove-atlas` (route handlers, `proxy.ts`), easy to test with Playwright.
- API calls are same-origin; CORS and bearer plumbing disappear from the client.

**Negative / risks**

- Every API request takes an extra hop through the Next.js server; blob downloads must be streamed, not buffered. Same region as the API mitigates latency.
- Third-party cookie policies may drop `Set-Cookie` from the iframe callback (V1); the fallback (parent does the exchange from the posted code) is designed up front.
- `SSO_ALLOWED_ORIGINS` on GMW must list localhost, Heroku staging and the Vercel alias; a config-only but cross-repo dependency.
- Offline support (Track 4) can no longer persist the token client-side and must be redesigned around the cookie and the proxy.
