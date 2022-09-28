import language from '../language'

const { formName: formNames } = language.pages.siteQuestionsOverview

const MONITORING_FORM_CONSTANTS = {
  ecologicalStatusAndOutcomes: {
    payloadType: 'ecologicalStatusAndOutcomes',
    label: formNames.ecologicalStatusOutcomes,
    urlSegment: 'ecological-status-and-outcomes'
  },
  managementStatusAndEffectiveness: {
    payloadType: 'managementStatusAndEffectiveness',
    label: formNames.managementStatusAndEffectiveness,
    urlSegment: 'management-status-and-effectiveness'
  },
  socioeconomicGovernanceStatusAndOutcomes: {
    payloadType: 'socioeconomicGovernanceStatusAndOutcomes',
    label: formNames.socioeconomicGovernanceStatusOutcomes,
    urlSegment: 'socioeconomic-and-governance-status'
  }
}

Object.freeze(MONITORING_FORM_CONSTANTS)

export default MONITORING_FORM_CONSTANTS
