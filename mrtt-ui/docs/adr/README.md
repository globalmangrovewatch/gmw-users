# Architecture Decision Records — mrtt-ui

One file per decision, numbered, never edited after acceptance. A changed decision gets a new ADR that supersedes the old one. Format follows `vizzuality-engineering-handbook/decisions/adr/000-template.md`; copy `000-template.md` here to start a new one.

Write an ADR when a decision is expensive to reverse, affects more than one repo or team, or someone will ask "why did we do this?" in six months. Link the ADR from the PR that implements it and from the Jira ticket.

| # | Title | Status | Date |
| --- | --- | --- | --- |
| [001](001-next-js-app-router.md) | Migrate from Create React App to Next.js App Router | Accepted | 2026-10-13 |
| [002](002-heroku-production-vercel-previews.md) | Keep Heroku for production, add Vercel for previews and staging | Accepted | 2026-10-13 |
| [003](003-session-cookie-and-api-proxy-auth.md) | Custom auth: server-side SSO exchange, httpOnly session cookie, same-origin API proxy | Accepted | 2026-10-13 |
| [004](004-tailwind-shadcn-replaces-mui.md) | Replace MUI, emotion and styled-components with Tailwind CSS 4 + shadcn/ui | Accepted | 2026-10-13 |
| [005](005-fetch-and-tanstack-query.md) | Native `fetch` client + TanStack Query for all data access; axios removed | Accepted | 2026-10-13 |
| [006](006-zod-per-section-schemas.md) | Zod per-section schemas replace the single yup schema | Accepted | 2026-10-13 |
| [007](007-date-fns-and-utc-date-semantics.md) | date-fns replaces luxon; date answers stored as UTC midnight | Accepted | 2026-10-13 |
| [008](008-oxc-toolchain-vitest-playwright.md) | Code quality and test toolchain: oxlint, oxfmt, Vitest, Playwright, CI | Accepted | 2026-10-13 |

Execution plan and estimates: [`../REFACTOR_PLAN.md`](../REFACTOR_PLAN.md). Earlier proposals: [`../planning/`](../planning/).
