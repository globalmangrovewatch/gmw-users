import { formatIsoDay, parseIsoDay, toUtcIsoDay } from '@/lib/dates'

describe('dates', () => {
  it('reads the calendar day as written, ignoring the offset', () => {
    expect(parseIsoDay('2024-03-05T00:00:00.000Z')?.toISOString()).toBe('2024-03-05T00:00:00.000Z')
    // Legacy luxon values were saved in local time with an offset: still the 5th.
    expect(parseIsoDay('2024-03-05T00:00:00.000+01:00')?.toISOString()).toBe(
      '2024-03-05T00:00:00.000Z'
    )
    expect(parseIsoDay('2024-03-05')?.toISOString()).toBe('2024-03-05T00:00:00.000Z')
  })

  it('returns undefined for empty or unparseable values', () => {
    expect(parseIsoDay(undefined)).toBeUndefined()
    expect(parseIsoDay('')).toBeUndefined()
    expect(parseIsoDay('not a date')).toBeUndefined()
    expect(parseIsoDay(new Date('nope'))).toBeUndefined()
  })

  it('stores a day at UTC midnight and formats it as yyyy/MM/dd', () => {
    const day = new Date(Date.UTC(2026, 10, 4, 15, 30))
    expect(toUtcIsoDay(day)).toBe('2026-11-04T00:00:00.000Z')
    expect(formatIsoDay(day)).toBe('2026/11/04')
  })
})
