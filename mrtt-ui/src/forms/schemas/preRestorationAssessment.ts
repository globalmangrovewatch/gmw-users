import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import {
  addIssue,
  checkRows,
  isEmpty,
  isNumeric,
  measurementRule,
  numberAnswer,
  numberError,
  numeric,
  percentageRule,
  rows,
  text,
  toNumber,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  mangrovesPreviouslyOccured: text,
  mangroveRestorationAttempted: text,
  lastRestorationAttemptYear: numberAnswer,
  previousBiophysicalInterventions: multiselectWithOtherValidationNoMinimum,
  whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidationNoMinimum,
  siteAssessmentBeforeProject: text,
  siteAssessmentType: multiselectWithOtherValidationNoMinimum,
  referenceSite: text,
  lostMangrovesYear: numberAnswer,
  naturalRegenerationAtSite: text,
  mangroveSpeciesPresent: z.array(z.string()).nullable().optional(),
  speciesComposition: rows({
    mangroveSpeciesType: text,
    percentageComposition: numeric(language.form.error.notANumber)
      .refine((value) => !numberError(value, percentageRule), language.form.error.percentage)
      .optional()
  }),
  physicalMeasurementsTaken: rows({ measurementType: text, measurementValue: numberAnswer }),
  pilotTestConducted: text,
  guidanceForSiteRestoration: text
} satisfies SectionShape<'preRestorationAssessment'>

const yearErrors = language.form.error

// A year is only checked when its question applies, and may be left empty.
const checkYear = (ctx: z.RefinementCtx, field: string, applies: boolean, value: unknown) => {
  if (!applies || isEmpty(value)) return
  const year = toNumber(value)
  if (!isNumeric(value)) addIssue(ctx, [field], yearErrors.noYearProvided)
  else if (!Number.isInteger(year)) addIssue(ctx, [field], yearErrors.wholeNumber)
  else if (year < 1900) addIssue(ctx, [field], yearErrors.yearTooLow)
  else if (year > new Date().getFullYear()) addIssue(ctx, [field], yearErrors.yearTooHigh)
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
  checkRows(
    ctx,
    values,
    'physicalMeasurementsTaken',
    (row) => row.measurementValue,
    measurementRule,
    'measurementType'
  )
}

export const defaultValues = {
  previousBiophysicalInterventions: { selectedValues: [], otherValue: undefined },
  whyUnsuccessfulRestorationAttempt: { selectedValues: [], otherValue: undefined }
}
