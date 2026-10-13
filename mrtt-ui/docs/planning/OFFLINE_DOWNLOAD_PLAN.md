# Offline Forms — "Download · Fill · Push" Feature Plan

> **Status:** Proposal / planning. No code written.
> **Date:** 2026-06-26
> **Model:** Explicit checkout/check-in (NOT always-on background sync)

---

## 1. The idea

A deliberate, user-driven workflow — not magic background offline:

```
   ONLINE                 OFFLINE                    ONLINE
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ "Download    │ ──▶ │ Fill the form     │ ──▶ │ "Push / Upload"  │
│  for offline"│     │ (no network)      │     │  syncs to server │
│  packages a  │     │ saved to device   │     │  section by      │
│  site's form │     │                   │     │  section         │
└──────────────┘     └──────────────────┘     └──────────────────┘
```

The user **explicitly downloads** a site's full form (questions + current answers +
reference data) to the device, fills it offline, and **explicitly pushes** it back
when online. No automatic queue, no silent sync — the user is always in control and
can see exactly what's downloaded, what's been edited, and what's been uploaded.

### Why this model (vs always-on offline)

- **Simpler mental model** for field users: "I downloaded site X, I'll upload it tonight."
- **No background sync engine** — push is one explicit, observable action.
- **Bounded storage** — only sites the user chose to download live on the device.
- **Predictable conflicts** — last-write-wins on an explicit push the user triggered, not a surprise replay.

---

## 2. Frontend or backend?

**Almost entirely frontend** (`mrtt-ui`). The existing API is reused as-is for both download (existing GETs) and push (existing PATCH/POST/PUT).

| Concern                                                             | FE  | BE               |
| ------------------------------------------------------------------- | --- | ---------------- |
| Download bundle, offline storage, fill, push                        | ✅  | —                |
| App loads offline (service worker)                                  | ✅  | —                |
| Persisted session                                                   | ✅  | —                |
| **Optional later:** conflict detection on push (`updated_at` check) | —   | ⚠️ only if added |

v1 needs **zero backend changes**.

---

## 3. One key fork to decide

Where does the user fill the form offline?

| Option                         | What                                                                                | Needs service worker? |                  Form fidelity                  | Effort |
| ------------------------------ | ----------------------------------------------------------------------------------- | :-------------------: | :---------------------------------------------: | :----: |
| **A — In-app (recommended)**   | User fills in the normal MRTT app UI while offline; app shell + form are cached     |        **Yes**        |    Full (maps, validation, all 12 sections)     | Medium |
| **B — Standalone export file** | Export a self-contained offline form (HTML/file), fill outside the app, import back |          No           | Hard to match (maps/GeoJSON/validation rebuilt) |  High  |
| **C — Low-fi data export**     | Export answers as JSON/spreadsheet, edit externally, re-import                      |          No           |          Poor (no map, no validation)           |  Low   |

**Recommendation: Option A.** It reuses the entire existing form (the 12-section
react-hook-form, the map, validation, `mapDataForApi`) instead of rebuilding it.
Option B/C only make sense if loading the app offline is a hard no — and B costs
_more_ than A for full fidelity. This plan assumes **A**.

> If you genuinely cannot ship a service worker, say so — the plan changes substantially (Option C is the only cheap no-SW path, with big UX compromises).

---

## 4. Architecture (Option A)

### Component 1 — App shell loads offline (service worker)

Required so the form is usable with no network.

- Workbox `InjectManifest` service worker via the CRA PWA pattern.
- New `src/service-worker.js` + `src/serviceWorkerRegistration.js`, registered in `src/index.js`.
- **Wire into `config-overrides.js`** — build uses `react-app-rewired`, so CRA's default SW injection is bypassed.

### Component 2 — Persisted session

- Persist/hydrate token (`src/library/auth/interceptor.js`, `src/hooks/useAuth.js`) so the user reopens the app offline without re-auth. Expiry + clear-on-logout/401.
- **Constraint:** the download must happen _while online_; the session just has to survive going offline.

### Component 3 — "Download for offline" (the checkout)

On a site, a **Download** action packages everything the form needs into one IndexedDB record:

- All section answers (the existing GETs: `registration_intervention_answers`, `monitoring_answers`).
- Static reference data the form needs (question mapping, country lists, currencies — mostly already bundled in `src/data/`, so little to fetch).
- A bundle status: `downloaded` / `dirty` (edited) / `pushing` / `pushed` / `error`.
- New module `src/library/offline/bundleStore.ts` (IndexedDB via `idb`).

### Component 4 — Offline fill (reuse existing form)

- When a site is "downloaded", the form **reads from / writes to the local bundle** instead of the network.
- Reuse `FormWrapperProvider`, the section components, validation, and the map untouched.
- Hook point: `useInitializeQuestionMappedForm` gets an offline path that hydrates from the bundle; saves write to the bundle and flip status to `dirty`.
- Debounced autosave to IndexedDB so nothing is lost on refresh.

### Component 5 — "Push / Upload" (the check-in)

- Explicit **Push** button on a downloaded+dirty site.
- Replays each changed section through the existing save contract (PATCH for interventions, POST/PUT for monitoring), in order, with a visible progress UI.
- Last-write-wins (no detection in v1).
- On full success → status `pushed`, optionally re-download fresh server copy or remove from device.
- Per-section error handling: a failed section is shown, others continue; user can retry.

### Component 6 — Offline manager UI

- An **"Offline / Downloaded sites"** view: list of downloaded sites with status badges, storage used, and actions (open, push, remove).
- Status indicators on the normal site list too (this site is available offline / has unpushed edits).

---

## 5. New dependencies (Tech Radar — needs sign-off)

| Package                                | Purpose                                | Radar      |
| -------------------------------------- | -------------------------------------- | ---------- |
| `idb`                                  | IndexedDB wrapper for the bundle store | Not listed |
| `workbox-webpack-plugin` + `workbox-*` | Service worker (CRA-native path)       | Not listed |

Notably **lighter than the always-on plan** — no `@tanstack/*-persist-client` needed,
because we are not persisting/replaying the whole query cache; we manage explicit
bundles ourselves. `TanStack Query` (Adopt) and `axios` (existing) unchanged.

---

## 6. Time estimates

One mid/senior frontend dev. Dev-days = focused engineering, excluding review latency.

| #         | Component                                     | Estimate                                              | Confidence                               |
| --------- | --------------------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| 1         | Service worker + `react-app-rewired` wiring   | **1.5–2.5 d**                                         | Medium (fiddly, prod-build only to test) |
| 2         | Persisted session (+ security)                | **1–1.5 d**                                           | High                                     |
| 3         | Download / bundle store (IndexedDB)           | **2–3 d**                                             | Medium-high                              |
| 4         | Offline fill — wire form to bundle            | **2.5–4 d**                                           | Medium (touches the form data path)      |
| 5         | Push / upload + per-section progress & errors | **2.5–3.5 d**                                         | Medium (monitoring POST→PUT edge)        |
| 6         | Offline manager UI + status badges            | **2–3 d**                                             | High                                     |
| —         | Integration + manual offline QA               | **2–3 d**                                             | Medium                                   |
| —         | Security review (token persistence)           | **0.5 d**                                             | —                                        |
| —         | Code review + revisions buffer                | **1–2 d**                                             | —                                        |
| **Total** |                                               | **~15–23 dev-days** (≈ 3–4.5 calendar weeks, one dev) |                                          |

> **Honest note:** this is _not_ dramatically cheaper than the always-on offline plan
> (~11.5–19 d). The explicit model trades some sync-engine complexity for extra UI
> (download action, manager view, status everywhere). What you buy is **clarity and
> control**, not big time savings. The unavoidable cost in both plans is the service
> worker + persisted session + the form↔storage data path.

### Phasing

- **M1 — Foundation (~3–4 d):** Components 1–2. App loads offline, stays logged in.
- **M2 — Download & fill (~5–7 d):** Components 3–4. Checkout a site, fill offline, survives refresh.
- **M3 — Push (~3–4 d):** Component 5. Upload back to server.
- **M4 — Manager UI (~2–3 d):** Component 6. Visibility + management.

---

## 7. Caveats & risks

### Highest risk

- **New monitoring forms offline.** `POST /monitoring_answers` returns the server id; offline edits to a not-yet-pushed monitoring form have no real id. On push, create-then-remap or collapse to one payload. Same sharp edge as any offline model — needs tests.
- **Last-write-wins = silent overwrite.** Explicit push overwrites concurrent server changes with no warning. Better than always-on (user triggers it knowingly) but still must be **communicated in the UI** ("pushing may overwrite changes made by others since you downloaded").

### Build / tooling

- **Service worker + `react-app-rewired`** — custom `config-overrides.js`; only testable in a production build, not `npm start`. SW update/versioning strategy needed (don't strand users on stale shells).
- **CRA aging** — if a Vite migration happens later (Vite _Trial_), redo SW via `vite-plugin-pwa`.

### Data / storage

- **GeoJSON can be multiple MB** per site. IndexedDB handles it; cap downloads or warn on large sites. Show storage used in the manager.
- **Quota eviction** — browsers can evict IndexedDB under pressure; downloaded bundles are best-effort. Use `navigator.storage.persist()` and warn the user that downloaded-but-unpushed work isn't a permanent backup.

### Security

- Persisting the token widens XSS exposure vs in-memory today. Expiry + clear-on-logout/401 + security sign-off. Re-validate the SSO bridge (`src/hooks/sso.ts`).

### Stale-download risk

- A downloaded bundle is a **snapshot**. If the server form schema or a site changes after download, the offline copy is stale. v1: last-write-wins on push + a "downloaded on <date>" label. Schema migration of old bundles is out of scope.

### Out of scope (v1)

- Conflict detection / merge UI (server `updated_at` check) — possible later, would touch BE.
- Multi-device handoff of a bundle.
- Background Sync API (push while tab closed) — push is explicit, app open.
- Offline GeoJSON _file_ upload via the map — geometry parsed client-side; large-file caching may need a cap.

---

## 8. Verification (when built)

1. **App shell:** prod build + serve, DevTools Offline, reload → app loads.
2. **Session:** login online → offline → reload → still authenticated.
3. **Download:** online, Download a site → bundle stored, status `downloaded`, storage shown.
4. **Offline fill:** offline, open downloaded site, edit sections → status `dirty`; reload offline → edits survive.
5. **Push:** back online, Push → per-section progress, server reflects changes, status `pushed`.
6. **Last-write-wins:** server-side change, then push → offline value wins.
7. **Monitoring edge:** create new monitoring form offline, edit again offline, push → one form, final values, no duplicate.
8. **Manager:** list shows correct statuses; remove frees storage.
9. **Regressions:** `npm test` green.

---

## 9. Decisions needed

1. **Confirm Option A** (fill in-app, needs service worker) vs B/C. This is the biggest fork.
2. After push: keep the bundle, re-download fresh, or auto-remove?
3. Last-write-wins acceptable, or show an overwrite warning before push?
4. Storage cap / large-site (GeoJSON) handling?
5. Token persistence security sign-off.
