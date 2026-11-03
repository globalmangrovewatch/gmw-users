import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import { nullableText, text, type SectionShape } from './fields'

export const shape = {
  dateOfAssessment: z.string({ error: language.form.required }).min(1, language.form.required),
  stakeholderManagement: multiselectWithOtherValidationNoMinimum,
  stakeholderInfluence: text,
  managementStatusChanges: text,
  currentManagementStatus: nullableText,
  managementLaws: nullableText,
  nameOfFormalManagementArea: nullableText,
  projectStatusChange: text,
  currentProtectionStatus: nullableText,
  financeForCiteManagement: text,
  sufficientFunds: text,
  resourcesToEnforceRegulations: text,
  equitableSharingOfSiteBenefits: text,
  climateChangeAdaptation: text
} satisfies SectionShape<'managementStatusAndEffectiveness'>

export const defaultValues = {
  stakeholderManagement: { selectedValues: [], otherValue: undefined }
}
