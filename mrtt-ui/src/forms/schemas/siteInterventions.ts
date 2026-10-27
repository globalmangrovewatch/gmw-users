import { z } from 'zod'

import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '@/validation/multiSelectWithOther'
import {
  addIssue,
  date,
  endBeforeStartMessage,
  isBefore,
  rows,
  stakeholderRows,
  text,
  unvalidated,
  type SectionRefine,
  type SectionShape
} from './fields'

const plantingMaterial = z
  .object({
    checked: z.boolean().optional(),
    source: z.array(z.string()).optional(),
    count: unvalidated
  })
  .optional()

export const shape = {
  whichStakeholdersInvolved: stakeholderRows,
  biophysicalInterventionsUsed: multiselectWithOtherValidation,
  biophysicalInterventionDuration: z.object({ startDate: date, endDate: date }).optional(),
  mangroveSpeciesUsed: rows({ type: text, seed: plantingMaterial, propagule: plantingMaterial }),
  mangroveAssociatedSpecies: rows({
    type: text,
    count: unvalidated,
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
}

export const defaultValues = {
  organizationsProvidingTraining: { selectedValues: [], otherValue: undefined },
  otherActivitiesImplemented: { selectedValues: [], otherValue: undefined }
}
