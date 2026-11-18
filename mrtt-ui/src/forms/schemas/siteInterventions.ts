import { z } from 'zod'

import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '@/validation/multiSelectWithOther'
import {
  addIssue,
  checkRows,
  countRule,
  date,
  endBeforeStartMessage,
  isBefore,
  numberAnswer,
  rows,
  stakeholderRows,
  text,
  type SectionRefine,
  type SectionShape
} from './fields'

const plantingMaterial = z
  .object({
    checked: z.boolean().optional(),
    source: z.array(z.string()).optional(),
    count: numberAnswer
  })
  .optional()

export const shape = {
  whichStakeholdersInvolved: stakeholderRows,
  biophysicalInterventionsUsed: multiselectWithOtherValidation,
  biophysicalInterventionDuration: z.object({ startDate: date, endDate: date }).optional(),
  mangroveSpeciesUsed: rows({ type: text, seed: plantingMaterial, propagule: plantingMaterial }),
  mangroveAssociatedSpecies: rows({
    type: text,
    count: numberAnswer,
    source: text,
    purpose: z.object({ purpose: text, other: text }).optional()
  }),
  localParticipantTraining: text,
  organizationsProvidingTraining: multiselectWithOtherValidationNoMinimum,
  otherActivitiesImplemented: multiselectWithOtherValidation
} satisfies SectionShape<'siteInterventions'>

export const refine: SectionRefine = (values, ctx) => {
  const duration = values.biophysicalInterventionDuration as
    | { startDate?: unknown; endDate?: unknown }
    | undefined
  if (isBefore(duration?.endDate, duration?.startDate)) {
    addIssue(ctx, ['biophysicalInterventionDuration', 'endDate'], endBeforeStartMessage)
  }

  const count = (material: 'seed' | 'propagule') => (row: Record<string, unknown>) =>
    (row[material] as { count?: unknown } | undefined)?.count
  checkRows(ctx, values, 'mangroveSpeciesUsed', count('seed'), countRule, 'type')
  checkRows(ctx, values, 'mangroveSpeciesUsed', count('propagule'), countRule, 'type')
  checkRows(ctx, values, 'mangroveAssociatedSpecies', (row) => row.count, countRule, 'type')
}

export const defaultValues = {
  organizationsProvidingTraining: { selectedValues: [], otherValue: undefined },
  otherActivitiesImplemented: { selectedValues: [], otherValue: undefined }
}
