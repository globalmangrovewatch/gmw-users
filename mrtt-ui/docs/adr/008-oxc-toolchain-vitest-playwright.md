# ADR 008: Code quality and test toolchain — oxlint, oxfmt, Vitest, Playwright, CI

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1111 (dead code), GMW-1112 (tooling), GMW-1113 (safety-net tests), GMW-1126 (Playwright)

---

## Context

The repo has ESLint 8 + Prettier 2 (both **Hold** per handbook ADR 001), zero tests, no CI, no git hooks, no Dependabot, and a dependency tree with 20+ unused packages (Storybook v6, Jest, testing-library pins, `sass`, `resend`, …) plus several used-but-undeclared ones. The org standard is oxlint + oxfmt (**Adopt**), Vitest + Playwright (**Adopt**), Husky + GitHub Actions + Dependabot (**Adopt**). `mangrove-atlas` already runs all of them.

This is the one track that does not depend on the bundler, so it starts first and provides the regression guard for everything else.

## Decision

- Adopt handbook ADR 001 in this project: `.oxlintrc.json` and `.oxfmtrc.json` (mirroring the current `.prettierrc` so the first format pass is a near-zero diff); delete the ESLint / Prettier config and dependencies.
- Husky 9 + lint-staged pre-commit (`oxlint --fix`, `oxfmt`); typecheck runs in CI only during the JS → TS transition.
- Vitest 4 + jsdom + Testing Library 16 for unit and component tests; Playwright for e2e smoke (login, silent SSO, site overview, save section, deep link) once the Next.js migration lands.
- `.github/workflows/ci.yml` (lint, format check, typecheck, unit tests with coverage, build) on PRs to `develop` / `main`; `dependabot.yml` with grouped updates; SonarQube job.
- **Safety-net tests before any migration**: `mapDataForApi` ↔ `formatApiAnswersForForm` round-trip per section, table-driven validation cases, `sso.ts`, KML / shapefile transformers. These are the acceptance gate for ADR 005, 006 and 007.
- Dead code and unused dependencies are removed first (GMW-1111) so the tooling lands on a clean tree.

## Alternatives considered

- **Keep ESLint + Prettier, add tests only.** Contradicts handbook ADR 001 for a project in a maintenance window, which is exactly the migration moment that ADR names.
- **Jest** (already installed). Slower, needs Babel config under CRA; Vitest is the org default and shares Vite's transform with the future stack.
- **Cypress** for e2e. Playwright is the org default and what GMW uses; one e2e harness across both apps.

## Consequences

**Positive**

- Regression guard exists before the risky tracks start; CI blocks broken PRs.
- Lint / format feedback in seconds; one toolchain shared with GMW.
- Dependency tree shrinks by ~25 packages before the migration adds new ones.

**Negative / risks**

- Type-aware lint rules are opt-in (`oxlint-tsgolint`, Trial) and not enabled; some typescript-eslint rules the old config had are lost.
- Safety-net tests encode current behaviour, bugs included (e.g. the date offset in ADR 007); they must be updated deliberately when a later ADR changes behaviour.
