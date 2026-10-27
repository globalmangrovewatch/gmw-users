import { z } from 'zod'

import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import {
  amountRule,
  checkRows,
  numberField,
  percentageRule,
  numberAnswer,
  rows,
  text,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  supportForActivities: multiselectWithOtherValidationNoMinimum,
  projectInterventionFunding: z.object({ fundingType: text, other: text }).optional(),
  projectFunderNames: rows({ funderName: text, funderType: text, percentage: numberAnswer }),
  costOfProjectActivities: z.object({ cost: numberField(amountRule), currency: text }).optional(),
  breakdownOfCost: rows({ costType: text, cost: numberAnswer, currency: text }),
  percentageSplitOfActivities: rows({ intervention: text, percentage: numberAnswer }),
  nonmonetisedContributions: multiselectWithOtherValidationNoMinimum
} satisfies SectionShape<'costs'>

export const refine: SectionRefine = (values, ctx) => {
  checkRows(
    ctx,
    values,
    'projectFunderNames',
    (row) => row.percentage,
    percentageRule,
    'funderName'
  )
  checkRows(ctx, values, 'breakdownOfCost', (row) => row.cost, amountRule, 'costType')
  checkRows(
    ctx,
    values,
    'percentageSplitOfActivities',
    (row) => row.percentage,
    percentageRule,
    'intervention'
  )
}

export const defaultValues = {
  supportForActivities: { selectedValues: [], otherValue: undefined },
  nonmonetisedContributions: { selectedValues: [], otherValue: undefined }
}
