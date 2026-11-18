import { z } from 'zod'

import language from '@/language'
import { multiselectWithOtherValidationNoMinimum } from '@/validation/multiSelectWithOther'
import {
  addIssue,
  checkRows,
  date,
  endBeforeStartMessage,
  isBefore,
  linkedAims,
  measurementRule,
  numberField,
  percentageRule,
  requireDate,
  numberAnswer,
  rows,
  stakeholderRows,
  text,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  // Set by QuestionNav from the monitoring form's date; no input shows it.
  dateOfEcologicalMonitoring: date,
  monitoringStartDate: date,
  monitoringEndDate: date,
  ecologicalMonitoringStakeholders: stakeholderRows,
  mangroveAreaIncrease: text,
  // No input shows it, so a bad value could only come from the API; checked by type only.
  mangroveAreaBeforeAfter: z
    .object({ before: numberAnswer, after: numberAnswer, unit: text })
    .optional(),
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
  percentageSurvival: numberField(percentageRule),
  causeOfLowSurvival: multiselectWithOtherValidationNoMinimum,
  monitoringIndicators: rows({
    mainLabel: text,
    secondaryLabel: text,
    // The form writes `indicator`; older answers may hold the misspelt `indictor`.
    indicator: text,
    indictor: text,
    metric: text,
    measurement: numberAnswer,
    unit: text,
    comparison: text,
    measurementComparison: numberAnswer,
    linkedAims
  }),
  achievementOfEcologicalAims: text
} satisfies SectionShape<'ecologicalStatusAndOutcomes'>

export const refine: SectionRefine = (values, ctx) => {
  requireDate(ctx, values, 'monitoringStartDate', language.form.required)
  if (isBefore(values.monitoringEndDate, values.monitoringStartDate)) {
    addIssue(ctx, ['monitoringEndDate'], endBeforeStartMessage)
  }

  for (const key of ['measurement', 'measurementComparison']) {
    checkRows(ctx, values, 'monitoringIndicators', (row) => row[key], measurementRule, 'indicator')
  }
}

export const defaultValues = {
  ecologicalMonitoringStakeholders: [],
  causeOfLowSurvival: { selectedValues: [] },
  preAndPostRestorationActivities: {}
}
