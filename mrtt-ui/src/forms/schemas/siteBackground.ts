import { z } from 'zod'

import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import { nullableText, text, type SectionShape } from './fields'

export const shape = {
  stakeholders: z
    .array(z.object({ stakeholderType: text, stakeholderName: text }), {
      error: 'Select at least one stakeholder'
    })
    .min(1, 'stakeholders field must have at least 1 items'),
  managementStatus: text,
  lawStatus: text,
  managementArea: text,
  protectionStatus: multiselectWithOtherValidationNoMinimum,
  areStakeholdersInvolved: nullableText,
  governmentArrangement: multiselectWithOtherValidationNoMinimum,
  landTenure: multiselectWithOtherValidationNoMinimum,
  customaryRights: text
} satisfies SectionShape<'siteBackground'>

export const defaultValues = {
  protectionStatus: { selectedValues: [], otherValue: undefined },
  landTenure: { selectedValues: [], otherValue: undefined }
}
