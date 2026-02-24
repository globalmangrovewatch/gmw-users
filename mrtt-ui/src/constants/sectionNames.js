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

export const SECTION_NAMES_DICTIONARY_INTERVENTIONS = {
  'project-details': 'projectDetails',
  'site-background': 'siteBackground',
  'restoration-aims': 'restorationAims',
  'causes-of-decline': 'causesOfDecline',
  'pre-restoration-assessment': 'preRestorationAssessment',
  'site-interventions': 'siteInterventions',
  costs: 'costs'
}

export const FORM_NAMES_DICTIONARY_INTERVENTIONS = {
  projectDetails: 'Site Details and Location',
  siteBackground: 'Site Background',
  restorationAims: 'Restoration Aims',
  causesOfDecline: 'Causes of Decline',
  preRestorationAssessment: 'Pre-Restoration Assessment',
  siteInterventions: 'Site Interventions',
  costs: 'Costs'
}

export const SECTION_NAMES_DICTIONARY_MONITORS = {
  'management-status-and-effectiveness': 'managementStatusAndEffectiveness',
  'socioeconomic-and-governance-status': 'socioeconomicAndGovernanceStatusAndOutcomes',
  'ecological-status-and-outcomes': 'ecologicalStatusAndOutcomes'
}

export const FORM_NAMES_DICTIONARY_MONITORS = {
  managementStatusAndEffectiveness: 'Management Status and Effectiveness',
  socioeconomicAndGovernanceStatusAndOutcomes: 'Socioeconomic and Governance Status and Outcomes',
  ecologicalStatusAndOutcomes: 'Ecological Status and Outcomes'
}

export const SECTION_REGISTRY = {
  'project-details': {
    target: 'interventions',
    id: 'projectDetails',
    label: 'Site Details and Location'
  },
  'site-background': {
    target: 'interventions',
    id: 'siteBackground',
    label: 'Site Background'
  },
  'restoration-aims': {
    target: 'interventions',
    id: 'restorationAims',
    label: 'Restoration Aims'
  },
  'causes-of-decline': {
    target: 'interventions',
    id: 'causesOfDecline',
    label: 'Causes of Decline'
  },
  'pre-restoration-assessment': {
    target: 'interventions',
    id: 'preRestorationAssessment',
    label: 'Pre-Restoration Assessment'
  },
  'site-interventions': {
    target: 'interventions',
    id: 'siteInterventions',
    label: 'Site Interventions'
  },
  costs: {
    target: 'interventions',
    id: 'costs',
    label: 'Costs'
  },

  'management-status-and-effectiveness': {
    target: 'monitors',
    id: 'managementStatusAndEffectiveness',
    label: 'Management Status and Effectiveness'
  },
  'socioeconomic-and-governance-status': {
    target: 'monitors',
    id: 'socioeconomicAndGovernanceStatusAndOutcomes',
    label: 'Socioeconomic and Governance Status and Outcomes'
  },
  'ecological-status-and-outcomes': {
    target: 'monitors',
    id: 'ecologicalStatusAndOutcomes',
    label: 'Ecological Status and Outcomes'
  }
}

Object.freeze(SECTION_NAMES)
export default SECTION_NAMES
