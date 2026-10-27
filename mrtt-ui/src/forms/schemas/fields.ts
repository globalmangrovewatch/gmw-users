import { z } from 'zod'

import type { FieldKey, SectionKey } from '@/data/questionMapping'

// Every mapped question of a section must have a schema, and nothing else may.
export type SectionShape<S extends SectionKey> = Record<FieldKey<S>, z.ZodType>

// Cross-field rules of a section. They see the whole form, which may hold invalid or
// missing values from other sections, so they read it defensively.
export type SectionRefine = (values: Record<string, unknown>, ctx: z.RefinementCtx) => void

export const isEmpty = (value: unknown) => value === undefined || value === null || value === ''

// The forms hold dates as ISO strings from the date pickers, but a value may also be a Date or
// a luxon DateTime, whose string form is ISO. Returns undefined for empty or unparseable values.
export const toDate = (value: unknown): Date | undefined => {
  if (isEmpty(value)) return undefined
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

export type DateInput = string | Date | { toISO(): string | null }

// Required dates are checked in the section's `refine` (see `requireDate`): a missing object key
// fails before a field schema can pick its message, and a failing `z.custom` stops the refines.
export const date = z
  .custom<DateInput | null>()
  .refine((value) => isEmpty(value) || toDate(value) !== undefined, 'Please enter a valid date')
  .optional()

export const requireDate = (
  ctx: z.RefinementCtx,
  values: Record<string, unknown>,
  field: string,
  message: string
) => {
  if (isEmpty(values[field])) addIssue(ctx, [field], message)
}

export const isBefore = (end: unknown, start: unknown) => {
  const endDate = toDate(end)
  const startDate = toDate(start)
  return endDate !== undefined && startDate !== undefined && endDate < startDate
}

export const endBeforeStartMessage = "End date can't be before start date"

// Radio groups store booleans, but answers coming back from the API may hold 'true'/'false'.
export const booleanLike = z.union([z.boolean(), z.enum(['true', 'false'])]).optional()

export const isTrue = (value: unknown) => value === true || value === 'true'

// A number, or a string holding one (whitespace ignored), the way number inputs report it.
export const isNumeric = (value: unknown) => {
  const parsed = typeof value === 'string' ? value.replace(/\s/g, '') : value
  if (parsed === '') return false
  const number = typeof parsed === 'string' ? Number(parsed) : parsed
  return typeof number === 'number' && !Number.isNaN(number)
}

export const numeric = (message?: string) =>
  z.union([z.number(), z.string()], { error: message }).refine(isNumeric, { error: message })

// Answers the schema does not check. `.optional()` because zod 4 treats a missing key as an
// error even for `z.unknown()`.
export const unvalidated = z.unknown().optional()

export const text = z.string().optional()
export const nullableText = z.string().nullable().optional()

// Rows of a tabular question; a missing list means no rows.
export const rows = <T extends z.ZodRawShape>(shape: T) => z.array(z.object(shape)).optional()

export const stakeholderRows = rows({ stakeholder: text, stakeholderType: text })

export const linkedAims = z.array(z.string()).optional()

export const addIssue = (ctx: z.RefinementCtx, path: PropertyKey[], message: string) =>
  ctx.addIssue({ code: 'custom', message, path })
