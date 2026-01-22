import {
  projectDetails,
  siteBackground,
  restorationAims,
  causesOfDecline,
  preRestorationAssessment,
  siteInterventions,
  costs,
  managementStatusAndEffectiveness,
  socioeconomicGovernanceStatusOutcomes,
  ecologicalStatusOutcomes
} from '../../data/questions'

import { questionMapping } from '../../data/questionMapping'

export const sectionsRegistry = {
  projectDetails: {
    mapping: questionMapping.projectDetails,
    questions: projectDetails
  },
  siteBackground: {
    mapping: questionMapping.siteBackground,
    questions: siteBackground
  },
  restorationAims: {
    mapping: questionMapping.restorationAims,
    questions: restorationAims
  },
  causesOfDecline: {
    mapping: questionMapping.causesOfDecline,
    questions: causesOfDecline
  },
  preRestorationAssessment: {
    mapping: questionMapping.preRestorationAssessment,
    questions: preRestorationAssessment
  },
  siteInterventions: {
    mapping: questionMapping.siteInterventions,
    questions: siteInterventions
  },
  costs: {
    mapping: questionMapping.costs,
    questions: costs
  },
  managementStatusAndEffectiveness: {
    mapping: questionMapping.managementStatusAndEffectiveness,
    questions: managementStatusAndEffectiveness
  },
  socioeconomicGovernanceStatusOutcomes: {
    mapping: questionMapping.socioeconomicAndGovernanceStatusAndOutcomes,
    questions: socioeconomicGovernanceStatusOutcomes
  },
  ecologicalStatusOutcomes: {
    mapping: questionMapping.ecologicalStatusAndOutcomes,
    questions: ecologicalStatusOutcomes
  }
} as const

export type SectionKey = keyof typeof sectionsRegistry
