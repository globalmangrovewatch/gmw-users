import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import {
  addIssue,
  numeric,
  rows,
  text,
  unvalidated,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  mangrovesPreviouslyOccured: text,
  mangroveRestorationAttempted: text,
  lastRestorationAttemptYear: unvalidated,
  previousBiophysicalInterventions: multiselectWithOtherValidationNoMinimum,
  whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidationNoMinimum,
  siteAssessmentBeforeProject: text,
  siteAssessmentType: multiselectWithOtherValidationNoMinimum,
  referenceSite: text,
  lostMangrovesYear: unvalidated,
  naturalRegenerationAtSite: text,
  mangroveSpeciesPresent: z.array(z.string()).nullable().optional(),
  speciesComposition: rows({
    mangroveSpeciesType: unvalidated,
    percentageComposition: numeric('Please enter a number').optional()
  }),
  physicalMeasurementsTaken: rows({ measurementType: text, measurementValue: unvalidated }),
  pilotTestConducted: text,
  guidanceForSiteRestoration: text
} satisfies SectionShape<'preRestorationAssessment'>

// A year is only checked when its question applies, and only when it is a number: an empty
// input or any string counts as no answer.
const checkYear = (ctx: z.RefinementCtx, field: string, applies: boolean, value: unknown) => {
  if (!applies || typeof value !== 'number' || Number.isNaN(value)) return
  if (value < 1900) addIssue(ctx, [field], language.form.error.yearTooLow)
  else if (value > new Date().getFullYear()) addIssue(ctx, [field], language.form.error.yearTooHigh)
}

export const refine: SectionRefine = (values, ctx) => {
  checkYear(
    ctx,
    'lastRestorationAttemptYear',
    values.mangroveRestorationAttempted === 'Yes',
    values.lastRestorationAttemptYear
  )
  checkYear(
    ctx,
    'lostMangrovesYear',
    values.siteAssessmentBeforeProject === 'Yes',
    values.lostMangrovesYear
  )
}

export const defaultValues = {
  previousBiophysicalInterventions: { selectedValues: [], otherValue: undefined },
  whyUnsuccessfulRestorationAttempt: { selectedValues: [], otherValue: undefined }
}
