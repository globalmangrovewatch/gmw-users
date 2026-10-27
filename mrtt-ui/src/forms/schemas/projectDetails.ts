import { z } from 'zod'

import emptyFeatureCollection from '@/data/emptyFeatureCollection'
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
  countries: z
    .array(country, { error: 'Select at least one country' })
    .min(1, 'countries field must have at least 1 items')
    .optional(),
  siteArea: z.object(
    {
      features: z.array(z.unknown(), { error: siteAreaError }).min(1, siteAreaError).readonly()
    },
    { error: siteAreaError }
  )
} satisfies SectionShape<'projectDetails'>

export const refine: SectionRefine = (values, ctx) => {
  requireDate(ctx, values, 'projectStartDate', 'Select a start date')

  if (!isTrue(values.hasProjectEndDate)) return

  if (isEmpty(values.projectEndDate)) {
    addIssue(ctx, ['projectEndDate'], 'Please select an end date')
  } else if (isBefore(values.projectEndDate, values.projectStartDate)) {
    addIssue(ctx, ['projectEndDate'], endBeforeStartMessage)
  }
}

export const defaultValues = {
  projectStartDate: new Date().toISOString(),
  hasProjectEndDate: false,
  projectEndDate: new Date().toISOString(),
  countries: undefined,
  siteArea: emptyFeatureCollection
}
