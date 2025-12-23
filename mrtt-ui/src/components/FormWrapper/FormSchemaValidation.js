import * as yup from 'yup'

import emptyFeatureCollection from '../../data/emptyFeatureCollection'

import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '../../validation/multiSelectWithOther'

import language from '../../language'

const siteAreaError = 'Please provide a site area'

export const validationSchema = yup.object().shape({
  // project details
  projectStartDate: yup.date().required('Select a start date'),
  hasProjectEndDate: yup.boolean(),
  projectEndDate: yup
    .date()
    .nullable()
    .when('hasProjectEndDate', {
      is: true,
      then: (schema) =>
        schema
          .min(yup.ref('projectStartDate'), "End date can't be before start date")
          .required('Please select an end date'),
      otherwise: (schema) => schema.notRequired().nullable()
    }),
  countries: yup
    .array()
    .of(
      yup.object().shape({
        bbox: yup.array().of(yup.number()),
        geometry: yup.object().shape({
          coordinates: yup.array().of(yup.number()),
          type: yup.string()
        }),
        properties: yup.object().shape({
          country: yup.string(),
          mangroves: yup.string()
        })
      })
    )
    .min(1)
    .typeError('Select at least one country'),
  siteArea: yup
    .object()
    .shape({
      features: yup.array().min(1, siteAreaError).required(siteAreaError)
    })
    .required(siteAreaError),

  // site background
  stakeholders: yup
    .array()
    .of(
      yup.object().shape({
        stakeholderType: yup.string(),
        stackholderName: yup.string()
      })
    )
    .min(1)
    .required('Select at least one stakeholder'),
  managementStatus: yup.string(),
  lawStatus: yup.string(),
  managementArea: yup.string(),
  protectionStatus: multiselectWithOtherValidationNoMinimum,
  areStakeholdersInvolved: yup.string().nullable(),
  governmentArrangement: multiselectWithOtherValidationNoMinimum,
  landTenure: multiselectWithOtherValidationNoMinimum,
  customaryRights: yup.string(),
  // restoration aims
  ecologicalAims: multiselectWithOtherValidation,
  socioEconomicAims: multiselectWithOtherValidation,
  otherAims: multiselectWithOtherValidationNoMinimum,

  // causes of decline
  lossKnown: yup.string(),
  causesOfDecline: yup
    .array()
    .of(
      yup.object().shape({
        mainCauseLabel: yup.string(),
        mainCauseAnswers: yup.array().of(
          yup.object().shape({
            mainCauseAnswer: yup.string(),
            levelOfDegredation: yup.string().required()
          })
        ),
        subCauses: yup.array().of(
          yup.object().shape({
            subCauseLabel: yup.string(),
            subCauseAnswers: yup.array().of(
              yup.object().shape({
                subCauseAnswer: yup.string(),
                levelOfDegredation: yup.string().required()
              })
            )
          })
        )
      })
    )
    .default([]),
  // pre restoration assessment
  mangrovesPreviouslyOccured: yup.string(),
  mangroveRestorationAttempted: yup.string(),
  lastRestorationAttemptYear: yup.mixed().when('mangroveRestorationAttempted', {
    is: (val) => val && val === 'Yes',
    then: yup
      .number()
      .typeError(language.form.error.noYearProvided)
      .min(1900, language.form.error.yearTooLow)
      .max(new Date().getFullYear(), language.form.error.yearTooHigh)
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null))
  }),
  previousBiophysicalInterventions: multiselectWithOtherValidationNoMinimum,
  whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidationNoMinimum,
  siteAssessmentBeforeProject: yup.string(),
  siteAssessmentType: multiselectWithOtherValidationNoMinimum,
  referenceSite: yup.string(),
  lostMangrovesYear: yup.mixed().when('siteAssessmentBeforeProject', {
    is: (val) => val && val === 'Yes',
    then: yup
      .number()
      .typeError(language.form.error.noYearProvided)
      .min(1900, language.form.error.yearTooLow)
      .max(new Date().getFullYear(), language.form.error.yearTooHigh)
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null))
  }),
  naturalRegenerationAtSite: yup.string(),
  mangroveSpeciesPresent: yup.array().of(yup.string()).default([]).nullable(),
  speciesComposition: yup
    .array()
    .of(
      yup.object().shape({
        mangroveSpeciesType: yup.mixed(),
        percentageComposition: yup.number().typeError('Please enter a number')
      })
    )
    .default([]),
  physicalMeasurementsTaken: yup
    .array()
    .of(
      yup.object().shape({
        measurementType: yup.string(),
        measurementValue: yup.mixed()
      })
    )
    .default([]),
  pilotTestConducted: yup.string(),
  guidanceForSiteRestoration: yup.string(),

  // site interventions
  whichStakeholdersInvolved: yup
    .array()
    .of(
      yup.object().shape({
        stakeholder: yup.string(),
        stakeholderType: yup.string()
      })
    )
    .default([]),
  biophysicalInterventionsUsed: multiselectWithOtherValidation,
  biophysicalInterventionDuration: yup.object().shape({
    startDate: yup.string().nullable(),
    endDate: yup
      .string()
      .nullable()
      .min(yup.ref('startDate'), "End date can't be before start date")
  }),
  mangroveSpeciesUsed: yup
    .array()
    .of(
      yup.object().shape({
        type: yup.string(),
        seed: yup.object().shape({
          checked: yup.bool(),
          source: yup.array().of(yup.string()),
          count: yup.mixed()
        }),
        propagule: yup.object().shape({
          checked: yup.bool(),
          source: yup.array().of(yup.string()),
          count: yup.mixed()
        })
      })
    )
    .default([]),
  mangroveAssociatedSpecies: yup
    .array()
    .of(
      yup.object().shape({
        type: yup.string(),
        count: yup.mixed(),
        source: yup.string(),
        purpose: yup.object().shape({ purpose: yup.string(), other: yup.string() })
      })
    )
    .default([]),
  localParticipantTraining: yup.string(),
  organizationsProvidingTraining: multiselectWithOtherValidationNoMinimum,
  otherActivitiesImplemented: multiselectWithOtherValidation,

  // costs
  supportForActivities: multiselectWithOtherValidationNoMinimum,
  projectInterventionFunding: yup.object().shape({
    fundingType: yup.string(),
    other: yup.string()
  }),
  projectFunderNames: yup
    .array()
    .of(
      yup.object().shape({
        funderName: yup.string(),
        funderType: yup.string(),
        percentage: yup.mixed()
      })
    )
    .default([]),
  breakdownOfCost: yup
    .array()
    .of(
      yup.object().shape({
        costType: yup.string(),
        cost: yup.mixed(),
        currency: yup.string()
      })
    )
    .default([]),
  costOfProjectActivities: yup.object().shape({
    cost: yup.mixed(),
    currency: yup.string()
  }),
  percentageSplitOfActivities: yup
    .array()
    .of(
      yup.object().shape({
        intervention: yup.string(),
        percentage: yup.mixed().nullable()
      })
    )
    .default([]),
  nonmonetisedContributions: multiselectWithOtherValidationNoMinimum,

  // management status and effectiveness
  dateOfAssessment: yup.string().required(language.form.required),
  stakeholderManagement: multiselectWithOtherValidationNoMinimum,
  stakeholderInfluence: yup.string(),
  managementStatusChanges: yup.string(),
  currentManagementStatus: yup.string().nullable(),
  managementLaws: yup.string().nullable(),
  nameOfFormalManagementArea: yup.string().nullable(),
  projectStatusChange: yup.string(),
  currentProtectionStatus: yup.string().nullable(),
  financeForCiteManagement: yup.string(),
  sufficientFunds: yup.string(),
  resourcesToEnforceRegulations: yup.string(),
  equitableSharingOfSiteBenefits: yup.string(),
  climateChangeAdaptation: yup.string(),

  // Socioeconomic and Governance Status and Outcomes
  dateOfOutcomesAssessment: yup.string().nullable().required(language.form.required),
  changeInGovernance: yup.string(),
  currentGovenance: multiselectWithOtherValidationNoMinimum,
  changeInTenureArrangement: yup.string(),
  currentLandOwnership: multiselectWithOtherValidationNoMinimum,
  rightsToLandInLaw: yup.string().default(''),
  socioeconomicOutcomes: yup
    .array()
    .of(
      yup.object().shape({
        mainLabel: yup.string(),
        secondaryLabel: yup.string(),
        child: yup.string(),
        type: yup.string(),
        trend: yup.string(),
        linkedAims: yup.array().of(yup.string()).default([]),
        measurement: yup.string(),
        unit: yup.string(),
        comparison: yup.string(),
        value: yup.mixed()
      })
    )
    .default([]),
  achievementOfSocioeconomicAims: yup.string(),

  // Ecological Status and Outcomes
  monitoringStartDate: yup.date().nullable().required(language.form.required),
  monitoringEndDate: yup
    .date()
    .nullable()
    .min(yup.ref('monitoringStartDate'), "End date can't be before start date"),
  ecologicalMonitoringStakeholders: yup
    .array()
    .of(
      yup.object().shape({
        stakeholder: yup.string(),
        stakeholderType: yup.string()
      })
    )
    .default([]),
  preAndPostRestorationActivities: yup.object().shape({
    areaPreIntervention: yup.string(),
    unitPre: yup.string(),
    unitPreOther: yup.string(),
    areaPostIntervention: yup.string(),
    unitPost: yup.string(),
    unitPostOther: yup.string()
  }),
  mangroveAreaIncrease: yup.string(),
  mangroveConditionImprovement: yup.string(),
  naturalRegenerationOnSite: yup.string(),
  percentageSurvival: yup.mixed(),
  causeOfLowSurvival: multiselectWithOtherValidationNoMinimum,
  monitoringIndicators: yup
    .array()
    .of(
      yup.object().shape({
        mainLabel: yup.string(),
        secondaryLabel: yup.string(),
        indictor: yup.string(),
        metric: yup.string(),
        measurement: yup.mixed(),
        unit: yup.string(),
        comparison: yup.string(),
        measurementComparison: yup.mixed(),
        linkedAims: yup.array().of(yup.string()).default([])
      })
    )
    .default([]),
  achievementOfEcologicalAims: yup.string()
})

export const defaultValues = {
  // project details - Site Details and Location
  projectStartDate: null,
  hasProjectEndDate: false,
  projectEndDate: null,
  countries: undefined,
  siteArea: emptyFeatureCollection,

  // site background - Site Background
  protectionStatus: { selectedValues: [], otherValue: undefined },
  landTenure: { selectedValues: [], otherValue: undefined },

  // restoration aims - Restoration Aims
  ecologicalAims: { selectedValues: [], otherValue: undefined },
  socioEconomicAims: { selectedValues: [], otherValue: undefined },
  otherAims: { selectedValues: [], otherValue: undefined },

  // pre restoration assessment
  previousBiophysicalInterventions: { selectedValues: [], otherValue: undefined },
  whyUnsuccessfulRestorationAttempt: { selectedValues: [], otherValue: undefined },

  // site interventions
  organizationsProvidingTraining: { selectedValues: [], otherValue: undefined },
  otherActivitiesImplemented: { selectedValues: [], otherValue: undefined },

  // costs
  supportForActivities: { selectedValues: [], otherValue: undefined },
  nonmonetisedContributions: { selectedValues: [], otherValue: undefined },

  // management status and effectiveness
  stakeholderManagement: { selectedValues: [], otherValue: undefined },

  // Socioeconomic and Governance Status and Outcomes
  currentGovenance: { selectedValues: [] },
  currentLandOwnership: { selectedValues: [] },

  // Ecological Status and Outcomes
  ecologicalMonitoringStakeholders: [],
  causeOfLowSurvival: { selectedValues: [] },
  preAndPostRestorationActivities: {}
}
