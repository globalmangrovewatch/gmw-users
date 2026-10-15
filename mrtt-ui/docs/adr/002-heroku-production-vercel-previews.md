# ADR 002: Keep Heroku for production, add Vercel for previews and staging

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1119 (Heroku changes), GMW-1120 (Vercel project)

---

## Context

`mrtt-ui` production and staging run on Heroku (Node buildpack, `express` static server). Heroku is **Hold** on the Tech Radar; Vercel is **Adopt** for Next.js frontends and already hosts `mangrove-atlas`. There is no preview-per-PR environment today, which makes reviewing UI work and SSO changes slow.

The GMW SSO flow (ADR 003) requires every MRTT origin that talks to GMW to be listed in GMW's `SSO_ALLOWED_ORIGINS`. Vercel preview URLs change per deployment.

Moving production DNS, Heroku config vars and the ops knowledge around them is a separate, risk-bearing change that the refactor does not need in order to succeed.

## Decision

- **Heroku remains the production and staging deploy target.** The Next.js app runs there with `Procfile: web: pnpm start` (`next start -p $PORT`), Node 22, pnpm, and `heroku-postbuild: pnpm build && rm -rf .next/cache`, mirroring `mangrove-atlas`.
- **A Vercel project is added** (repo root `mrtt-ui`, Next.js preset) for preview deployments on every PR and a `develop`-tracking alias usable as a second staging.
- Env parity between Heroku staging and Vercel is maintained by hand and checked in GMW-1120. A stable Vercel alias (e.g. `mrtt-staging.vercel.app`) is the one added to GMW `SSO_ALLOWED_ORIGINS`; ephemeral preview URLs do not get SSO.
- Decommissioning Heroku is explicitly **out of scope** and would be its own ADR.

## Alternatives considered

- **Move production to Vercel now.** Aligns with the Radar and removes the Heroku Hold, but couples the framework migration to a hosting migration (DNS, env vars, cron/worker expectations, cost model) in the same release. Deferred, not rejected.
- **Heroku review apps for previews.** Native to the current host, but slower builds, no Next.js-specific optimisations, and would still require per-review-app SSO origins.
- **No previews.** Status quo; rejected because the UI track (ADR 004) ships in many visual PRs that need review on a URL.

## Consequences

**Positive**

- Zero production risk from hosting during the refactor; rollback is a Heroku release rollback.
- Preview URL on every PR; Vercel bot comment and GitHub-for-Jira keep the ticket's dev panel current.
- Later move to Vercel production becomes a config change, since the app already builds and runs there.

**Negative / risks**

- Two deploy targets to keep in env-var parity; drift shows up as "works on preview, not on staging".
- `next start` on Heroku rewrites `Host`; absolute URLs (`redirect_uri`, `returnTo`) must come from `NEXT_PUBLIC_SITE_URL`, never from `request.url`.
- Heroku stays on Hold; the Radar debt is acknowledged, not paid.
