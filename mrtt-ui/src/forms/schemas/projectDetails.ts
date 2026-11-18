import { z } from 'zod'

import emptyFeatureCollection from '@/data/emptyFeatureCollection'
import { todayUtcIsoDay } from '@/lib/dates'
import {
  addIssue,
  booleanLike,
  date,
  endBeforeStartMessage,
  isBefore,
  isEmpty,
  isTrue,
  numeric,
  requireDate,
  text,
  type SectionRefine,
  type SectionShape
} from './fields'

const siteAreaError = 'Please provide a site area'
const countriesError = 'countries field must have at least 1 items'

// Countries come from `mangrove_countries.json`, whose bbox values are numeric strings.
const country = z.object({
  bbox: z.array(numeric()).optional(),
  geometry: z.object({ coordinates: z.array(numeric()).optional(), type: text }).optional(),
  properties: z.object({ country: text, mangroves: text }).optional()
})

export const shape = {
  projectStartDate: date,
  hasProjectEndDate: booleanLike,
  projectEndDate: date,
  // "At least one" for countries and the site area is checked in `refine`, so the error sits on
  // the field itself: react-hook-form's `trigger(name)` drops errors nested under a field
  // (siteArea.features) whose Controller registers no sub-fields.
  countries: z.array(country, { error: 'Select at least one country' }).optional(),
  siteArea: z.object(
    { features: z.array(z.unknown(), { error: siteAreaError }).readonly() },
    { error: siteAreaError }
  )
} satisfies SectionShape<'projectDetails'>

const hasItems = (value: unknown) => Array.isArray(value) && value.length > 0

export const refine: SectionRefine = (values, ctx) => {
  requireDate(ctx, values, 'projectStartDate', 'Select a start date')

  if (!hasItems(values.countries)) addIssue(ctx, ['countries'], countriesError)
  const siteArea = values.siteArea as { features?: unknown } | undefined
  if (!hasItems(siteArea?.features)) addIssue(ctx, ['siteArea'], siteAreaError)

  if (!isTrue(values.hasProjectEndDate)) return

  if (isEmpty(values.projectEndDate)) {
    addIssue(ctx, ['projectEndDate'], 'Please select an end date')
  } else if (isBefore(values.projectEndDate, values.projectStartDate)) {
    addIssue(ctx, ['projectEndDate'], endBeforeStartMessage)
  }
}

export const defaultValues = {
  projectStartDate: todayUtcIsoDay(),
  hasProjectEndDate: false,
  projectEndDate: todayUtcIsoDay(),
  countries: undefined,
  siteArea: emptyFeatureCollection
}
