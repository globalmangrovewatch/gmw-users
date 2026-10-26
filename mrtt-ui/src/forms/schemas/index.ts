import { z } from 'zod'

import * as causesOfDecline from './causesOfDecline'
import * as costs from './costs'
import * as ecologicalStatusAndOutcomes from './ecologicalStatusAndOutcomes'
import * as managementStatusAndEffectiveness from './managementStatusAndEffectiveness'
import * as preRestorationAssessment from './preRestorationAssessment'
import * as projectDetails from './projectDetails'
import * as restorationAims from './restorationAims'
import * as siteBackground from './siteBackground'
import * as siteInterventions from './siteInterventions'
import * as socioeconomicGovernanceStatusAndOutcomes from './socioeconomicGovernanceStatusAndOutcomes'

const sectionRefines = [
  projectDetails.refine,
  causesOfDecline.refine,
  preRestorationAssessment.refine,
  siteInterventions.refine,
  ecologicalStatusAndOutcomes.refine
]

// One schema for the whole registration form, as the form validates all fields at once and
// saving a section only reads its own fields' errors. The cross-field rules run even when
// other fields are invalid (`when`), because those usually belong to sections not yet filled in.
export const registrationSchema = z
  .object({
    ...projectDetails.shape,
    ...siteBackground.shape,
    ...restorationAims.shape,
    ...causesOfDecline.shape,
    ...preRestorationAssessment.shape,
    ...siteInterventions.shape,
    ...costs.shape,
    ...managementStatusAndEffectiveness.shape,
    ...socioeconomicGovernanceStatusAndOutcomes.shape,
    ...ecologicalStatusAndOutcomes.shape
  })
  .superRefine(
    (values, ctx) => {
      sectionRefines.forEach((refine) => refine(values as Record<string, unknown>, ctx))
    },
    { when: () => true }
  )

export type RegistrationFormValues = z.input<typeof registrationSchema>

export const defaultValues = {
  ...projectDetails.defaultValues,
  ...siteBackground.defaultValues,
  ...restorationAims.defaultValues,
  ...preRestorationAssessment.defaultValues,
  ...siteInterventions.defaultValues,
  ...costs.defaultValues,
  ...managementStatusAndEffectiveness.defaultValues,
  ...socioeconomicGovernanceStatusAndOutcomes.defaultValues,
  ...ecologicalStatusAndOutcomes.defaultValues
} satisfies Partial<RegistrationFormValues>
