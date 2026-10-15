# ADR 007: date-fns replaces luxon; date answers stored as UTC midnight

**Status:** Accepted
**Date:** 2026-10-13
**Jira:** GMW-1116

---

## Context

`DatePickerUtcMui.js` parses with `DateTime.fromISO` (local zone) and emits `toISO()`, i.e. **local midnight with the local offset** (`2024-03-05T00:00:00.000+02:00`), despite the component's name. Form defaults are luxon `DateTime` objects the parser cannot read, so the picker shows "Invalid" until server data arrives. `QuestionNav.js` writes `new Date().toISOString()` with a time of day. luxon 2 is unlisted on the Radar; date-fns 4 is **Adopt**.

The answers are calendar dates (project start/end, assessment dates), not instants. Stored bytes will change from `+hh:mm` to `Z`.

## Decision

- `src/lib/dates.ts` on **date-fns 4 + `@date-fns/utc`**: `toUtcDay(value)` parses by the string's **own calendar day** (tolerant of legacy `+hh:mm` values) → `Date.UTC`; `toUtcIso(day)` → `YYYY-MM-DDT00:00:00.000Z`; `todayUtcIso()`; `formatUtcDay(iso, pattern)` via `UTCDate`. No `date-fns-tz`.
- The date picker emits UTC midnight only; defaults become `todayUtcIso()`.
- luxon is removed. The MUI picker stays until ADR 004 swaps it for `react-day-picker` with `timeZone="UTC"`.
- The API owner confirms that date answers are treated as dates, not timestamps, before the change ships.

## Alternatives considered

- **Keep luxon, fix the offset bug.** Fixes the bug, keeps an unlisted dependency and two date libraries once date-fns arrives with shadcn's Calendar.
- **Day.js.** Lighter, but unlisted on the Radar; date-fns is the org default.
- **Store plain `YYYY-MM-DD`.** Cleanest semantically, but changes the answer type the API and existing MRTT exports already consume; out of scope for a frontend ticket.

## Consequences

**Positive**

- A date entered in Jakarta and read in Madrid shows the same calendar day. Round-trips of legacy values keep their day.
- One date library; `UTCDate` formatting removes the whole class of offset bugs.

**Negative / risks**

- Existing rows keep `+hh:mm` values; reads must stay tolerant forever, or a backend normalisation task must run.
- Downstream consumers of the stored strings (reports, exports) see a byte change; the API owner's confirmation is the gate.
