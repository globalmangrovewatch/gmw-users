# Offline Work Support — Feature Plan

> **Status:** Proposal / planning. No code written yet.
> **Author:** Engineering
> **Date:** 2026-06-26

---

## 1. Context & Goal

Field users of the Mangrove Restoration Tracker (MRTT) enter site registration and
monitoring data in remote locations with poor or no connectivity. The app today
**cannot work offline at all**.

### What's broken today

| Area      | Current state                                                                   | Source                                                                                                 |
| --------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| App shell | No service worker registered — app won't load without network                   | `public/manifest.json` exists, nothing registered                                                      |
| Session   | Token held **in-memory only** — refresh logs the user out, needs SSO round-trip | `src/library/auth/interceptor.js`, `src/hooks/useAuth.js`                                              |
| Reads     | TanStack Query cache lives in memory — lost on refresh                          | `src/App.js` QueryClient                                                                               |
| Edits     | Mutations hit the API directly, **fail immediately** offline                    | `useSaveRegistrationSection` in `src/library/question-mapped-form/useInitializeQuestionMappedForm.tsx` |
| Drafts    | react-hook-form state in memory — lost on refresh/connection drop               | `src/components/FormWrapper/FormWrapperProvider.js`                                                    |

### Confirmed requirements

- **Full edit + sync** — users create/edit site forms offline; changes queue locally and sync when back online.
- **Last-write-wins** conflict strategy — queued offline edits overwrite the server on sync (accepted data-loss risk).
- **Persist session locally** — user can reopen the app offline without re-authenticating.

### Why it's feasible

- Forms already submit **per-section, independently** (PATCH for interventions, POST/PUT for monitoring) — each section save is an independently-queueable unit, no full-site atomicity required.
- Server-state layer is **TanStack Query** (Tech Radar: _Adopt_), which ships **first-class offline-mutation queueing + cache persistence**. We build on it rather than hand-rolling a sync engine — this is the single biggest de-risking factor.

---

## 2. Overall Feasibility

**Verdict: Feasible, medium-high effort.** No architectural blockers. The stack is favourable (TanStack Query does the heavy lifting). Main risks are concentrated in two places: the **service-worker build wiring** (CRA + react-app-rewired) and the **offline mutation replay** (especially new monitoring forms). Everything else is well-trodden.

| Dimension             | Rating    | Note                                                               |
| --------------------- | --------- | ------------------------------------------------------------------ |
| Technical feasibility | 🟢 High   | Native TanStack Query support; per-section saves already queueable |
| Architectural risk    | 🟢 Low    | Wraps existing layers, no rewrite                                  |
| Build/tooling risk    | 🟡 Medium | Service worker via `react-app-rewired` needs custom wiring         |
| Sync-correctness risk | 🟡 Medium | Monitoring POST→PUT id remap is the sharp edge                     |
| Security risk         | 🟡 Medium | Persisting token = XSS exposure vs in-memory today                 |

---

## 3. Dependencies — Tech Radar review (org policy)

`TanStack Query` is **Adopt**. New deps **not listed** on the Vizzuality Tech Radar — require sign-off before install:

| Package                                        | Purpose                                                                                                             | Radar status                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `@tanstack/react-query-persist-client`         | Persist/restore the query + mutation cache                                                                          | Not listed (TanStack ecosystem) |
| `@tanstack/query-async-storage-persister`      | Async (IndexedDB) persister adapter                                                                                 | Not listed (TanStack ecosystem) |
| `idb`                                          | Tiny IndexedDB Promise wrapper — storage backend (localStorage's ~5MB cap too small for GeoJSON)                    | Not listed                      |
| `workbox-webpack-plugin` + `workbox-*` runtime | Service worker. This is the **CRA-native PWA path** (CRA already vendors these) — no third-party SW framework added | Not listed                      |

`axios` is **Deprioritised** on the radar but is the project's existing client — kept as-is, no migration.

---

## 4. Architecture — 6 layers

Each layer is independently shippable. Layers 1–3 are foundation; 4–5 deliver the headline feature; 6 is the polish that protects in-progress work.

### Layer 1 — App shell loads offline (service worker)

Register a Workbox service worker so build assets + app shell precache and the app boots with no network.

- New `src/service-worker.js` (Workbox `InjectManifest`) + `src/serviceWorkerRegistration.js` (standard CRA PWA files).
- Register in `src/index.js`.
- **Wire `workbox-webpack-plugin` into `config-overrides.js`** — because the build uses `react-app-rewired`, CRA's default SW injection is bypassed.
- Runtime-cache same-origin GETs (sites/answers) NetworkFirst, as a backstop to the query persister.

### Layer 2 — Persisted login session

- `interceptor.js`: persist `_token` to storage on `setAuthToken`, hydrate on module load.
- `useAuth.js` `bootstrap()`: hydrate persisted session **first** (instant offline reload), then run `silentSsoCheck()` when online to refresh/validate.
- Store in IndexedDB with an **expiry**; clear on `logout()` and on any 401.

### Layer 3 — Online/offline awareness

- New `useOnlineStatus` hook: `navigator.onLine` + `online`/`offline` events, wired to TanStack Query's `onlineManager`.
- Persistent **offline banner** + **sync-status indicator** (pending count / syncing / synced / error) in the app layout.

### Layer 4 — Persisted reads (view cached data offline)

- Wrap the singleton `QueryClient` (`src/App.js`) with `persistQueryClient` + IndexedDB async persister.
- Raise `gcTime`; set read queries to `networkMode: 'offlineFirst'`.
- Flip `refetchOnReconnect` to `true` so fresh data pulls after sync (currently `false`).

### Layer 5 — Offline mutations + sync (headline)

Refactor `useSaveRegistrationSection` to use TanStack Query paused-mutations (survive reload):

1. Register **global mutation defaults** via `queryClient.setMutationDefaults(['save-registration-section'], { mutationFn })`. The `mutationFn` reconstructs the request from **variables alone** (component unmounted on replay) — variables carry `{ siteId, section, sectionTarget, monitorId, payload }`. Move `mapDataForApi()` + verb selection into it.
2. `networkMode: 'online'` so mutations **pause** instead of failing offline.
3. **Optimistic cache write** in `onMutate` — UI reflects saved value immediately offline.
4. Mutation cache persisted (Layer 4's persister dehydrates paused mutations).
5. **Resume on reconnect**: `onlineManager` subscription → `resumePausedMutations()`, replaying in order. Last-write-wins falls out naturally.

### Layer 6 — Form-draft persistence (unsaved edits)

- In `FormWrapperProvider.js`, persist react-hook-form values to IndexedDB keyed by `siteId` (+ section), debounced.
- Restore the active site's draft on mount/site-change (extend the existing site-change `useEffect` that currently only resets to `defaultValues`).
- Clear a section's draft when its save mutation succeeds.

---

## 5. Critical files

| File                                                                   | Change                                                   | New?    |
| ---------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| `src/index.js`                                                         | Register service worker                                  | edit    |
| `config-overrides.js`                                                  | Add `workbox-webpack-plugin` InjectManifest              | edit    |
| `src/service-worker.js`, `src/serviceWorkerRegistration.js`            | CRA PWA files                                            | **new** |
| `src/library/auth/interceptor.js`                                      | Persist + hydrate token                                  | edit    |
| `src/hooks/useAuth.js`                                                 | Hydrate session first, then silent SSO                   | edit    |
| `src/App.js`                                                           | Wrap QueryClient with persistence; tune defaults         | edit    |
| `src/library/query/persister.ts`                                       | IndexedDB persister (`idb`)                              | **new** |
| `src/hooks/useOnlineStatus.ts`                                         | online/offline + `onlineManager`                         | **new** |
| `src/library/question-mapped-form/useInitializeQuestionMappedForm.tsx` | Mutation defaults, networkMode, optimistic write, resume | edit    |
| `src/components/FormWrapper/FormWrapperProvider.js`                    | Persist/restore form drafts                              | edit    |
| Layout component (near `src/components/`)                              | Offline banner + sync indicator                          | edit    |

**Reuse, don't rebuild:** keep `mapDataForApi()`, `formatApiAnswersForForm()`, `questionMapping.js`, the existing axios interceptor, and the per-section save contract. The offline layer wraps these.

---

## 6. Time estimates

Ranges assume one mid/senior frontend dev familiar with React + TanStack Query. "Dev-days" = focused engineering days, excluding review latency.

| Layer     | Work                                                  | Estimate                                                   | Confidence                                     |
| --------- | ----------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| 1         | Service worker + `react-app-rewired` wiring           | **1.5–2.5 d**                                              | Medium — wiring is fiddly, hard to test in dev |
| 2         | Persisted session + security handling                 | **1–1.5 d**                                                | High                                           |
| 3         | Online/offline hook + banner + indicator              | **0.5–1 d**                                                | High                                           |
| 4         | Query cache persistence (IndexedDB)                   | **1–2 d**                                                  | Medium-high                                    |
| 5         | Offline mutations + sync (incl. monitoring edge case) | **3–5 d**                                                  | Medium — the hard part                         |
| 6         | Form-draft persistence                                | **1–2 d**                                                  | High                                           |
| —         | Integration + manual offline QA (the 8 scenarios)     | **2–3 d**                                                  | Medium                                         |
| —         | Security review of token persistence                  | **0.5 d**                                                  | —                                              |
| —         | Code review + revisions buffer                        | **1–2 d**                                                  | —                                              |
| **Total** |                                                       | **~11.5–19 dev-days** (≈ 2.5–4 calendar weeks for one dev) |                                                |

**Suggested phasing for incremental delivery:**

- **Milestone A (foundation, ~3–4 d):** Layers 1–3. App installs, loads offline, stays logged in, shows status. Shippable on its own.
- **Milestone B (read offline, ~1–2 d):** Layer 4. View previously-loaded sites offline.
- **Milestone C (the feature, ~4–6 d):** Layer 5. Edit + queue + sync.
- **Milestone D (polish, ~1–2 d):** Layer 6 draft safety net.

---

## 7. Caveats & risks

### Sync correctness

- **New monitoring forms offline (highest risk).** `POST /monitoring_answers` returns the server `monitorId`; offline edits to a not-yet-synced form have no real id. Mitigation: assign a temp client id and remap queued PUTs to the returned id on POST success, or collapse same-form edits into one payload before replay. Needs careful implementation + tests.
- **Last-write-wins = silent data loss.** A queued offline edit overwrites concurrent server changes from other users with no warning. Accepted per requirements — must be **documented for users**, not just code.
- **Replay ordering.** `resumePausedMutations()` replays in insertion order; verify multi-section / multi-site queues replay in a coherent order.
- **Mid-sync failures.** A mutation that 4xx/5xxs on replay (validation drift, deleted site) needs a visible error state + retry/discard affordance, not a silent stall.

### Build / tooling

- **`react-app-rewired` + Workbox.** Custom `config-overrides.js` wiring; CRA's built-in SW path doesn't apply. Service workers are awkward to test under `npm start` (dev server) — needs a production build to validate.
- **CRA is itself aging.** Service-worker tooling here is on CRA 5; if a future Vite migration happens (Vite is _Trial_ on the radar), the SW setup would be redone via `vite-plugin-pwa`.
- **Service-worker update/versioning.** Cache-busting and prompting users to reload on a new deploy needs a deliberate strategy, or users get stuck on stale shells.

### Security

- **Token persistence widens XSS exposure** vs the current in-memory token. IndexedDB is marginally safer than localStorage but not immune. Needs: expiry, clear-on-logout, clear-on-401, and a security sign-off. SSO bridge interaction (`src/hooks/sso.ts`) must be re-validated.

### Data / storage

- **GeoJSON payloads can be multiple MB.** IndexedDB handles it, but watch total quota; may need a per-site cache cap or eviction policy.
- **Quota eviction.** Browsers can evict IndexedDB under storage pressure — persisted drafts/queue are best-effort, not guaranteed durable. Consider `navigator.storage.persist()`.

### Scope boundaries (explicitly out)

- Conflict **detection / merge UI** — deferred (last-write-wins chosen).
- Offline **GeoJSON file uploads** via the map (`ProjectAreaMap.js`) — geometry parsed client-side already; large-payload caching may need a size cap.
- **Background Sync API** (sync when tab closed) — v1 syncs on reconnect while the app is open.

---

## 8. Verification (when built)

1. **App shell:** build + serve; DevTools → Offline → reload → app loads.
2. **Session:** log in online, go offline, reload → still authenticated.
3. **Read offline:** open a site online, go offline, navigate to it → sections populate from cache.
4. **Edit + queue:** offline edit + Save → optimistic update + pending count up; reload offline → change persists.
5. **Sync:** back online → queued mutations replay, pending → 0, server reflects changes.
6. **Last-write-wins:** server-side change to same field, then sync offline edit → offline value wins.
7. **Monitoring edge case:** create new monitoring form offline, edit again offline, sync → one form, final values, no duplicate.
8. **Regressions:** existing `npm test` suite green.

---

## 9. Open questions for product/eng

1. Token persistence security trade-off — acceptable, or require online login per session?
2. Is silent last-write-wins acceptable to users, or do we need at least a "this may overwrite others' changes" warning before sync?
3. Storage cap / eviction policy for large GeoJSON sites?
4. Service-worker update UX — auto-reload on new deploy, or prompt?
