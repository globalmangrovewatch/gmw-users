# MRTT — Upgrade Plan

Prepared 2026-06-25

## The short version

The application is built on Create React App (CRA), which is no longer actively maintained. Although the application remains functional, continuing to rely on an unsupported build tool increases technical debt and may lead to compatibility, maintenance, and security challenges over time. A migration to a modern, actively maintained alternative is recommended.

The concern is compounded by a second tool. To customize CRA's default behaviour, the application also depends on `react-app-rewired`, a helper whose last release was in **2022** — meaning it, too, is effectively unmaintained. The application therefore rests on **two** build tools that have both stopped receiving updates, rather than one. Every future change to the underlying technology has to work around this ageing, unsupported layer.

In addition, one of the core front-end libraries — MUI, which provides the application's buttons, text fields, menus, and other interface elements — is currently installed in an inconsistent, mismatched configuration. This is not merely future cleanup; it represents a latent defect that is likely to surface as a visible bug.

A full review identified approximately **50 dependencies** (the pre-built components the application is assembled from) that are out of date, many by several major versions.

**Recommendation:** Proceed with modernization, but in clearly defined stages — addressing the urgent and highest-risk items first, and treating the largest change (replacing the build foundation) as a separate, well-prepared piece of work.

---

## Why this matters — the case for acting

Migrating to the modern, organizationally standardized framework (Next.js) provides:

- **An actively maintained foundation** — security vulnerabilities are patched by the framework's maintainers rather than absorbed as our own maintenance burden.
- **Reduced custom tooling** — the application currently relies on hand-built workarounds (the `react-app-rewired` layer noted above) to make an unsupported toolchain behave. A modern framework removes that need.
- **Alignment with organizational standards** — making it easier for other developers to contribute and for new team members to onboard.
- **Capacity to grow** — modern capabilities such as faster page loads, improved mapping, and multi-language support become straightforward rather than awkward to implement.

## Why this matters — the cost of inaction

If the application is left as-is:

- **Security exposure increases.** An unsupported foundation no longer receives safety updates, so known weaknesses remain open indefinitely.
- **Cost rises over time.** The longer modernization is deferred, the larger the eventual effort, because every component ages simultaneously.
- **Divergence from organizational standards grows**, making the application progressively harder and slower for anyone to maintain.
- **Day-to-day development slows**, extending the time required to deliver new features and fixes.

The underlying point is straightforward: the cost does not disappear by deferring the work — it accumulates.

---

## The central decision

The most valuable — and most sensitive — change is replacing the build foundation with the modern framework. One feature warrants particular attention, and it is both a risk and an opportunity.

The application includes a **single sign-on** capability: a user already authenticated on the main Global Mangrove Watch site is signed in to this application automatically. This works through a careful, behind-the-scenes handshake between the two sites, which sit on different web addresses.

**The opportunity.** We reviewed how the main Global Mangrove Watch site implements its side of this handshake, and the difficult, security-critical part is **already built there and built well** — including the safeguards that prevent tampering or misuse. The modern framework we are moving to (Next.js) is the same one the main site already uses, which means our application can connect to that existing, proven login system in a **cleaner and more secure** way than it does today — and we can retire some fragile workarounds currently needed to make login function.

**The risk.** The two sites do **not** share a login automatically just because they use the same technology — the connection still has to be deliberately rebuilt and configured, and it spans **two separate codebases owned by the team**, so changes must be coordinated across both. Because the login feature touches the most sensitive part of the system and depends on the other site behaving exactly as expected, **we recommend validating the connection through a small proof-of-concept before committing to the full migration.** The good news is that this is lower risk than building login from scratch, because the underlying mechanism already exists and works.

Given that, we recommend separating the work deliberately:

- The **urgent correction** (the mismatched MUI component library) and the **strategic migration** (replacing the foundation) are **independent pieces of work** and need not be undertaken together.
- If a full foundation change cannot be scheduled in the near term, a **lower-cost interim step** (a build tool called Vite) removes the "unsupported foundation" risk quickly while deferring the larger migration.

---

## The plan, in stages

Each stage delivers value independently and can be released on its own. They are sequenced so that the urgent and highest-risk items are addressed first.

### Stage 0 — Stabilize (urgent maintenance)

**Approximately 1–3 days. Low risk.**
Correct the mismatched MUI component library so it is internally consistent, remove a small number of unused dependencies, and update a critical, very outdated component responsible for communicating with the server. Decide on the future of a documentation tool that is currently little used. This stage removes the most immediate risks without altering the application's appearance or behaviour for users.

### Stage 1 — Establish a safety net

**Approximately 1–1.5 weeks. Low risk.**
The application currently has **no automated tests** — no automatic verification that login still works or that forms still save before changes are released. Before the foundation is touched, we introduce these automated checks, providing essential protection for the larger work that follows.

### Stage 2 — Replace the foundation

The principal change, with two possible routes:

- **Route A (recommended target) — full modern framework.** Approximately **1–2 weeks. Higher risk**, primarily because of the sensitive login feature, which would be validated through a proof-of-concept first (roughly one week of the estimate).
- **Route B (lower-cost interim).** Approximately **1–1.5 weeks. Low risk.** Removes the unsupported-foundation risk quickly while retaining the current structure; the full framework migration can follow later as a distinct project. (Note: it now saves only a few days over Route A, so the choice is strategic rather than time-driven.)

### Stage 3 — Replace the user-interface library

**Approximately 1–2 weeks. Medium risk. One of the two largest pieces of work** — on par with the foundation change.
The library responsible for rendering every button, form field, dropdown, dialog, and menu is being replaced with the modern, organizationally standard equivalent (shadcn/ui with Tailwind). This affects **74 of the application's files** and approximately **21 distinct types of interface element**, so it is carried out methodically — one family of elements at a time — maintaining a consistent appearance throughout.

### Stage 4 — Final consolidation

**Approximately 1–2 days. Low risk.**
Replace the remaining older library used to validate form entries (ensuring required fields are completed correctly), remove any now-unused dependencies, and extend automated test coverage over the newly rebuilt components.

---

## Overall timeline

The following estimates assume **one experienced developer working full-time**, with quality assurance included. They are ranges rather than commitments — the login feature and the large interface rebuild are where unforeseen complications are most likely to arise.

| Path                                        | Total time                         | Scope                                                                      |
| ------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| **Full modernization** (recommended target) | **~3.5–6.5 weeks** (~1–1.5 months) | Everything, including the modern foundation                                |
| **Pragmatic interim path**                  | **~3.5–6 weeks**                   | Everything except the full foundation change (deferred to a later project) |
| **Urgent fixes + safety net only**          | **~1–2 weeks**                     | Removes the most pressing risks; no major rebuild                          |

Three points worth retaining:

- The **two largest pieces of work are the foundation change (Stage 2) and the interface rebuild (Stage 3)** — now comparable in size, at one to two weeks each.
- The **greatest source of uncertainty is the login feature** — which is why it is validated early.
- If **two developers** work in parallel (one on the interface rebuild, one on the foundation), overall calendar time reduces meaningfully.

---

## The full set of out-of-date dependencies

A complete review identified approximately **50 outdated dependencies**, organized below by how each would be handled. The intent is to make the list manageable rather than alarming — most are routine, and many are addressed automatically within the stages above.

- **Routine, low-risk updates:** a number of components require only minor version increments.
- **Larger updates requiring deliberate decisions:** the core engine the application is built on, the mapping components, date handling, in-app notifications, the email-sending service, and several geographic/mapping utilities each have a major new version available.
- **Addressed automatically within the stages above:** the MUI component library, the testing tools, the code-formatting tools, and the documentation tool are all replaced or updated as a natural part of Stages 1–3, and should not be handled separately.
- **Removed:** two dependencies that are no longer used at all.

The accompanying technical document lists every item by name, with exact current and target versions, for the development team.

---

## How each stage will be verified

For every stage, the team confirms that:

- The application **builds and runs** cleanly.
- **Login works end-to-end** (the most sensitive element) — verified manually against a real environment whenever it is touched.
- **Forms load, validate, and save** correctly.
- The **map renders and its drawing tools function** as expected.
- The application **deploys and starts** on our hosting before any work is finalized.
- **Before-and-after performance and size** are measured to demonstrate the improvement.

---

## Decisions required from the team

1. **Ambition:** proceed to the full modern foundation now, or take the lower-cost interim step first and undertake the larger migration later?
2. **The urgent MUI correction:** is it acceptable to fix it now even though the library is ultimately being replaced? (Recommended — it resolves a live defect.)
3. **The documentation tool:** upgrade it, or retire it? (It is currently little used.)
4. **Multiple languages:** adopt the standard multi-language tooling as part of this effort, or retain the current custom approach?
5. **Scheduling:** run the stages strictly in sequence, or run the interface rebuild alongside the earlier stages to compress the calendar?
