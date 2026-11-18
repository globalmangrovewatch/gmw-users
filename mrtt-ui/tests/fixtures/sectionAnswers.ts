// One valid answer payload per form section, keyed like `questionMapping`.
// Values match what the forms hold in memory: ISO date strings, multiselect objects,
// row arrays. They avoid the values the API mapping rewrites on the way back
// ('true'/'false' strings, empty strings, null), which have their own tests.

const squareFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [100, 1],
            [101, 1],
            [101, 2],
            [100, 2],
            [100, 1]
          ]
        ]
      }
    }
  ]
}

const angola = {
  bbox: ['11.66847324', '-18.04208183', '24.08211708', '-4.372591019'],
  geometry: { coordinates: [17.549158, -12.297964], type: 'Point' },
  properties: { country: 'Angola', mangroves: '1' },
  type: 'Feature'
}

export const sectionAnswers = {
  projectDetails: {
    projectStartDate: '2020-01-15T00:00:00.000Z',
    hasProjectEndDate: true,
    projectEndDate: '2023-06-30T00:00:00.000Z',
    countries: [angola],
    siteArea: squareFeatureCollection
  },
  siteBackground: {
    stakeholders: [{ stakeholderType: 'Government', stakeholderName: 'Ministry of Environment' }],
    managementStatus: 'Formally managed',
    lawStatus: 'Yes',
    managementArea: 'Marine protected area',
    protectionStatus: {
      selectedValues: ['National park'],
      otherValue: undefined,
      isOtherChecked: false
    },
    areStakeholdersInvolved: 'Yes',
    governmentArrangement: {
      selectedValues: ['Community-based management'],
      otherValue: undefined,
      isOtherChecked: false
    },
    landTenure: { selectedValues: ['Public'], otherValue: undefined, isOtherChecked: false },
    customaryRights: 'Yes'
  },
  restorationAims: {
    ecologicalAims: {
      selectedValues: ['Increase mangrove cover'],
      otherValue: undefined,
      isOtherChecked: false
    },
    socioEconomicAims: {
      selectedValues: ['Improve fisheries'],
      otherValue: undefined,
      isOtherChecked: false
    },
    otherAims: { selectedValues: [], otherValue: 'Raise awareness', isOtherChecked: true }
  },
  causesOfDecline: {
    lossKnown: 'Yes',
    causesOfDecline: [
      {
        mainCauseLabel: 'Aquaculture',
        mainCauseAnswers: [{ mainCauseAnswer: 'Shrimp ponds', levelOfDegradation: 'Complete' }],
        subCauses: []
      }
    ]
  },
  preRestorationAssessment: {
    mangrovesPreviouslyOccured: 'Yes',
    mangroveRestorationAttempted: 'Yes',
    lastRestorationAttemptYear: 2015,
    previousBiophysicalInterventions: {
      selectedValues: ['Planting'],
      otherValue: undefined,
      isOtherChecked: false
    },
    whyUnsuccessfulRestorationAttempt: {
      selectedValues: ['Wrong species'],
      otherValue: undefined,
      isOtherChecked: false
    },
    siteAssessmentBeforeProject: 'Yes',
    siteAssessmentType: {
      selectedValues: ['Hydrology'],
      otherValue: undefined,
      isOtherChecked: false
    },
    referenceSite: 'Yes',
    lostMangrovesYear: 1990,
    naturalRegenerationAtSite: 'No',
    mangroveSpeciesPresent: ['Rhizophora mangle', 'Avicennia germinans'],
    speciesComposition: [{ mangroveSpeciesType: 'Rhizophora mangle', percentageComposition: 60 }],
    physicalMeasurementsTaken: [{ measurementType: 'Salinity', measurementValue: '30' }],
    pilotTestConducted: 'No',
    guidanceForSiteRestoration: 'Yes'
  },
  siteInterventions: {
    whichStakeholdersInvolved: [
      { stakeholder: 'Ministry of Environment', stakeholderType: 'Government' }
    ],
    biophysicalInterventionsUsed: {
      selectedValues: ['Planting'],
      otherValue: undefined,
      isOtherChecked: false
    },
    biophysicalInterventionDuration: {
      startDate: '2021-01-01T00:00:00.000Z',
      endDate: '2021-12-31T00:00:00.000Z'
    },
    mangroveSpeciesUsed: [
      {
        type: 'Rhizophora mangle',
        seed: { checked: false, source: [], count: undefined },
        propagule: { checked: true, source: ['Local nursery'], count: 500 }
      }
    ],
    mangroveAssociatedSpecies: [
      {
        type: 'Nypa fruticans',
        count: 20,
        source: 'Local',
        purpose: { purpose: 'Food', other: '' }
      }
    ],
    localParticipantTraining: 'Yes',
    organizationsProvidingTraining: {
      selectedValues: ['NGO'],
      otherValue: undefined,
      isOtherChecked: false
    },
    otherActivitiesImplemented: {
      selectedValues: ['Beekeeping'],
      otherValue: undefined,
      isOtherChecked: false
    }
  },
  costs: {
    supportForActivities: {
      selectedValues: ['Government funding'],
      otherValue: undefined,
      isOtherChecked: false
    },
    projectInterventionFunding: { fundingType: 'Grant', other: '' },
    projectFunderNames: [{ funderName: 'Blue Fund', funderType: 'Private', percentage: 100 }],
    costOfProjectActivities: { cost: 25000, currency: 'USD' },
    breakdownOfCost: [{ costType: 'Labour', cost: 15000, currency: 'USD' }],
    percentageSplitOfActivities: [{ intervention: 'Planting', percentage: 100 }],
    nonmonetisedContributions: {
      selectedValues: ['Volunteer labour'],
      otherValue: undefined,
      isOtherChecked: false
    }
  },
  managementStatusAndEffectiveness: {
    dateOfAssessment: '2024-03-01T00:00:00.000Z',
    stakeholderManagement: {
      selectedValues: ['Co-management'],
      otherValue: undefined,
      isOtherChecked: false
    },
    stakeholderInfluence: 'High',
    managementStatusChanges: 'Yes',
    currentManagementStatus: 'Formally managed',
    managementLaws: 'Yes',
    nameOfFormalManagementArea: 'Kissama National Park',
    projectStatusChange: 'No',
    currentProtectionStatus: 'Protected',
    financeForCiteManagement: 'Yes',
    sufficientFunds: 'No',
    resourcesToEnforceRegulations: 'Partially',
    equitableSharingOfSiteBenefits: 'Yes',
    climateChangeAdaptation: 'Yes'
  },
  socioeconomicGovernanceStatusAndOutcomes: {
    dateOfOutcomesAssessment: '2024-03-01T00:00:00.000Z',
    changeInGovernance: 'No',
    currentGovenance: { selectedValues: ['Community-based management'], isOtherChecked: false },
    changeInTenureArrangement: 'No',
    currentLandOwnership: { selectedValues: ['Public'], isOtherChecked: false },
    rightsToLandInLaw: 'Yes',
    socioeconomicOutcomes: [
      {
        mainLabel: 'Livelihoods',
        secondaryLabel: 'Income',
        child: 'Fisheries income',
        type: 'Measured',
        trend: 'Increase',
        linkedAims: ['Improve fisheries'],
        measurement: '20',
        unit: '%',
        comparison: 'Baseline',
        value: 20
      }
    ],
    achievementOfSocioeconomicAims: 'Partially'
  },
  ecologicalStatusAndOutcomes: {
    dateOfEcologicalMonitoring: '2024-03-01T00:00:00.000Z',
    monitoringStartDate: '2023-01-01T00:00:00.000Z',
    monitoringEndDate: '2023-12-31T00:00:00.000Z',
    ecologicalMonitoringStakeholders: [
      { stakeholder: 'Ministry of Environment', stakeholderType: 'Government' }
    ],
    mangroveAreaIncrease: 'Yes',
    mangroveAreaBeforeAfter: { before: 10, after: 15, unit: 'ha' },
    mangroveConditionImprovement: 'Yes',
    preAndPostRestorationActivities: {
      areaPreIntervention: '10',
      unitPre: 'ha',
      areaPostIntervention: '15',
      unitPost: 'ha'
    },
    naturalRegenerationOnSite: 'Yes',
    percentageSurvival: 80,
    causeOfLowSurvival: { selectedValues: ['Grazing'], isOtherChecked: false },
    monitoringIndicators: [
      {
        mainLabel: 'Mangrove cover',
        secondaryLabel: 'Area',
        indictor: 'Canopy cover',
        metric: 'Percentage',
        measurement: 70,
        unit: '%',
        comparison: 'Baseline',
        measurementComparison: 50,
        linkedAims: ['Increase mangrove cover']
      }
    ],
    achievementOfEcologicalAims: 'Yes'
  }
}

export type SectionKey = keyof typeof sectionAnswers

export const registrationSections = [
  'projectDetails',
  'siteBackground',
  'restorationAims',
  'causesOfDecline',
  'preRestorationAssessment',
  'siteInterventions',
  'costs'
] as const satisfies readonly SectionKey[]

export const monitoringSections = [
  'managementStatusAndEffectiveness',
  'socioeconomicGovernanceStatusAndOutcomes',
  'ecologicalStatusAndOutcomes'
] as const satisfies readonly SectionKey[]
