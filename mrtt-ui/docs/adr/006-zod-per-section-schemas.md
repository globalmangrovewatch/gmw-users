# ADR 006: Zod per-section schemas replace the single yup schema

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1117 (depends on GMW-1113 safety-net tests and ADR 007)

---

## Context

Validation is one 385-line `yup` schema (`FormSchemaValidation.js`) mounted above all routes in a single global `useForm`, with per-section `trigger(fields)` on save. yup is unlisted on the Radar; Zod is **Adopt** and used by `mangrove-atlas` and by `@t3-oss/env-nextjs`. Form values are untyped, so the TypeScript migration (GMW-1114) cannot type `useFormContext` without a schema-derived type.

## Decision

- Split into `src/forms/schemas/<section>.ts` ×10, each exporting `shape`, `refine(values, ctx)` for cross-field rules, and `defaultValues`. `index.ts` composes `registrationSchema = z.object({ ...shapes }).superRefine(...)` by **spreading shapes**, not `.merge()`, because a refined schema is `ZodEffects`.
- `shape satisfies Record<keyof typeof questionMapping[S], z.ZodTypeAny>` gives a compile-time check that every mapped question has a rule.
- `RegistrationFormValues = z.input<typeof registrationSchema>` types `useForm`, `useFormContext` and the save hooks.
- yup idioms are translated explicitly (`.when` → section `refine`; dates → `z.string().datetime({ offset: true })` + end ≥ start; years → `z.preprocess` to a bounded nullable int; `mixed()` → `z.unknown()`), and `multiSelectWithOther` keeps `path: ['selectedValues']` where the UI reads the error.
- The ten standalone forms (login, signup, password, landscape, organization, site, contact, …) get colocated schemas. `yupResolver` → `zodResolver`; `yup` removed.
- The table-driven validation test suite written against yup (GMW-1113) is re-run unchanged against Zod as the acceptance criterion.

## Alternatives considered

- **Keep yup, split the schema.** Fixes the file size, not the typing gap or the Radar status.
- **Valibot.** Smaller bundle, but unlisted on the Radar and not used elsewhere in the org.
- **One Zod schema, no split.** Loses the per-section ownership that makes the section-form PRs (ADR 004) independent.

## Consequences

**Positive**

- Form values and API payload mapping become typed end to end; `questionMapping` and schemas cannot drift silently.
- Section PRs can touch one schema file each.

**Negative / risks**

- 3–4 dev-days; subtle behavioural differences (empty string vs `null`, coercion) are the main risk and are what the shared test table exists to catch.
- Error messages must stay byte-identical to `language.ts` to avoid translation churn in Transifex.
