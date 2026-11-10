// Form dates are calendar days stored as ISO strings at UTC midnight (`2024-03-05T00:00:00.000Z`).

const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})/

/**
 * The calendar day of an ISO string, as a Date at UTC midnight.
 * Reads the date part as written, so a legacy value saved with an offset
 * (`2024-03-05T00:00:00.000+01:00`) still shows the 5th, not the UTC instant (the 4th).
 */
export function parseIsoDay(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  if (typeof value !== 'string') return undefined

  const match = ISO_DAY.exec(value)
  if (!match) return undefined

  const [, year, month, day] = match
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
}

/** The ISO string for the UTC calendar day of `date`, at midnight: `…T00:00:00.000Z`. */
export function toUtcIsoDay(date: Date): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  ).toISOString()
}

/** `yyyy/MM/dd` for the UTC calendar day of `date`. */
export function formatIsoDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getUTCFullYear()}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}`
}
