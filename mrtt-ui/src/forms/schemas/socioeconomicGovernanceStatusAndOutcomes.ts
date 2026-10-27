import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import { linkedAims, rows, text, unvalidated, type SectionShape } from './fields'

export const shape = {
  dateOfOutcomesAssessment: z
    .string({ error: language.form.required })
    .min(1, language.form.required),
  changeInGovernance: text,
  currentGovenance: multiselectWithOtherValidationNoMinimum,
  changeInTenureArrangement: text,
  currentLandOwnership: multiselectWithOtherValidationNoMinimum,
  rightsToLandInLaw: text,
  socioeconomicOutcomes: rows({
    mainLabel: text,
    secondaryLabel: text,
    child: text,
    type: text,
    trend: text,
    linkedAims,
    measurement: text,
    unit: text,
    comparison: text,
    value: unvalidated
  }),
  achievementOfSocioeconomicAims: text
} satisfies SectionShape<'socioeconomicGovernanceStatusAndOutcomes'>

export const defaultValues = {
  currentGovenance: { selectedValues: [] },
  currentLandOwnership: { selectedValues: [] }
}
