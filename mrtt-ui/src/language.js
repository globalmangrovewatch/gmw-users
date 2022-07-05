const error = {
  submit: 'Submit failed. Please try again.',
  apiLoad: 'Loading data from the api failed. Please try again.',
  getItemDoesntExistMessage: (item) => `That ${item} doesnt exits.`
}
const success = { submit: 'The data has been saved.' }
const form = {
  checkboxGroupOtherInputPlaceholder: 'If other, please state.',
  checkboxGroupOtherLabel: 'Other',
  navigateBackToSiteOverview: 'Return to site form overview',
  selectLabel: 'Select'
}
const multiselectWithOtherFormQuestion = {
  validation: {
    selectAtleastOneItem: 'Please select at least one item.',
    clairfyOther: 'Please clarify other item.'
  }
}

const pages = {
  organizations: {
    newOrganizationButton: 'New Org',
    noOtherOrganizations: 'There are no other organizations',
    noYourOrganizations: 'You dont have any organizations',
    title: 'Organizations',
    titleOtherOrganizations: 'Other Organizations',
    titleYourOrganizations: 'Your Organizations'
  },
  sites: { title: 'Sites', newSiteButton: 'New Site' },
  landscapes: { title: 'Landscapes', newLandscapeButton: 'New Landscape' },
  siteform: {
    getEditSiteSuccessMessage: (siteName) => `${siteName} has been edited`,
    getNewSiteSuccessMessage: (siteName) => `${siteName}, has been created`,
    titleNewSite: 'Create a site',
    labelName: 'Name',
    labelLandscape: 'Landscape',
    validation: {
      nameRequired: 'Please enter a name',
      landscapeRequired: 'Please select a landscape'
    }
  },
  siteQuestionsOverview: {
    settings: 'Settings',

    formGroupTitle: {
      intervention: 'Intervention',
      monitoring: 'Monitoring',
      registration: 'Registration'
    },
    formName: {
      siteDetails: 'Site Details and Location',
      siteBackground: 'Site Background',
      restorationAims: 'Restoration Aims',
      causesOfDecline: 'Causes of Decline',
      preRestorationAssessment: 'Pre-Restoration Assessment',
      siteInterventions: 'Site Interventions',
      costs: 'Costs',
      managementStatus: 'Management Status and Effectiveness',
      socioeconomicGovernanceStatusOutcomes: 'Socioeconomic and Governance Status and Outcomes',
      ecologicalStatusOutcomes: 'Ecological Status and Outcomes'
    },
    addMonitoringSectionButton: 'Add Monitoring Section'
  }
}

const buttons = {
  cancel: 'Cancel',
  edit: 'Edit',
  submit: 'Submit',
  submitting: 'Submitting...'
}

const maybePluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`

const projectAreaMap = {
  dropzoneText:
    'Click or drag and drop a file here. Accepted formats are geojson, KML and shapefile. Shapefiles must be provided as a .zip file containing the minimum set of shapefile files (.shp, .shx and .dbf).',
  siteArea: 'Site Area',
  siteAreaInstructions:
    'Draw the site area on the map or upload from file. Uploaded geometry can be edited. Only polygon geometry from uploaded files will be included. Lines and points will be ignored. ',
  uploadErrorPrefix:
    'Please check that your uploaded file contains valid geometry. An error occured uploading site area',
  getLineAndPointCounts: (lineCount, pointCount) => {
    const fileContains = 'Uploaded file contains'
    const notIncluded = 'which will not be included in the site area'

    if (lineCount && pointCount) {
      return `${fileContains} ${maybePluralize(lineCount, 'line')} and ${maybePluralize(
        pointCount,
        'point'
      )} ${notIncluded}.`
    }

    if (lineCount) {
      return `${fileContains} ${maybePluralize(lineCount, 'line')} ${notIncluded}.`
    }

    if (pointCount) {
      return `${fileContains} ${maybePluralize(pointCount, 'point')} ${notIncluded}.`
    }
  }
}

const header = {
  logout: 'Logout'
}

export default {
  buttons,
  error,
  form,
  header,
  multiselectWithOtherFormQuestion,
  pages,
  projectAreaMap,
  success
}
