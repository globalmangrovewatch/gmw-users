// API section ids are generated from the order of this array.
// Please make sure the order matches that.
const SECTION_NAMES = [
  'project-details',
  'site-background',
  'restoration-aims',
  'causes-of-decline',
  'pre-restoration-assessment',
  'site-interventions',
  'costs',
  'management-status-and-effectiveness',
  'socioeconomic-and-governance-status',
  'ecological-status-and-outcomes'
]

export const SECTION_NAMES_DICTIONARY = {
  'project-details': 'projectDetails',
  'site-background': 'siteBackground',
  'restoration-aims': 'restorationAims',
  'causes-of-decline': 'causesOfDecline',
  'pre-restoration-assessment': 'preRestorationAssessment',
  'site-interventions': 'siteInterventions',
  costs: 'costs',
  'management-status-and-effectiveness': 'managementStatusAndEffectiveness',
  'socioeconomic-and-governance-status': 'socioeconomicAndGovernanceStatusAndOutcomes',
  'ecological-status-and-outcomes': 'ecologicalStatusAndOutcomes'
}

export const FORM_NAMES_DICTIONARY = {
  projectDetails: 'Site Details and Location',
  siteBackground: 'Site Background',
  restorationAims: 'Restoration Aims',
  causesOfDecline: 'Causes of Decline',
  preRestorationAssessment: 'Pre-Restoration Assessment',
  siteInterventions: 'Site Interventions',
  costs: 'Costs',
  managementStatusAndEffectiveness: 'Management Status and Effectiveness',
  socioeconomicAndGovernanceStatusAndOutcomes: 'Socioeconomic and Governance Status and Outcomes',
  ecologicalStatusAndOutcomes: 'Ecological Status and Outcomes'
}

Object.freeze(SECTION_NAMES)
export default SECTION_NAMES
