// Validation behaviour of the form schema, as data. Each case validates `values` the way
// the forms do (whole form, then read the errors of the fields being saved) and lists the
// expected error message per field, or `null` for no error.
//
// Kept free of yup so the same table can run against a replacement schema.

import { questionMapping } from '@/data/questionMapping'
import language from '@/language'
import { sectionAnswers, type SectionKey } from './sectionAnswers'

export type ValidationCase = {
  name: string
  values: Record<string, unknown>
  expected: Record<string, string | null>
}

const thisYear = new Date().getFullYear()
const multiselectErrors = language.multiselectWithOtherFormQuestion.validation
const yearErrors = language.form.error
const numberErrors = language.form.error
const siteAreaError = 'Please provide a site area'

const noErrorsFor = (section: SectionKey) =>
  Object.fromEntries(Object.keys(questionMapping[section]).map((field) => [field, null]))

const validSectionCases: ValidationCase[] = (Object.keys(sectionAnswers) as SectionKey[]).map(
  (section) => ({
    name: `valid ${section} payload`,
    values: sectionAnswers[section],
    expected: noErrorsFor(section)
  })
)

const projectDetails = sectionAnswers.projectDetails

const projectDateCases: ValidationCase[] = [
  {
    name: 'end date before start date',
    values: { ...projectDetails, projectEndDate: '2019-01-01T00:00:00.000Z' },
    expected: { projectEndDate: "End date can't be before start date" }
  },
  {
    name: 'end date required when hasProjectEndDate is true',
    values: { ...projectDetails, projectEndDate: null },
    expected: { projectEndDate: 'Please select an end date' }
  },
  {
    name: 'end date optional when hasProjectEndDate is false',
    values: { ...projectDetails, hasProjectEndDate: false, projectEndDate: null },
    expected: { projectEndDate: null }
  },
  {
    name: 'end date before start date is ignored when hasProjectEndDate is false',
    values: {
      ...projectDetails,
      hasProjectEndDate: false,
      projectEndDate: '2019-01-01T00:00:00.000Z'
    },
    expected: { projectEndDate: null }
  },
  {
    name: 'start date required',
    values: { ...projectDetails, projectStartDate: undefined },
    expected: { projectStartDate: 'Select a start date' }
  },
  {
    name: 'intervention end date before start date',
    values: {
      biophysicalInterventionDuration: {
        startDate: '2021-06-01T00:00:00.000Z',
        endDate: '2021-01-01T00:00:00.000Z'
      }
    },
    expected: { biophysicalInterventionDuration: "End date can't be before start date" }
  },
  {
    name: 'intervention dates may both be empty',
    values: { biophysicalInterventionDuration: { startDate: '', endDate: '' } },
    expected: { biophysicalInterventionDuration: null }
  },
  {
    name: 'monitoring end date before start date',
    values: {
      monitoringStartDate: '2023-06-01T00:00:00.000Z',
      monitoringEndDate: '2023-01-01T00:00:00.000Z'
    },
    expected: { monitoringEndDate: "End date can't be before start date" }
  },
  {
    name: 'monitoring start date required',
    values: { monitoringStartDate: null },
    expected: { monitoringStartDate: language.form.required }
  }
]

const yearCases: ValidationCase[] = [
  {
    name: 'restoration year below 1900',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: 1899 },
    expected: { lastRestorationAttemptYear: yearErrors.yearTooLow }
  },
  {
    name: 'restoration year after the current year',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: thisYear + 1 },
    expected: { lastRestorationAttemptYear: yearErrors.yearTooHigh }
  },
  {
    name: 'restoration year at the bounds',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: 1900 },
    expected: { lastRestorationAttemptYear: null }
  },
  {
    name: 'restoration year empty',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: '' },
    expected: { lastRestorationAttemptYear: null }
  },
  {
    name: 'restoration year that is not a number',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: 'abc' },
    expected: { lastRestorationAttemptYear: yearErrors.noYearProvided }
  },
  {
    // The year input is a text field, so typed years arrive as strings.
    name: 'restoration year as a numeric string',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: '1850' },
    expected: { lastRestorationAttemptYear: yearErrors.yearTooLow }
  },
  {
    name: 'restoration year as a valid numeric string',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: '2015' },
    expected: { lastRestorationAttemptYear: null }
  },
  {
    name: 'restoration year that is not a whole number',
    values: { mangroveRestorationAttempted: 'Yes', lastRestorationAttemptYear: '2015.5' },
    expected: { lastRestorationAttemptYear: yearErrors.wholeNumber }
  },
  {
    name: 'restoration year not checked when no restoration was attempted',
    values: { mangroveRestorationAttempted: 'No', lastRestorationAttemptYear: 1800 },
    expected: { lastRestorationAttemptYear: null }
  },
  {
    name: 'lost mangroves year below 1900',
    values: { siteAssessmentBeforeProject: 'Yes', lostMangrovesYear: 1899 },
    expected: { lostMangrovesYear: yearErrors.yearTooLow }
  },
  {
    name: 'lost mangroves year after the current year',
    values: { siteAssessmentBeforeProject: 'Yes', lostMangrovesYear: thisYear + 1 },
    expected: { lostMangrovesYear: yearErrors.yearTooHigh }
  },
  {
    name: 'lost mangroves year not checked without a site assessment',
    values: { siteAssessmentBeforeProject: 'No', lostMangrovesYear: 1800 },
    expected: { lostMangrovesYear: null }
  }
]

// ecologicalAims requires at least one item; otherAims (the "no minimum" variant) does not.
const multiselectCases: ValidationCase[] = [
  {
    name: 'multiselect: nothing selected, other unchecked',
    values: {
      ecologicalAims: { selectedValues: [], isOtherChecked: false },
      otherAims: { selectedValues: [], isOtherChecked: false }
    },
    expected: { ecologicalAims: multiselectErrors.selectAtleastOneItem, otherAims: null }
  },
  {
    name: 'multiselect: one item selected, other unchecked',
    values: {
      ecologicalAims: { selectedValues: ['a'], isOtherChecked: false },
      otherAims: { selectedValues: ['a'], isOtherChecked: false }
    },
    expected: { ecologicalAims: null, otherAims: null }
  },
  {
    name: 'multiselect: isOtherChecked missing behaves as unchecked',
    values: {
      ecologicalAims: { selectedValues: [] },
      otherAims: { selectedValues: [] }
    },
    expected: { ecologicalAims: multiselectErrors.selectAtleastOneItem, otherAims: null }
  },
  {
    name: 'multiselect: other checked with an empty other value',
    values: {
      ecologicalAims: { selectedValues: ['a'], isOtherChecked: true, otherValue: '' },
      otherAims: { selectedValues: [], isOtherChecked: true, otherValue: '' }
    },
    expected: {
      ecologicalAims: multiselectErrors.clairfyOther,
      otherAims: multiselectErrors.clairfyOther
    }
  },
  {
    name: 'multiselect: other checked with no other value',
    values: {
      ecologicalAims: { selectedValues: [], isOtherChecked: true },
      otherAims: { selectedValues: [], isOtherChecked: true }
    },
    expected: {
      ecologicalAims: multiselectErrors.clairfyOther,
      otherAims: multiselectErrors.clairfyOther
    }
  },
  {
    name: 'multiselect: other checked and filled in, nothing else selected',
    values: {
      ecologicalAims: { selectedValues: [], isOtherChecked: true, otherValue: 'x' },
      otherAims: { selectedValues: [], isOtherChecked: true, otherValue: 'x' }
    },
    expected: { ecologicalAims: null, otherAims: null }
  },
  {
    name: 'multiselect: field missing altogether',
    values: {},
    expected: { ecologicalAims: multiselectErrors.selectAtleastOneItem, otherAims: null }
  }
]

const countryAndAreaCases: ValidationCase[] = [
  {
    name: 'countries: empty list',
    values: { ...projectDetails, countries: [] },
    expected: { countries: 'countries field must have at least 1 items' }
  },
  {
    name: 'countries: not answered',
    values: { ...projectDetails, countries: undefined },
    expected: { countries: null }
  },
  {
    name: 'countries: null',
    values: { ...projectDetails, countries: null },
    expected: { countries: 'Select at least one country' }
  },
  {
    name: 'site area: empty feature collection',
    values: { ...projectDetails, siteArea: { type: 'FeatureCollection', features: [] } },
    expected: { siteArea: siteAreaError }
  },
  {
    name: 'site area: not answered',
    values: { ...projectDetails, siteArea: undefined },
    expected: { siteArea: siteAreaError }
  }
]

const otherRequiredCases: ValidationCase[] = [
  {
    name: 'stakeholders: empty list',
    values: { stakeholders: [] },
    expected: { stakeholders: 'stakeholders field must have at least 1 items' }
  },
  {
    name: 'stakeholders: not answered',
    values: {},
    expected: { stakeholders: 'Select at least one stakeholder' }
  },
  {
    name: 'causes of decline: level of degradation required',
    values: {
      causesOfDecline: [
        { mainCauseLabel: 'Aquaculture', mainCauseAnswers: [{ mainCauseAnswer: 'Shrimp ponds' }] }
      ]
    },
    expected: {
      causesOfDecline:
        'causesOfDecline[0].mainCauseAnswers[0].levelOfDegradation is a required field'
    }
  },
  {
    name: 'management assessment date required',
    values: {},
    expected: { dateOfAssessment: language.form.required }
  },
  {
    name: 'socioeconomic assessment date required',
    values: { dateOfOutcomesAssessment: null },
    expected: { dateOfOutcomesAssessment: language.form.required }
  }
]

// Number answers are typed into text fields: strings or API numbers, and may be left empty.
// Errors in table rows are reported on the whole list, named by the row.
const numberCases: ValidationCase[] = [
  {
    name: 'survival percentage above 100',
    values: { percentageSurvival: '120' },
    expected: { percentageSurvival: numberErrors.percentage }
  },
  {
    name: 'survival percentage that is not a number',
    values: { percentageSurvival: 'most' },
    expected: { percentageSurvival: numberErrors.notANumber }
  },
  {
    name: 'survival percentage left empty',
    values: { percentageSurvival: '' },
    expected: { percentageSurvival: null }
  },
  {
    name: 'negative project cost',
    values: { costOfProjectActivities: { cost: '-5', currency: 'USD' } },
    expected: { costOfProjectActivities: numberErrors.notNegative }
  },
  {
    name: 'funder percentage above 100',
    values: { projectFunderNames: [{ funderName: 'Blue Fund', percentage: '150' }] },
    expected: { projectFunderNames: `Blue Fund: ${numberErrors.percentage}` }
  },
  {
    name: 'cost breakdown row that is not a number',
    values: { breakdownOfCost: [{ costType: 'Labour', cost: 'lots' }] },
    expected: { breakdownOfCost: `Labour: ${numberErrors.notANumber}` }
  },
  {
    name: 'split of activities row without a label',
    values: { percentageSplitOfActivities: [{ percentage: '-1' }] },
    expected: { percentageSplitOfActivities: `Row 1: ${numberErrors.percentage}` }
  },
  {
    name: 'seed count that is not a whole number',
    values: {
      mangroveSpeciesUsed: [{ type: 'Rhizophora mangle', seed: { checked: true, count: '2.5' } }]
    },
    expected: { mangroveSpeciesUsed: `Rhizophora mangle: ${numberErrors.wholeNumber}` }
  },
  {
    name: 'negative associated species count',
    values: { mangroveAssociatedSpecies: [{ type: 'Nypa fruticans', count: -3 }] },
    expected: { mangroveAssociatedSpecies: `Nypa fruticans: ${numberErrors.notNegative}` }
  },
  {
    name: 'physical measurement that is not a number',
    values: {
      physicalMeasurementsTaken: [{ measurementType: 'Salinity', measurementValue: 'high' }]
    },
    expected: { physicalMeasurementsTaken: `Salinity: ${numberErrors.notANumber}` }
  },
  {
    name: 'monitoring indicator measurement that is not a number',
    values: { monitoringIndicators: [{ indicator: 'Canopy cover', measurement: 'n/a' }] },
    expected: { monitoringIndicators: `Canopy cover: ${numberErrors.notANumber}` }
  },
  {
    name: 'socioeconomic outcome value that is not a number',
    values: { socioeconomicOutcomes: [{ child: 'Fisheries income', value: 'more' }] },
    expected: { socioeconomicOutcomes: `Fisheries income: ${numberErrors.notANumber}` }
  },
  {
    name: 'number answers left empty in rows',
    values: {
      breakdownOfCost: [{ costType: 'Labour', cost: '' }],
      percentageSplitOfActivities: [{ intervention: 'Planting' }]
    },
    expected: { breakdownOfCost: null, percentageSplitOfActivities: null }
  },
  {
    name: 'species composition above 100',
    values: {
      speciesComposition: [{ mangroveSpeciesType: 'Rhizophora mangle', percentageComposition: 101 }]
    },
    expected: { speciesComposition: numberErrors.percentage }
  }
]

export const validationCases: ValidationCase[] = [
  ...validSectionCases,
  ...projectDateCases,
  ...yearCases,
  ...multiselectCases,
  ...countryAndAreaCases,
  ...otherRequiredCases,
  ...numberCases
]
