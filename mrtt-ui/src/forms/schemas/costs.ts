import { z } from 'zod'

import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import { rows, text, unvalidated, type SectionShape } from './fields'

export const shape = {
  supportForActivities: multiselectWithOtherValidationNoMinimum,
  projectInterventionFunding: z.object({ fundingType: text, other: text }).optional(),
  projectFunderNames: rows({ funderName: text, funderType: text, percentage: unvalidated }),
  costOfProjectActivities: z.object({ cost: unvalidated, currency: text }).optional(),
  breakdownOfCost: rows({ costType: text, cost: unvalidated, currency: text }),
  percentageSplitOfActivities: rows({ intervention: text, percentage: unvalidated }),
  nonmonetisedContributions: multiselectWithOtherValidationNoMinimum
} satisfies SectionShape<'costs'>

export const defaultValues = {
  supportForActivities: { selectedValues: [], otherValue: undefined },
  nonmonetisedContributions: { selectedValues: [], otherValue: undefined }
}
