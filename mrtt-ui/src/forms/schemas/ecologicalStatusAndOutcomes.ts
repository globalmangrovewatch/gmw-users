import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import {
  addIssue,
  date,
  endBeforeStartMessage,
  isBefore,
  linkedAims,
  requireDate,
  rows,
  stakeholderRows,
  text,
  unvalidated,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  // Not validated, as before the zod migration.
  dateOfEcologicalMonitoring: unvalidated,
  monitoringStartDate: date,
  monitoringEndDate: date,
  ecologicalMonitoringStakeholders: stakeholderRows,
  mangroveAreaIncrease: text,
  mangroveAreaBeforeAfter: unvalidated,
  mangroveConditionImprovement: text,
  preAndPostRestorationActivities: z
    .object({
      areaPreIntervention: text,
      unitPre: text,
      unitPreOther: text,
      areaPostIntervention: text,
      unitPost: text,
      unitPostOther: text
    })
    .optional(),
  naturalRegenerationOnSite: text,
  percentageSurvival: unvalidated,
  causeOfLowSurvival: multiselectWithOtherValidationNoMinimum,
  monitoringIndicators: rows({
    mainLabel: text,
    secondaryLabel: text,
    indictor: text,
    metric: text,
    measurement: unvalidated,
    unit: text,
    comparison: text,
    measurementComparison: unvalidated,
    linkedAims
  }),
  achievementOfEcologicalAims: text
} satisfies SectionShape<'ecologicalStatusAndOutcomes'>

export const refine: SectionRefine = (values, ctx) => {
  requireDate(ctx, values, 'monitoringStartDate', language.form.required)
  if (isBefore(values.monitoringEndDate, values.monitoringStartDate)) {
    addIssue(ctx, ['monitoringEndDate'], endBeforeStartMessage)
  }
}

export const defaultValues = {
  ecologicalMonitoringStakeholders: [],
  causeOfLowSurvival: { selectedValues: [] },
  preAndPostRestorationActivities: {}
}
