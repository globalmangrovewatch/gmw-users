import { z } from 'zod'

import type { FieldKey, SectionKey } from '@/data/questionMapping'
import language from '@/language'

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

export const toNumber = (value: unknown) =>
  typeof value === 'string' ? Number(value.replace(/\s/g, '')) : Number(value)

const numberErrors = language.form.error

export type NumberRule = { min?: number; max?: number; integer?: boolean; rangeMessage?: string }

export const percentageRule: NumberRule = {
  min: 0,
  max: 100,
  rangeMessage: numberErrors.percentage
}
export const countRule: NumberRule = { min: 0, integer: true }
export const amountRule: NumberRule = { min: 0 }
export const measurementRule: NumberRule = {}

// The message for a value that breaks `rule`, or undefined when it is empty or valid.
export const numberError = (value: unknown, rule: NumberRule) => {
  if (isEmpty(value)) return undefined
  if (!isNumeric(value)) return numberErrors.notANumber
  const number = toNumber(value)
  if (rule.integer && !Number.isInteger(number)) return numberErrors.wholeNumber
  const tooLow = rule.min !== undefined && number < rule.min
  const tooHigh = rule.max !== undefined && number > rule.max
  if (tooLow || tooHigh) return rule.rangeMessage ?? numberErrors.notNegative
  return undefined
}

// A number typed into a text field: a string, or a number loaded from the API. Its value is
// checked in the section's `refine` when it depends on other answers or sits in a table row
// (the tables only show one error for the whole list, see `checkRows`).
export const numberAnswer = z.union([z.number(), z.string()]).optional()

// An optional number answer, checked against `rule` on its own field.
export const numberField = (rule: NumberRule) =>
  numberAnswer.superRefine((value, ctx) => {
    const message = numberError(value, rule)
    if (message) ctx.addIssue({ code: 'custom', message })
  })

type Row = Record<string, unknown>

// Reports the first invalid row of `list` on the list itself, named by its `labelKey` value.
export const checkRows = (
  ctx: z.RefinementCtx,
  values: Record<string, unknown>,
  list: string,
  key: (row: Row) => unknown,
  rule: NumberRule,
  labelKey: string
) => {
  const items = Array.isArray(values[list]) ? (values[list] as Row[]) : []
  for (const [index, row] of items.entries()) {
    const message = numberError(key(row ?? {}), rule)
    if (!message) continue
    const label =
      typeof row?.[labelKey] === 'string' && row[labelKey] ? row[labelKey] : `Row ${index + 1}`
    addIssue(ctx, [list], `${label}: ${message}`)
    return
  }
}

export const text = z.string().optional()
export const nullableText = z.string().nullable().optional()

// Rows of a tabular question; a missing list means no rows.
export const rows = <T extends z.ZodRawShape>(shape: T) => z.array(z.object(shape)).optional()

export const stakeholderRows = rows({ stakeholder: text, stakeholderType: text })

export const linkedAims = z.array(z.string()).optional()

export const addIssue = (ctx: z.RefinementCtx, path: PropertyKey[], message: string) =>
  ctx.addIssue({ code: 'custom', message, path })
